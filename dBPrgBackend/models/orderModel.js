const sql = require("mysql2");
const db = require("./db");

//let orderIDCounter =1;
function generateOrderId() {
  return Math.floor(Math.random() * 1000000); // Combine them to create a unique ID
}

async function createOrder(userId, trackingId, amount, amountTax) {
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    //const orderId =  generateOrderId(); // Generate a unique order_id
    let isUnique = false;
    let orderId;
    // Generate a unique OrderID
    while (!isUnique) {
      orderId = generateOrderId();
      const checkRequest = new sql.Request(transaction);
      const checkResult = await checkRequest
        .input("orderId", sql.Int, orderId)
        .query(`SELECT COUNT(*) AS count FROM Orders WHERE OrderID = @orderId`);
      if (checkResult.recordset[0].count === 0) {
        isUnique = true;
      }
    }

    // Insert into Orders table
    const orderRequest = new sql.Request(transaction);
    const orderResult = await orderRequest
      .input("orderId", sql.Int, orderId)
      .input("customerId", sql.Int, customerId)
      .input("shippingAddress", sql.VarChar(255), shippingAddress).query(`
          INSERT INTO Orders (OrderID, CustomerID, Date, OrderTime, Status, ShippingAddress)
          OUTPUT INSERTED.OrderID, INSERTED.Date
          VALUES (@orderId, @customerId, GETDATE(), GETDATE(), 'Pending', @shippingAddress)
        `);
    const datePlaced = orderResult.recordset[0].Date;

    // Insert into Price table (assuming you create the total price in this step)
    const totalPrice = basePrice - discount + tax + shippingFee;
    const priceRequest = new sql.Request(transaction);
    await priceRequest
      .input("basePrice", sql.Decimal(10, 2), basePrice)
      .input("discount", sql.Decimal(5, 2), discount)
      .input("tax", sql.Decimal(5, 2), tax)
      .input("shippingFee", sql.Decimal(10, 2), shippingFee)
      .input("totalPrice", sql.Decimal(10, 2), totalPrice).query(`
          INSERT INTO Price (BasePrice, Discount, Tax, ShippingFee, TotalPrice)
          VALUES (@basePrice, @discount, @tax, @shippingFee, @totalPrice)
        `);

    // Insert into Payment table
    const paymentRequest = new sql.Request(transaction);
    const paymentResult = await paymentRequest
      .input("customerId", sql.Int, customerId)
      .input("basePrice", sql.Decimal(10, 2), basePrice)
      .input("discount", sql.Decimal(5, 2), discount)
      .input("tax", sql.Decimal(5, 2), tax)
      .input("shippingFee", sql.Decimal(10, 2), shippingFee).query(`
          INSERT INTO Payment (CustomerID, BasePrice, Discount, Tax, ShippingFee)
          OUTPUT INSERTED.PaymentID
          VALUES (@customerId, @basePrice, @discount, @tax, @shippingFee)
        `);
    const paymentId = paymentResult.recordset[0].PaymentID;

    // Insert each item in productItems into OrderedItem table
    for (const item of productItems) {
      const itemRequest = new sql.Request(transaction);
      await itemRequest
        .input("productId", sql.Int, item.productId)
        .input("orderId", sql.Int, orderId)
        .input("paymentId", sql.Int, paymentId)
        .input("quantity", sql.Int, item.quantity).query(`
            INSERT INTO OrderedItem (ProductID, OrderID, PaymentID, Quantity)
            VALUES (@productId, @orderId, @paymentId, @quantity)
          `);
    }

    // Commit the transaction
    await transaction.commit();

    console.log(`Order created: ${orderId}, Date Placed: ${datePlaced}`);
    return { success: true, orderId, datePlaced };
  } catch (error) {
    await transaction.rollback();
    console.error("Order creation error:", error);
    throw new Error("Transaction failed");
  }
}

module.exports = { createOrder };
