const express = require("express");
const router = express.Router();
const transactionController = require("./transactionController");

// Define the POST route for creating an order
router.post("/create-order", transactionController.createOrder);

module.exports = router;
