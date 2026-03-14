const Product = require("../models/Product");
const Receipt = require("../models/Receipt");
const Delivery = require("../models/Delivery");
const Transfer = require("../models/Transfer");
const Adjustment = require("../models/Adjustment");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get total products
    const totalProducts = await Product.countDocuments({ user: userId });

    // Get low stock items (stock < 10)
    const lowStockItems = await Product.countDocuments({ 
      user: userId, 
      stock: { $lt: 10 } 
    });

    // Get pending receipts
    const pendingReceipts = await Receipt.countDocuments({ 
      user: userId,
      date: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
    });

    // Get pending deliveries
    const pendingDeliveries = await Delivery.countDocuments({ 
      user: userId,
      status: 'pending'
    });

    // Get transfers scheduled
    const transfersScheduled = await Transfer.countDocuments({ 
      user: userId,
      status: 'pending'
    });

    // Get recent receipts
    const recentReceipts = await Receipt.find({ user: userId })
      .populate('product', 'name')
      .sort('-date')
      .limit(5);

    // Get recent deliveries
    const recentDeliveries = await Delivery.find({ user: userId })
      .populate('product', 'name')
      .sort('-date')
      .limit(5);

    res.json({
      stats: {
        totalProducts,
        lowStockItems,
        pendingReceipts,
        pendingDeliveries,
        transfersScheduled
      },
      recentReceipts,
      recentDeliveries
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};