const express = require('express');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Book an appointment (any user)
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
    // Populate provider for response
    await appointment.populate('provider', 'fullName role contactNumber email');
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get appointments for current user (booked)
router.get('/my', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ buyer: req.user._id })
      .populate('provider', 'fullName role contactNumber email')
      .sort({ appointmentDate: 1, appointmentTime: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get appointments for provider (taken)
router.get('/provider', auth, requireRole(['vet', 'walker', 'daycare']), async (req, res) => {
  try {
    const appointments = await Appointment.find({ provider: req.user._id })
      .populate('buyer', 'fullName contactNumber email')
      .populate('provider', 'fullName role contactNumber email')
      .sort({ appointmentDate: 1, appointmentTime: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Admin: Get all appointments
router.get('/all', auth, requireRole(['admin']), async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('buyer', 'fullName contactNumber email')
      .populate('provider', 'fullName contactNumber email role')
      .sort({ appointmentDate: 1, appointmentTime: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Reschedule appointment (admin or owner)
router.put('/:id/reschedule', auth, async (req, res) => {
  try {
    const { appointmentDate, appointmentTime } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }
    // Only admin or the buyer can reschedule
    if (
      req.user.role !== 'admin' &&
      String(appointment.buyer) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    if (appointmentDate !== undefined) appointment.appointmentDate = appointmentDate;
    if (appointmentTime !== undefined) appointment.appointmentTime = appointmentTime;
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Cancel appointment (admin, buyer, or provider)
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }
    // Only admin, buyer, or provider can cancel
    if (
      req.user.role !== 'admin' &&
      String(appointment.buyer) !== String(req.user._id) &&
      String(appointment.provider) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment cancelled successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 