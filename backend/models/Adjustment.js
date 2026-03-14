const mongoose = require("mongoose");

const adjustmentSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  old_quantity: { 
    type: Number, 
    required: true 
  },
  new_quantity: { 
    type: Number, 
    required: true 
  },
  reason: {
    type: String,
    enum: ['damage', 'loss', 'found', 'correction', 'other'],
    required: true
  },
  notes: String,
  date: { 
    type: Date, 
    default: Date.now 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model("Adjustment", adjustmentSchema);