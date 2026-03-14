const express = require("express");
const router = express.Router();
const { addProduct, getProducts, deleteProduct, updateProduct } = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

// Apply auth middleware to all routes
router.use(authMiddleware);

router.post("/", addProduct);
router.get("/", getProducts);
router.delete("/:id", deleteProduct);
router.put("/:id", updateProduct);

module.exports = router;