const express = require("express");
const router = express.Router();
const orderModel = require("../models/orderModel");

async function createOrder(req, res) {
  const {
    customerId,
    shippingAddress,
    productDetails, // Array of products in the order
    basePrice,
    discount,
    tax,
    shippingFee,
    status = "Pending",
  } = req.body;

  if (
    !customerId ||
    !shippingAddress ||
    !productDetails ||
    productDetails.length === 0 ||
    basePrice === undefined ||
    discount === undefined ||
    tax === undefined ||
    shippingFee === undefined
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid order data" });
  }

  try {
    // Step 1: Calculate total price based on inputs
    const totalPrice = basePrice - discount + tax + shippingFee;

    // Step 2: Ensure price details exist in Price table
    const priceResult = await orderModel.createOrGetPrice(
      basePrice,
      discount,
      tax,
      shippingFee,
      totalPrice
    );
    if (!priceResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to create or retrieve price details",
        error: priceResult.error,
      });
    }

    // Step 3: Create an entry in Orders table
    const orderResult = await orderModel.createOrder(
      customerId,
      shippingAddress,
      status
    );

    if (!orderResult.success) {
      return res.status(500).json({
        success: false,
        message: "Order creation failed",
        error: orderResult.error,
      });
    }

    // Extract OrderID and DatePlaced from result
    const orderId = orderResult.orderId;
    const datePlaced = orderResult.datePlaced;

    // Step 4: Create a payment entry in Payment table
    const paymentResult = await orderModel.createPayment(
      customerId,
      basePrice,
      discount,
      tax,
      shippingFee
    );

    if (!paymentResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to create payment record",
        error: paymentResult.error,
      });
    }

    const paymentId = paymentResult.paymentId;

    // Step 5: Insert each ordered item into OrderedItem table
    let orderedItems = [];
    for (const item of productDetails) {
      const { productId, quantity } = item;
      if (!productId || !quantity) {
        return res.status(400).json({
          success: false,
          message: "Invalid product details in order",
        });
      }

      const orderedItemResult = await orderModel.createOrderedItem(
        orderId,
        productId,
        paymentId,
        quantity
      );

      if (!orderedItemResult.success) {
        return res.status(500).json({
          success: false,
          message: "Failed to add ordered items",
          error: orderedItemResult.error,
        });
      }

      orderedItems.push({ productId, quantity });
    }

    // Step 6: Return success response with order details
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId,
      orderDetails: {
        customerId,
        orderId,
        status,
        shippingAddress,
        datePlaced,
        totalPrice,
        orderedItems,
      },
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Endpoint to create an order
router.post("/create-order", createOrder);

module.exports = router;
