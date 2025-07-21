import express from 'express';
import Pet from '../models/Pet.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find().populate('seller', 'fullName location');
    res.json(pets);
  } catch (error) {
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
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/my-pets', auth, requireRole(['seller']), async (req, res) => {
  try {
    const pets = await Pet.find({ seller: req.user._id });
    res.json(pets);
  } catch (error) {
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
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router; 