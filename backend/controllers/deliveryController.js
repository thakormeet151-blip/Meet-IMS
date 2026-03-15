const Delivery = require('../models/Delivery');
const Product = require('../models/Product');

exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate('product', 'name sku stockQuantity')
      .populate('createdBy', 'name')
      .sort('-createdAt');
    res.json({ success: true, count: deliveries.length, data: deliveries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createDelivery = async (req, res) => {
  try {
    const product = await Product.findById(req.body.product);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stockQuantity < req.body.quantity) {
      return res.status(400).json({
        message: `Insufficient stock. Available: ${product.stockQuantity}`
      });
    }

    req.body.createdBy = req.user.id;
    const delivery = await Delivery.create(req.body);

    // Deduct stock immediately on creation
    await Product.findByIdAndUpdate(req.body.product, {
      $inc: { stockQuantity: -req.body.quantity }
    });

    await delivery.populate('product', 'name sku');
    res.status(201).json({ success: true, data: delivery });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('product', 'name sku');
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    res.json({ success: true, data: delivery });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
