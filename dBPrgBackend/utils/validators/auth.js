// const { body } = require("express-validator");

// const authValidators = {
//   register: [
//     body("email")
//       .isEmail()
//       .withMessage("Please provide a valid email")
//       .normalizeEmail(),

//     //Ethan can you check password hashing
//     body("password")
//       .isLength({ min: 8 })
//       .withMessage("Password must be at least 8 characters long")
//       .matches(
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
//       )
//       .withMessage(
//         "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
//       ),

//     body("customerName")
//       .trim()
//       .notEmpty()
//       .withMessage("Customer name is required")
//       .isLength({ min: 2, max: 50 })
//       .withMessage("Customer name must be between 2 and 50 characters"),

//     body("phoneNo")
//       .matches(/^\d{10}$/)
//       .withMessage("Phone number must be exactly 10 digits"),

//     // Address validation
//     body("street").trim().notEmpty().withMessage("Street address is required"),
//     body("city").trim().notEmpty().withMessage("City is required"),
//     body("state")
//       .isLength({ min: 2, max: 2 })
//       .withMessage("State must be 2 characters"),
//     body("zipcode")
//       .matches(/^\d{5}$/)
//       .withMessage("Zipcode must be 5 digits"),
//     body("country").trim().notEmpty().withMessage("Country is required"),
//   ],

//   login: [
//     body("email")
//       .isEmail()
//       .withMessage("Please provide a valid email")
//       .normalizeEmail(),

//     //Ethan can you check password hashing
//     body("password").notEmpty().withMessage("Password is required"),
//   ],
//   //Ethan can you check password hashing
//   changePassword: [
//     body("currentPassword")
//       .notEmpty()
//       .withMessage("Current password is required"),

//     body("newPassword")
//       .isLength({ min: 8 })
//       .withMessage("New password must be at least 8 characters long")
//       .matches(
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
//       )
//       .withMessage(
//         "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
//       ),
//   ],
// };

// module.exports = authValidators;
const { body } = require("express-validator");

const authValidators = {
  // Register validation for creating a customer
  register: [
    // Validate email
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email")
      .normalizeEmail(),

    // Validate password
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),

    // Validate customer name
    body("customerName")
      .trim()
      .notEmpty()
      .withMessage("Customer name is required")
      .isLength({ min: 2, max: 50 })
      .withMessage("Customer name must be between 2 and 50 characters"),

    // Validate phone number (10 digits)
    body("phoneNo")
      .matches(/^\d{10}$/)
      .withMessage("Phone number must be exactly 10 digits"),

    // Validate address fields (Street, City, State, Zipcode, Country)
    body("street").trim().notEmpty().withMessage("Street address is required"),
    body("city").trim().notEmpty().withMessage("City is required"),
    body("state")
      .isLength({ min: 2, max: 2 })
      .withMessage("State must be 2 characters"),
    body("zipcode")
      .matches(/^\d{5}$/)
      .withMessage("Zipcode must be 5 digits"),
    body("country").trim().notEmpty().withMessage("Country is required"),

    // Validate credit card information (if stored)
    body("cardNumber")
      .matches(/^\d{16}$/)
      .withMessage("Card number must be 16 digits"),
    body("billingAddress")
      .trim()
      .notEmpty()
      .withMessage("Billing address is required"),
  ],

  // Login validation (for customer authentication)
  login: [
    // Validate email
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email")
      .normalizeEmail(),

    // Validate password
    body("password").notEmpty().withMessage("Password is required"),
  ],

  // Change password validation
  changePassword: [
    // Validate current password
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),

    // Validate new password (similar to register password validation)
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .withMessage(
        "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  ],

  // Additional validation for order creation if required
  placeOrder: [
    // Validate customer ID (foreign key to customer table)
    body("customerID").isInt().withMessage("Customer ID must be an integer"),

    // Validate order status (e.g., Pending, Completed, etc.)
    body("status")
      .isIn(["Pending", "Completed", "Shipped", "Cancelled"])
      .withMessage("Status must be one of the predefined values"),

    // Validate shipping address (if not in customer address)
    body("shippingAddress")
      .trim()
      .notEmpty()
      .withMessage("Shipping address is required"),

    // Ensure the cart items exist and have valid product IDs
    body("orderItems")
      .isArray()
      .withMessage("Order items must be an array of product IDs")
      .custom((items) => {
        // Example custom validation: Make sure all product IDs are valid
        if (!items.every((item) => typeof item.productID === "number")) {
          throw new Error("Each order item must have a valid product ID");
        }
        return true;
      }),
  ],

  // Validation for adding products to inventory (Admin)
  addProduct: [
    // Validate product name
    body("productName")
      .trim()
      .notEmpty()
      .withMessage("Product name is required"),

    // Validate product description
    body("prodDescription")
      .trim()
      .notEmpty()
      .withMessage("Product description is required"),

    // Validate product price
    body("price")
      .isDecimal()
      .withMessage("Price must be a valid decimal number"),

    // Validate stock quantity (must be integer)
    body("stockQuantity")
      .isInt({ min: 0 })
      .withMessage("Stock quantity must be a non-negative integer"),

    // Validate reorder level (optional, integer)
    body("reOrderLevel")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Reorder level must be a non-negative integer"),

    // Validate warehouse location
    body("warehouseLocation")
      .trim()
      .notEmpty()
      .withMessage("Warehouse location is required"),
  ],
};

module.exports = authValidators;
