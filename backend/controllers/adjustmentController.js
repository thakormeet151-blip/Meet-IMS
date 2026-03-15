const Adjustment = require('../models/Adjustment');
const Product = require('../models/Product');

exports.getAdjustments = async (req, res) => {
  try {
    const adjustments = await Adjustment.find()
      .populate('product', 'name sku')
      .populate('createdBy', 'name')
      .sort('-createdAt');
    res.json({ success: true, count: adjustments.length, data: adjustments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAdjustment = async (req, res) => {
  try {
    const product = await Product.findById(req.body.product);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    req.body.oldQuantity = product.stockQuantity;
    req.body.createdBy = req.user.id;

    const adjustment = await Adjustment.create(req.body);

    await Product.findByIdAndUpdate(req.body.product, {
      stockQuantity: req.body.newQuantity
    });

    await adjustment.populate('product', 'name sku');
    res.status(201).json({ success: true, data: adjustment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
