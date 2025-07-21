const express = require('express')
const router = express.Router()
const Accessory = require('../models/Accessory')
const { auth, requireRole } = require('../middleware/auth')

// Get all accessories (public)
router.get('/', async (req, res) => {
  try {
    const accessories = await Accessory.find({ isAvailable: true })
      .populate('addedBy', 'fullName')
      .sort({ createdAt: -1 })
    res.json(accessories)
  } catch (error) {
    console.error('Error fetching accessories:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get accessory by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const accessory = await Accessory.findById(req.params.id)
      .populate('addedBy', 'fullName')
    if (!accessory) {
      return res.status(404).json({ message: 'Accessory not found' })
    }
    res.json(accessory)
  } catch (error) {
    console.error('Error fetching accessory:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Add new accessory (admin only)
router.post('/', auth, requireRole(['admin']), async (req, res) => {
  try {
    const { name, description, cost, image, animalType, useCase } = req.body

    if (!name || !description || !cost || !image || !animalType || !useCase) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const accessory = new Accessory({
      name,
      description,
      cost,
      image,
      animalType,
      useCase,
      addedBy: req.user.id
    })

    await accessory.save()
    res.status(201).json(accessory)
  } catch (error) {
    console.error('Error adding accessory:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update accessory (admin only)
router.put('/:id', auth, requireRole(['admin']), async (req, res) => {
  try {
    const { name, description, cost, image, animalType, useCase, isAvailable } = req.body

    const accessory = await Accessory.findById(req.params.id)
    if (!accessory) {
      return res.status(404).json({ message: 'Accessory not found' })
    }

    accessory.name = name || accessory.name
    accessory.description = description || accessory.description
    accessory.cost = cost || accessory.cost
    accessory.image = image || accessory.image
    accessory.animalType = animalType || accessory.animalType
    accessory.useCase = useCase || accessory.useCase
    accessory.isAvailable = isAvailable !== undefined ? isAvailable : accessory.isAvailable

    await accessory.save()
    res.json(accessory)
  } catch (error) {
    console.error('Error updating accessory:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete accessory (admin only)
router.delete('/:id', auth, requireRole(['admin']), async (req, res) => {
  try {
    const accessory = await Accessory.findById(req.params.id)
    if (!accessory) {
      return res.status(404).json({ message: 'Accessory not found' })
    }

    await Accessory.findByIdAndDelete(req.params.id)
    res.json({ message: 'Accessory deleted successfully' })
  } catch (error) {
    console.error('Error deleting accessory:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get accessories by animal type (public)
router.get('/animal/:type', async (req, res) => {
  try {
    const accessories = await Accessory.find({ 
      animalType: { $in: [req.params.type, 'All'] },
      isAvailable: true 
    }).populate('addedBy', 'fullName')
    res.json(accessories)
  } catch (error) {
    console.error('Error fetching accessories by type:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router 