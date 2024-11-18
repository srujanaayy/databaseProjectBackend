const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authValidators = require("../utils/validators/auth");
const { validationResult } = require("express-validator");

// Registration route with validation
router.post(
  "/register",
  authValidators.register,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  authController.register
);

// Login route with validation
router.post(
  "/login",
  authValidators.login,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  authController.login
);

module.exports = router;
