const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import CORS
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Enable CORS
app.use(cors()); // Allow all origins by default
// Alternatively, restrict to your frontend's domain:
// app.use(cors({ origin: "http://localhost:3000" }));

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/orders", orderRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
