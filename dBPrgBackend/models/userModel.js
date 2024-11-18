onst { pool } = require("../db");
const sql = require("mysql2");

async function createUser(email, password, customerData) {
  let transaction;

  try {
    // Start a new transaction
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    // Step 1: Insert into the Customer table
    const customerRequest = new sql.Request(transaction);
    const customerResult = await customerRequest
      .input("firstName", sql.VarChar(50), customerData.firstName)
      .input("lastName", sql.VarChar(50), customerData.lastName)
      .input("email", sql.VarChar(100), email)
      .input("phoneNumber", sql.VarChar(15), customerData.phoneNumber)
      .input("cardNumber", sql.VarChar(19), customerData.cardNumber).query(`
        INSERT INTO Customer (FirstName, LastName, EmailAddress, PhoneNumber, CardNumber)
        OUTPUT INSERTED.CustomerID
        VALUES (@firstName, @lastName, @email, @phoneNumber, @cardNumber)
      `);

    const customerId = customerResult.recordset[0].CustomerID;

    // Step 2: Insert or update card information in CardInformation table
    if (customerData.billingAddress) {
      const cardRequest = new sql.Request(transaction);
      await cardRequest
        .input("cardNumber", sql.VarChar(19), customerData.cardNumber)
        .input("billingAddress", sql.VarChar(255), customerData.billingAddress)
        .query(`
          MERGE CardInformation AS target
          USING (VALUES (@cardNumber, @billingAddress)) AS source (CardNumber, BillingAddress)
          ON target.CardNumber = source.CardNumber
          WHEN MATCHED THEN 
            UPDATE SET BillingAddress = source.BillingAddress
          WHEN NOT MATCHED THEN 
            INSERT (CardNumber, BillingAddress) VALUES (source.CardNumber, source.BillingAddress);
        `);
    }

    await transaction.commit();
    return { success: true, customerId };
  } catch (error) {
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error("Error rolling back transaction:", rollbackError);
      }
    }
    throw error;
  }
}

async function getUserByEmail(email) {
  try {
    const result = await pool.request().input("email", sql.VarChar(100), email)
      .query(`
        SELECT c.CustomerID, c.FirstName, c.LastName, c.EmailAddress, c.PhoneNumber, 
               c.CardNumber, ci.BillingAddress
        FROM Customer AS c
        LEFT JOIN CardInformation AS ci ON c.CardNumber = ci.CardNumber
        WHERE c.EmailAddress = @email
      `);

    return result.recordset[0];
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUserByEmail,
};
