import express from 'express';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { providerId, serviceType, appointmentDate, appointmentTime, notes } = req.body;
    const provider = await User.findById(providerId);
    if (!provider || !provider.isActive) {
      return res.status(404).json({ message: 'Service provider not available.' });
    }
    const appointment = new Appointment({
      buyer: req.user._id,
      provider: providerId,
      serviceType,
      appointmentDate,
      appointmentTime,
      notes
    });
    await appointment.save();
    await appointment.populate('provider', 'fullName role contactNumber email');
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router; 