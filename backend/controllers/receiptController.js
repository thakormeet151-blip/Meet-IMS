const Receipt = require('../models/Receipt');
const Product = require('../models/Product');

exports.getReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find()
      .populate('product', 'name sku')
      .populate('createdBy', 'name')
      .sort('-createdAt');
    res.json({ success: true, count: receipts.length, data: receipts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReceipt = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const receipt = await Receipt.create(req.body);
    await receipt.populate('product', 'name sku');
    res.status(201).json({ success: true, data: receipt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.validateReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) return res.status(404).json({ message: 'Receipt not found' });
    if (receipt.status !== 'pending') {
      return res.status(400).json({ message: 'Receipt already processed' });
    }
    receipt.status = 'validated';
    receipt.validatedBy = req.user.id;
    receipt.validatedAt = new Date();
    await receipt.save();

    // Update stock
    await Product.findByIdAndUpdate(receipt.product, {
      $inc: { stockQuantity: receipt.quantity }
    });

    await receipt.populate('product', 'name sku');
    res.json({ success: true, data: receipt, message: 'Receipt validated and stock updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    ).populate('product', 'name sku');
    if (!receipt) return res.status(404).json({ message: 'Receipt not found' });
    res.json({ success: true, data: receipt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
