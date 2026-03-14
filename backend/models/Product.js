const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  sku: { 
    type: String, 
    required: true, 
    unique: true 
  },
  category: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  stock: { 
    type: Number, 
    default: 0,
    min: 0
  },
  location: {
    type: String,
    required: true
  },
  price: Number,
  description: String,
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model("Product", productSchema);