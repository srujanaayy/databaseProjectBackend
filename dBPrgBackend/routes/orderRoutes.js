const express = require("express");
const router = express.Router();
const { promisePool } = require("db");
router.post("/place-order", async (req, res) => {
  const { customerId, shippingAddress, cartItems } = req.body;
  if (!customerId || !shippingAddress || !cartItems || cartItems.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid order data" });
  }
  let connection;
  try {
    connection = await promisePool.getConnection();
    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      `
            INSERT INTO Orders (CustomerID, ShippingAddress, Status)
            VALUES (?, ?, 'Pending')
          `,
      [customerId, shippingAddress]
    );

    const orderId = orderResult.insertId;
    for (const item of cartItems) {
      const { productId, quantity } = item;

      // Check if the product has enough stock
      const [productResult] = await connection.query(
        `
              SELECT StockQuantity FROM Product WHERE ProductID = ?
            `,
        [productId]
      );

      const product = productResult[0];

      if (product && product.StockQuantity >= quantity) {
        // Update inventory: Decrease stock quantity
        await connection.query(
          `
                UPDATE Product
                SET StockQuantity = StockQuantity - ?
                WHERE ProductID = ?
              `,
          [quantity, productId]
        );
        await connection.query(
          `
                INSERT INTO OrderedItems (OrderID, ProductID, Quantity)
                VALUES (?, ?, ?)
              `,
          [orderId, productId, quantity]
        );
      } else {
        // If not enough stock, rollback transaction
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Not enough stock for Product ID: ${productId}`,
        });
      }
    }
    // Commit the transaction
    await connection.commit();

    // Return success response
    res
      .status(200)
      .json({ success: true, message: "Order placed successfully", orderId });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  } finally {
    if (connection) connection.release();
  }
});
router.get("/order/:orderId", async (req, res) => {
  const orderId = req.params.orderId;

  if (!orderId) {
    return res
      .status(400)
      .json({ success: false, message: "Order ID is required" });
  }

  try {
    // Get order details from the Orders table
    const [orderResult] = await promisePool.query(
      `
        SELECT * FROM Orders WHERE OrderID = ?
      `,
      [orderId]
    );

    if (orderResult.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Get the ordered items for this order
    const [orderedItemsResult] = await promisePool.query(
      `
        SELECT oi.OrderedItemID, oi.Quantity, p.Name, p.Price
        FROM OrderedItems oi
        JOIN Product p ON oi.ProductID = p.ProductID
        WHERE oi.OrderID = ?
      `,
      [orderId]
    );

    res.status(200).json({
      success: true,
      order: orderResult[0],
      orderedItems: orderedItemsResult,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
