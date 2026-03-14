const express = require("express");
const router = express.Router();
const { addReceipt, getReceipts } = require("../controllers/receiptController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/", addReceipt);
router.get("/", getReceipts);

module.exports = router;