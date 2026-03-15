const express = require('express');
const router = express.Router();
const { getReceipts, createReceipt, validateReceipt, cancelReceipt } = require('../controllers/receiptController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getReceipts).post(createReceipt);
router.put('/:id/validate', validateReceipt);
router.put('/:id/cancel', cancelReceipt);

module.exports = router;
