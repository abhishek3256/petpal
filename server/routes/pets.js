const express = require('express');
const Pet = require('../models/Pet');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Show all pets, regardless of stock
    const pets = await Pet.find().populate('seller', 'fullName location');
    res.json(pets);
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/', auth, requireRole(['seller']), async (req, res) => {
  try {
    const { name, type, breed, age, price, description, image, stock } = req.body;
    
    const pet = new Pet({
      name,
      type,
      breed,
      age,
      price,
      description,
      image,
      stock,
      seller: req.user._id
    });

    await pet.save();
    res.status(201).json(pet);
  } catch (error) {
    console.error('Error adding pet:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/admin', auth, requireRole(['admin']), async (req, res) => {
  try {
    const { name, type, breed, age, price, description, image, stock } = req.body;
    
    const pet = new Pet({
      name,
      type,
      breed,
      age,
      price,
      description,
      image,
      stock,
      seller: req.user._id
    });

    await pet.save();
    res.status(201).json(pet);
  } catch (error) {
    console.error('Error adding pet as admin:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/my-pets', auth, requireRole(['seller']), async (req, res) => {
  try {
    const pets = await Pet.find({ seller: req.user._id });
    res.json(pets);
  } catch (error) {
    console.error('Error fetching my pets:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.put('/:id', auth, requireRole(['seller', 'admin']), async (req, res) => {
  try {
    let pet;
    if (req.user.role === 'admin') {
      pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    } else {
      pet = await Pet.findOneAndUpdate(
        { _id: req.params.id, seller: req.user._id },
        req.body,
        { new: true }
      );
    }
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found.' });
    }
    res.json(pet);
  } catch (error) {
    console.error('Error updating pet:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.delete('/:id', auth, requireRole(['seller', 'admin']), async (req, res) => {
  try {
    let pet;
    if (req.user.role === 'admin') {
      pet = await Pet.findByIdAndDelete(req.params.id);
    } else {
      pet = await Pet.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
    }
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found.' });
    }
    
    res.json({ message: 'Pet deleted successfully.' });
  } catch (error) {
    console.error('Error deleting pet:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 