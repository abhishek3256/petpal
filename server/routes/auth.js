const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, age, sex, location, role, hourlyRate, image, contactNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const user = new User({
      email,
      password,
      fullName,
      age,
      sex,
      location,
      role,
      hourlyRate: role !== 'buyer' ? hourlyRate : 0,
      image,
      contactNumber: contactNumber || ''
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        image: user.image
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully.' });
});

router.get('/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      fullName: req.user.fullName,
      role: req.user.role,
      age: req.user.age,
      sex: req.user.sex,
      location: req.user.location,
      hourlyRate: req.user.hourlyRate,
      image: req.user.image
    }
  });
});

router.get('/users', auth, requireRole(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Admin can edit any user
router.put('/users/:id', auth, requireRole(['admin']), async (req, res) => {
  try {
    const { fullName, email, age, sex, location, role, hourlyRate, image, contactNumber, isActive } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (fullName !== undefined) user.fullName = fullName;
    if (email !== undefined) user.email = email;
    if (age !== undefined) user.age = age;
    if (sex !== undefined) user.sex = sex;
    if (location !== undefined) user.location = location;
    if (role !== undefined) user.role = role;
    if (hourlyRate !== undefined) user.hourlyRate = hourlyRate;
    if (image !== undefined) user.image = image;
    if (contactNumber !== undefined) user.contactNumber = contactNumber;
    if (isActive !== undefined) user.isActive = isActive;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 