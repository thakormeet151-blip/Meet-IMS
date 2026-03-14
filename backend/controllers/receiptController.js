const Receipt = require("../models/Receipt");
const Product = require("../models/Product");

exports.addReceipt = async (req, res) => {
  try {
    const { product, supplier, quantity } = req.body;
    
    // Create receipt
    const receipt = await Receipt.create({
      product,
      supplier,
      quantity,
      user: req.user.id
    });

    // Update product stock
    await Product.findByIdAndUpdate(product, {
      $inc: { stock: quantity }
    });

    res.status(201).json(receipt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find({ user: req.user.id })
      .populate('product', 'name sku')
      .sort('-date');
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};