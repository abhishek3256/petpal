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
    if (!pet || !pet.isAvailable) {
      return res.status(404).json({ message: 'Pet not available.' });
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
    
    pet.isAvailable = false;
    await pet.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/accessory', auth, async (req, res) => {
  try {
    const { accessoryId, quantity = 1 } = req.body;
    
    const accessory = await Accessory.findById(accessoryId);
    if (!accessory || !accessory.isAvailable || accessory.stock < quantity) {
      return res.status(404).json({ message: 'Accessory not available.' });
    }

    const order = new Order({
      buyer: req.user._id,
      seller: null,
      type: 'accessory',
      item: accessoryId,
      itemModel: 'Accessory',
      amount: accessory.price * quantity
    });

    await order.save();
    
    accessory.stock -= quantity;
    if (accessory.stock === 0) {
      accessory.isAvailable = false;
    }
    await accessory.save();

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

module.exports = router; 