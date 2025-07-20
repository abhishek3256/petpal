const express = require('express');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const vets = await User.find({ role: 'vet', isActive: true }).select('-password');
    res.json(vets);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/profile/:id', async (req, res) => {
  try {
    const vet = await User.findById(req.params.id).select('-password');
    
    if (!vet || vet.role !== 'vet') {
      return res.status(404).json({ message: 'Vet not found.' });
    }
    
    res.json(vet);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 