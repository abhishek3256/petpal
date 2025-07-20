const express = require('express');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const daycares = await User.find({ role: 'daycare', isActive: true }).select('-password');
    res.json(daycares);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/profile/:id', async (req, res) => {
  try {
    const daycare = await User.findById(req.params.id).select('-password');
    
    if (!daycare || daycare.role !== 'daycare') {
      return res.status(404).json({ message: 'Daycare not found.' });
    }
    
    res.json(daycare);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 