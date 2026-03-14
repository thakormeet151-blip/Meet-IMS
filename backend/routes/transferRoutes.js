const express = require("express");
const router = express.Router();
const { addTransfer, getTransfers } = require("../controllers/transferController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/", addTransfer);
router.get("/", getTransfers);

module.exports = router;