const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config");
const db = require("../../db/models");

const User = db.User;

// Temporary in-memory blacklist
const blacklist = new Set();

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];

  // Check if the token is present and in the Bearer format
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(403).send({
      message: "No token provided or invalid token format!",
    });
  }

  // Extract the token part after "Bearer "
  token = token.split(" ")[1];

  // Check if the token is blacklisted
  if (blacklist.has(token)) {
    return res
      .status(401)
      .send({ message: "Unauthorized! Token has been invalidated." });
  }

  // Verify the token
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    if (!req.user) {
      req.user = {};
    }
    req.user.userId = decoded.id; // Store the student ID in the request object
    next();
  });
};

// Check Admin Role
const checkAdmin = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send({ message: `User ${userId} Not found!` });
    }

    if (user.role === "admin") {
      return next();
    }

    res.status(403).send({ message: "Require Admin Role!" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

// Check Student Role
const checkStudent = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send({ message: `User ${userId} Not found!` });
    }

    if (user.role === "student") {
      return next();
    }

    res.status(403).send({ message: "Require Student Role!" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

// Add token to blacklist
const blacklistToken = (token) => {
  blacklist.add(token);
};

module.exports = {
  verifyToken,
  blacklistToken,
  checkAdmin,
  checkStudent,
};
