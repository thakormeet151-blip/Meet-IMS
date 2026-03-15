const mongoose = require('mongoose');

const adjustmentSchema = new mongoose.Schema({
  adjustmentNumber: {
    type: String,
    unique: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  oldQuantity: {
    type: Number,
    required: true
  },
  newQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  difference: Number,
  reason: {
    type: String,
    required: [true, 'Reason for adjustment is required'],
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

adjustmentSchema.pre('save', async function(next) {
  if (!this.adjustmentNumber) {
    const count = await mongoose.model('Adjustment').countDocuments();
    this.adjustmentNumber = `ADJ-${String(count + 1).padStart(5, '0')}`;
  }
  this.difference = this.newQuantity - this.oldQuantity;
  next();
});

module.exports = mongoose.model('Adjustment', adjustmentSchema);
