const db = require("../db"); // Adjust the path to your MySQL connection file

// Fetch all products
exports.getAllProducts = (req, res) => {
  const query = "SELECT * FROM Products";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Error fetching products" });
    }
    res.status(200).json(results);
  });
};

// Update a product
exports.updateProduct = (req, res) => {
  const { productId, productName, price, stockQuantity } = req.body;

  const query = `
    UPDATE Products 
    SET product_name = ?, price = ?, stock_quantity = ? 
    WHERE product_id = ?
  `;

  db.query(
    query,
    [productName, price, stockQuantity, productId],
    (err, result) => {
      if (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({ message: "Error updating product" });
      }
      res.status(200).json({ message: "Product updated successfully" });
    }
  );
};
