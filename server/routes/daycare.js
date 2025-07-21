import express from 'express';
import User from '../models/User.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const daycares = await User.find({ role: 'daycare', isActive: true }).select('-password');
    res.json(daycares);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router; 