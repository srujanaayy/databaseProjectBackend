const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController"); // Adjust the path as necessary

// Route to fetch all products
router.get("/", inventoryController.getAllProducts);

// Route to update a product
router.put("/update", inventoryController.updateProduct);

module.exports = router;
