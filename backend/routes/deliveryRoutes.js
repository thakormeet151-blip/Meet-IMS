const express = require("express");
const router = express.Router();
const { addDelivery, getDeliveries } = require("../controllers/deliveryController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/", addDelivery);
router.get("/", getDeliveries);

module.exports = router;