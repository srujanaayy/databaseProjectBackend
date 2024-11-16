// // const express = require('express');
// // const router = express.Router();
// // const orderModel = require('../models/orderModel');

// // async function createOrder(req, res) {
// //     const { userId, trackingId, amount, amountTax } = req.body;

// //     if (!userId || !trackingId || !amount || !amountTax) {
// //         return res.status(400).json({ success: false, message: 'Invalid order data' });
// //     }

// //     try {
// //         const result = await orderModel.createOrder(userId, trackingId, amount, amountTax);

// //         if (result.success) {
// //             res.status(201).json({
// //                 success: true,
// //                 message: 'Order created successfully',
// //                 orderId: result.orderId,
// //                 orderDetails: {
// //                     userId,
// //                     trackingId,
// //                     amount,
// //                     amountTax,
// //                     datePlaced: result.datePlaced
// //                 }
// //             });
// //         } else {
// //             res.status(500).json({ success: false, message: 'Order creation failed', error: result.error });
// //         }
// //     } catch (error) {
// //         console.error('Order creation error:', error);
// //         res.status(500).json({ success: false, message: 'Internal server error' });
// //     }
// // }

// // router.post('/create-order', createOrder);

// // module.exports = {createOrder};
// const express = require("express");
// const router = express.Router();
// const orderModel = require("../models/orderModel");

// async function createOrder(req, res) {
//   const {
//     customerId,
//     shippingAddress,
//     productDetails,
//     status = "Pending",
//   } = req.body;

//   // Check if essential order details are provided
//   if (
//     !customerId ||
//     !shippingAddress ||
//     !productDetails ||
//     productDetails.length === 0
//   ) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Invalid order data" });
//   }

//   try {
//     // Step 1: Create an order entry in the Orders table
//     const orderResult = await orderModel.createOrder(
//       customerId,
//       status,
//       shippingAddress
//     );

//     if (!orderResult.success) {
//       return res
//         .status(500)
//         .json({
//           success: false,
//           message: "Order creation failed",
//           error: orderResult.error,
//         });
//     }

//     // Retrieve the newly created OrderID
//     const orderId = orderResult.orderId;
//     const datePlaced = orderResult.datePlaced;

//     // Step 2: Insert ordered items
//     let orderedItems = [];
//     for (const item of productDetails) {
//       const { productId, quantity, paymentId } = item;
//       if (!productId || !quantity || !paymentId) {
//         return res
//           .status(400)
//           .json({
//             success: false,
//             message: "Invalid product details in order",
//           });
//       }

//       // Save each ordered item and store it in the orderedItems array
//       const orderedItemResult = await orderModel.createOrderedItem(
//         orderId,
//         productId,
//         paymentId,
//         quantity
//       );
//       if (!orderedItemResult.success) {
//         return res
//           .status(500)
//           .json({
//             success: false,
//             message: "Failed to add ordered items",
//             error: orderedItemResult.error,
//           });
//       }

//       orderedItems.push({ productId, quantity, paymentId });
//     }

//     // Return success response with order details
//     res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       orderId,
//       orderDetails: {
//         customerId,
//         orderId,
//         status,
//         shippingAddress,
//         datePlaced,
//         orderedItems,
//       },
//     });
//   } catch (error) {
//     console.error("Order creation error:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// }

// // Endpoint to create an order
// router.post("/create-order", createOrder);

// module.exports = { createOrder };
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