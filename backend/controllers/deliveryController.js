const Delivery = require("../models/Delivery");
const Product = require("../models/Product");

exports.addDelivery = async (req, res) => {
  try {
    const { product, customer, quantity } = req.body;
    
    // Check stock
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    if (productDoc.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Create delivery
    const delivery = await Delivery.create({
      product,
      customer,
      quantity,
      user: req.user.id
    });

    // Update product stock
    await Product.findByIdAndUpdate(product, {
      $inc: { stock: -quantity }
    });

    res.status(201).json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ user: req.user.id })
      .populate('product', 'name sku')
      .sort('-date');
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};