const express = require('express');
const router = express.Router();
const { getDeliveries, createDelivery, updateDeliveryStatus } = require('../controllers/deliveryController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getDeliveries).post(createDelivery);
router.put('/:id/status', updateDeliveryStatus);

module.exports = router;
