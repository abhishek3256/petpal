import express from 'express';
import Accessory from '../models/Accessory.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const accessories = await Accessory.find().populate('addedBy', 'fullName');
    res.json(accessories);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/', auth, requireRole(['seller', 'admin']), async (req, res) => {
  try {
    const { name, description, cost, image, animalType, useCase } = req.body;
    const accessory = new Accessory({
      name,
      description,
      cost,
      image,
      animalType,
      useCase,
      addedBy: req.user._id
    });
    await accessory.save();
    res.status(201).json(accessory);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.put('/:id', auth, requireRole(['seller', 'admin']), async (req, res) => {
  try {
    const accessory = await Accessory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!accessory) {
      return res.status(404).json({ message: 'Accessory not found.' });
    }
    res.json(accessory);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.delete('/:id', auth, requireRole(['seller', 'admin']), async (req, res) => {
  try {
    const accessory = await Accessory.findByIdAndDelete(req.params.id);
    if (!accessory) {
      return res.status(404).json({ message: 'Accessory not found.' });
    }
    res.json({ message: 'Accessory deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router; 