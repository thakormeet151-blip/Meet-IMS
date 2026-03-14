const Transfer = require("../models/Transfer");
const Product = require("../models/Product");

exports.addTransfer = async (req, res) => {
  try {
    const { product, from_location, to_location, quantity } = req.body;
    
    // Check stock
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    if (productDoc.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Create transfer
    const transfer = await Transfer.create({
      product,
      from_location,
      to_location,
      quantity,
      user: req.user.id
    });

    // Update product location
    await Product.findByIdAndUpdate(product, {
      location: to_location
    });

    res.status(201).json(transfer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find({ user: req.user.id })
      .populate('product', 'name sku')
      .sort('-date');
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};