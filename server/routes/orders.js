const express = require('express');
const Order = require('../models/Order');
const Pet = require('../models/Pet');
const Accessory = require('../models/Accessory');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/pet', auth, async (req, res) => {
  try {
    const { petId } = req.body;
    
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found.' });
    }

    const order = new Order({
      buyer: req.user._id,
      seller: pet.seller,
      type: 'pet',
      item: petId,
      itemModel: 'Pet',
      amount: pet.price
    });

    await order.save();
    // Do NOT decrement stock or set isAvailable

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/accessory', auth, async (req, res) => {
  try {
    const { accessoryId, quantity = 1 } = req.body;
    
    const accessory = await Accessory.findById(accessoryId);
    if (!accessory || !accessory.isAvailable) {
      return res.status(404).json({ message: 'Accessory not available.' });
    }

    const order = new Order({
      buyer: req.user._id,
      seller: accessory.addedBy || null,
      type: 'accessory',
      item: accessoryId,
      itemModel: 'Accessory',
      amount: accessory.cost * quantity
    });

    await order.save();
    // If stock field exists, decrement it
    if (typeof accessory.stock === 'number') {
      accessory.stock -= quantity;
      if (accessory.stock <= 0) {
        accessory.isAvailable = false;
      }
      await accessory.save();
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/service', auth, async (req, res) => {
  try {
    const { serviceProviderId, serviceType, appointmentDate, appointmentTime } = req.body;
    
    const serviceProvider = await User.findById(serviceProviderId);
    if (!serviceProvider || !serviceProvider.isActive) {
      return res.status(404).json({ message: 'Service provider not available.' });
    }

    const order = new Order({
      buyer: req.user._id,
      seller: serviceProviderId,
      type: serviceType,
      item: serviceProviderId,
      itemModel: 'User',
      amount: serviceProvider.hourlyRate,
      appointmentDate,
      appointmentTime
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('seller', 'fullName')
      .populate('item');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/my-sales', auth, requireRole(['seller', 'vet', 'walker', 'daycare']), async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .populate('buyer', 'fullName')
      .populate('item');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/all', auth, requireRole(['admin']), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('buyer', 'fullName')
      .populate('seller', 'fullName')
      .populate('item');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.put('/:id/status', auth, requireRole(['seller', 'vet', 'walker', 'daycare', 'admin']), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete order (admin only)
router.delete('/:id', auth, requireRole(['admin']), async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.json({ message: 'Order deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Admin can update appointment date/time for service orders
router.put('/appointments/:id', auth, requireRole(['admin']), async (req, res) => {
  try {
    const { appointmentDate, appointmentTime } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }
    if (!['vet', 'walker', 'daycare'].includes(order.type)) {
      return res.status(400).json({ message: 'Not a service appointment.' });
    }
    if (appointmentDate !== undefined) order.appointmentDate = appointmentDate;
    if (appointmentTime !== undefined) order.appointmentTime = appointmentTime;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Admin can delete (cancel) any appointment
router.delete('/appointments/:id', auth, requireRole(['admin']), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }
    if (!['vet', 'walker', 'daycare'].includes(order.type)) {
      return res.status(400).json({ message: 'Not a service appointment.' });
    }
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment cancelled successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Admin: Get all appointments (service orders) with professional info populated
router.get('/appointments/all', auth, requireRole(['admin']), async (req, res) => {
  try {
    const appointments = await Order.find({ type: { $in: ['vet', 'walker', 'daycare'] } })
      .populate('buyer', 'fullName contactNumber email')
      .populate('seller', 'fullName contactNumber email role')
      .populate('item');
    // Attach professional info for each type
    const result = appointments.map(appt => {
      const obj = appt.toObject();
      if (appt.type === 'vet') obj.vet = appt.seller;
      if (appt.type === 'walker') obj.walker = appt.seller;
      if (appt.type === 'daycare') obj.daycare = appt.seller;
      return obj;
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get appointments for current user (buyer) or professional (vet, walker, daycare)
router.get('/appointments', auth, async (req, res) => {
  try {
    const { type, mine } = req.query;
    let query = { type: { $in: ['vet', 'walker', 'daycare'] } };
    if (type && ['vet', 'walker', 'daycare'].includes(type) && mine === 'true') {
      // For professionals: appointments where they are the provider
      query.seller = req.user._id;
    } else if (mine === 'true') {
      // For regular users: appointments they booked
      query.buyer = req.user._id;
    }
    const appointments = await Order.find(query)
      .populate('buyer', 'fullName')
      .populate('seller', 'fullName')
      .populate('item');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 