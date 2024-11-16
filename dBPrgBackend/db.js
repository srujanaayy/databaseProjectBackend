// const sql = require("mssql");
// require("dotenv").config();

// const config = {
//   server: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   options: {
//     encrypt: true,
//     trustServerCertificate: false,
//   },
// };
// const pool = new sql.ConnectionPool(config);
// const poolConnect = pool.connect();

// poolConnect
//   .then(() => {
//     console.log("Connected to SQL Server successfully");
//   })
//   .catch((err) => {
//     console.error("Database connection failed:", err);
//     process.exit(1);
//   });

// module.exports = { pool, poolConnect };
// const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "your-username",
//   password: "your-password",
//   database: "commerceDb",
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log("Connected to the commerceDb database.");
// });

// module.exports = db;
// const mysql = require("mysql2");
// require("dotenv").config();

// const config = {
//   host: process.env.DB_HOST, // Replace DB_SERVER with DB_HOST in .env
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
// };

// async function connectToDatabase() {
//   try {
//     const pool = await mysql.createPool(config);
//     console.log("Connected to MySQL database successfully");
//     return pool;
//   } catch (err) {
//     console.error("Database connection failed:", err);
//     process.exit(1);
//   }
// }

// const pool = connectToDatabase();

// module.exports = { pool };
// const mysql = require("mysql2");
// const db = mysql.createConnection({
//   host: "localhost",
//   database: "commerceDb",
// });
// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL:", err);
//     return;
//   }
//   console.log("Connected to MySQL database");
// });
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost", // Your MySQL server address
  user: "your_db_user", // Your MySQL username
  password: "your_db_password", // Your MySQL password
  database: "commerceDb", // Your database name
});

const promisePool = pool.promise(); // Enable Promise support for async/await

module.exports = { promisePool };
