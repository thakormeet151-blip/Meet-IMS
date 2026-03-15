const express = require('express');
const router = express.Router();
const { getTransfers, createTransfer, completeTransfer } = require('../controllers/transferController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getTransfers).post(createTransfer);
router.put('/:id/complete', completeTransfer);

module.exports = router;
