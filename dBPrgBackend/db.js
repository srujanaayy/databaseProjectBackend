const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost", // Your MySQL server address
  user: "your_db_user", // Your MySQL username
  password: "your_db_password", // Your MySQL password
  database: "commerceDb", // Your database name
});

const promisePool = pool.promise(); // Enable Promise support for async/await

module.exports = { promisePool };
