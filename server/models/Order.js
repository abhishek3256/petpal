import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['pet', 'accessory', 'vet', 'walker', 'daycare'],
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'itemModel',
    required: true
  },
  itemModel: {
    type: String,
    required: true,
    enum: ['Pet', 'Accessory', 'User']
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  appointmentDate: {
    type: Date
  },
  appointmentTime: {
    type: String
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order; 