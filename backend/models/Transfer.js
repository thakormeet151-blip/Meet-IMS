const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  transferNumber: {
    type: String,
    unique: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  fromLocation: {
    type: String,
    required: [true, 'Source location is required'],
    trim: true
  },
  toLocation: {
    type: String,
    required: [true, 'Destination location is required'],
    trim: true
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
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

transferSchema.pre('save', async function(next) {
  if (!this.transferNumber) {
    const count = await mongoose.model('Transfer').countDocuments();
    this.transferNumber = `TRF-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Transfer', transferSchema);
