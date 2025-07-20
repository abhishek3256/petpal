const express = require('express');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const walkers = await User.find({ role: 'walker', isActive: true }).select('-password');
    res.json(walkers);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/profile/:id', async (req, res) => {
  try {
    const walker = await User.findById(req.params.id).select('-password');
    
    if (!walker || walker.role !== 'walker') {
      return res.status(404).json({ message: 'Walker not found.' });
    }
    
    res.json(walker);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 