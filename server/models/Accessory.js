const mongoose = require('mongoose')

const accessorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  animalType: {
    type: String,
    required: true,
    enum: ['Dog', 'Cat', 'Beaver', 'Capybara', 'Lion', 'Tiger', 'Otter', 'All']
  },
  useCase: {
    type: String,
    required: true,
    description: 'How this accessory is useful for the animal'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Accessory', accessorySchema) 