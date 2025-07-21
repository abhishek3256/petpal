import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).populate('item').populate('seller', 'fullName');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { itemId, itemModel, amount, type } = req.body;
    const order = new Order({
      buyer: req.user._id,
      seller: req.body.sellerId,
      type,
      item: itemId,
      itemModel,
      amount
    });
    await order.save();
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

export default router; 