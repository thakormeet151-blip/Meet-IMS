const Transfer = require('../models/Transfer');
const Product = require('../models/Product');

exports.getTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find()
      .populate('product', 'name sku warehouseLocation')
      .populate('createdBy', 'name')
      .sort('-createdAt');
    res.json({ success: true, count: transfers.length, data: transfers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTransfer = async (req, res) => {
  try {
    const product = await Product.findById(req.body.product);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    req.body.createdBy = req.user.id;
    const transfer = await Transfer.create(req.body);

    // Update product location if completed
    if (req.body.status === 'completed') {
      await Product.findByIdAndUpdate(req.body.product, {
        warehouseLocation: req.body.toLocation
      });
    }

    await transfer.populate('product', 'name sku');
    res.status(201).json({ success: true, data: transfer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id);
    if (!transfer) return res.status(404).json({ message: 'Transfer not found' });
    if (transfer.status !== 'pending') {
      return res.status(400).json({ message: 'Transfer already processed' });
    }
    transfer.status = 'completed';
    await transfer.save();

    await Product.findByIdAndUpdate(transfer.product, {
      warehouseLocation: transfer.toLocation
    });

    await transfer.populate('product', 'name sku');
    res.json({ success: true, data: transfer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
