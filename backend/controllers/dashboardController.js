const Product = require('../models/Product');
const Receipt = require('../models/Receipt');
const Delivery = require('../models/Delivery');
const Transfer = require('../models/Transfer');
const Adjustment = require('../models/Adjustment');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ isActive: true });
    const stockAgg = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$stockQuantity' } } }
    ]);
    const totalStock = stockAgg[0]?.total || 0;

    const lowStockItems = await Product.countDocuments({
      isActive: true,
      $expr: { $lte: ['$stockQuantity', '$minStockLevel'] }
    });

    const pendingDeliveries = await Delivery.countDocuments({ status: 'pending' });
    const pendingReceipts = await Receipt.countDocuments({ status: 'pending' });

    const recentReceipts = await Receipt.find()
      .populate('product', 'name sku')
      .populate('createdBy', 'name')
      .sort('-createdAt')
      .limit(5);

    const recentDeliveries = await Delivery.find()
      .populate('product', 'name sku')
      .populate('createdBy', 'name')
      .sort('-createdAt')
      .limit(5);

    const lowStockProducts = await Product.find({
      isActive: true,
      $expr: { $lte: ['$stockQuantity', '$minStockLevel'] }
    }).select('name sku stockQuantity minStockLevel warehouseLocation').limit(5);

    // Monthly stock activity (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyReceipts = await Receipt.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: 'validated' } },
      { $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        total: { $sum: '$quantity' }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthlyDeliveries = await Delivery.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        total: { $sum: '$quantity' }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        stats: { totalProducts, totalStock, lowStockItems, pendingDeliveries, pendingReceipts },
        recentReceipts,
        recentDeliveries,
        lowStockProducts,
        monthlyReceipts,
        monthlyDeliveries
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
