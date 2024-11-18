// const { pool } = require("../config/db");
// const sql = require("mssql");

// async function createUser(email, password, customerData) {
//   let transaction;

//   try {
//     // Ensure we have a connection
//     await pool.connect();

//     transaction = new sql.Transaction(pool);
//     await transaction.begin();

//     // Insert into CUSTOMER table first
//     const customerRequest = new sql.Request(transaction);
//     await customerRequest
//       .input("customer_name", customerData.customerName)
//       .input("customer_id", customerData.customerId)
//       .input("phone_no", customerData.phoneNo)
//       .input("street", customerData.street)
//       .input("city", customerData.city)
//       .input("state", customerData.state)
//       .input("zipcode", customerData.zipcode)
//       .input("country", customerData.country).query(`
//         INSERT INTO CUSTOMER
//         (customer_name, customer_id, phone_no, street, city, state, zipcode, country)
//         VALUES
//         (@customer_name, @customer_id, @phone_no, @street, @city, @state, @zipcode, @country)
//       `);

//     // Insert into CUSTOMER_ACCOUNT table
//     const accountRequest = new sql.Request(transaction);
//     await accountRequest
//       .input("email", email)
//       .input("customer_id", customerData.customerId)
//       .input("account_password", password).query(`
//         INSERT INTO CUSTOMER_ACCOUNT
//         (email, customer_id, account_password)
//         VALUES
//         (@email, @customer_id, @account_password)
//       `);

//     await transaction.commit();
//     return true;
//   } catch (error) {
//     if (transaction) {
//       try {
//         await transaction.rollback();
//       } catch (rollbackError) {
//         console.error("Error rolling back transaction:", rollbackError);
//       }
//     }
//     throw error;
//   }
// }

// async function getUserByEmail(email) {
//   try {
//     await pool.connect();
//     const result = await pool.request().input("email", email).query(`
//         SELECT c.*, ca.email, ca.account_password
//         FROM CUSTOMER c
//         JOIN CUSTOMER_ACCOUNT ca ON c.customer_id = ca.customer_id
//         WHERE ca.email = @email
//       `);
//     return result.recordset[0];
//   } catch (error) {
//     throw error;
//   }
// }

// module.exports = {
//   createUser,
//   getUserByEmail,
// };
const { pool } = require("../db");
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
