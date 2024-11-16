const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      customerId: user.id,
      email: user.email,
    };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports = { authenticateToken };
