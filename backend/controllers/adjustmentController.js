const Adjustment = require("../models/Adjustment");
const Product = require("../models/Product");

exports.addAdjustment = async (req, res) => {
  try {
    const { product, location, new_quantity, reason, notes } = req.body;
    
    // Get current stock
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({ message: "Product not found" });
    }

    const old_quantity = productDoc.stock;

    // Create adjustment
    const adjustment = await Adjustment.create({
      product,
      location,
      old_quantity,
      new_quantity,
      reason,
      notes,
      user: req.user.id
    });

    // Update product stock
    await Product.findByIdAndUpdate(product, {
      stock: new_quantity
    });

    res.status(201).json(adjustment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAdjustments = async (req, res) => {
  try {
    const adjustments = await Adjustment.find({ user: req.user.id })
      .populate('product', 'name sku')
      .sort('-date');
    res.json(adjustments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};