import express from 'express';
import User from '../models/User.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const vets = await User.find({ role: 'vet', isActive: true }).select('-password');
    res.json(vets);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router; 