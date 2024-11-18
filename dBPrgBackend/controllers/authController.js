onst jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

async function register(req, res) {
  const {
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    cardNumber,
    billingAddress,
  } = req.body;

  // Basic validation
  if (
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !cardNumber ||
    !billingAddress
  ) {
    return res.status(400).json({
      success: false,
      message: "All required fields must be provided",
    });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert Card Information first (assuming separate card info table)
    const cardInfoResult = await userModel.createCardInfo(
      cardNumber,
      billingAddress
    );

    if (!cardInfoResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to save card information",
      });
    }

    // Insert Customer data
    const customerData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      cardNumber,
      password: hashedPassword,
    };

    const success = await userModel.createCustomer(customerData);

    if (success) {
      res
        .status(201)
        .json({ success: true, message: "User registered successfully" });
    } else {
      res.status(500).json({ success: false, message: "Registration failed" });
    }
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({ success: false, message: "Email already exists" });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  console.log("Login attempt:", { email, password: "***" });

  try {
    const user = await userModel.getUserByEmail(email);
    console.log("User found:", user ? "yes" : "no");

    if (!user) {
      console.log("User not found");
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("Password mismatch");
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.CustomerID, email: user.EmailAddress },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      token,
      user: {
        email: user.EmailAddress,
        firstName: user.FirstName,
        lastName: user.LastName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { register, login };
