const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  deliveryNumber: {
    type: String,
    unique: true
  },
  customer: {
    type: String,
    required: [true, 'Customer is required'],
    trim: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'dispatched', 'delivered', 'cancelled'],
    default: 'pending'
  },
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

deliverySchema.pre('save', async function(next) {
  if (!this.deliveryNumber) {
    const count = await mongoose.model('Delivery').countDocuments();
    this.deliveryNumber = `DEL-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Delivery', deliverySchema);
