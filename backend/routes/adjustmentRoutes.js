const express = require("express");
const router = express.Router();
const { addAdjustment, getAdjustments } = require("../controllers/adjustmentController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/", addAdjustment);
router.get("/", getAdjustments);

module.exports = router;