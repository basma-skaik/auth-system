const db = require("../../db/models");
const config = require("../../config/auth.config");
const User = db.User;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { blacklistToken } = require("../middlewares/authJwt");
const Errors = require("../utils/customErrors");
const { message } = require("../validation/signupValidationSchema");

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const { fullName, phone, acceptedPolicy } = req.body;

    if (!fullName || !phone || !acceptedPolicy) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return res.status(400).send({ message: "Phone already registered" });
    }

    const user = await User.create({
      fullName: req.body.fullName,
      phone: req.body.phone,
      isVerified: false,
    });

    res.status(201).send({
      message: `User registered successfully with phone: ${user.phone} ! Waiting for admin approval.`,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, code, rememberMe } = req.body;

    if (!code && !phone) {
      return res.status(400).json({ message: "Code and phone are required." });
    }

    const user = await User.findOne({
      where: { phone, verificationCode: code },
    });

    if (!user) {
      const error = Errors.NotFoundError("User", phone);
      return res.status(error.status).send({ message: error.message });
    }

    if (!user.isVerified) {
      return res.status(403).send({ message: "Account not verified!" });
    }
    if (user.verificationCode !== code) {
      return res.status(400).send({ message: "Invalid code" });
    }
    if (Date.now() > user.verificationCodeExpires.getTime()) {
      return res.status(400).send({ message: "Code expired" });
    }

    user.isVerified = true;
    // Clear the code after successful login (optional)
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    // Generate a JWT token
    const token = jwt.sign({ id: user.userId }, config.secret, {
      expiresIn: rememberMe ? "30d" : "1d", // Optional: use '30d' and '1d' format
    });

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 30 days or 1 day
      })
      .status(200)
      .send({
        id: user.userId,
        fullName: user.fullName,
        phone: user.phone,
        verificationCode: code,
        accessToken: token,
        message: "User logged in successfully and got verified!",
      });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.logout = (req, res) => {
  let token = req.headers["authorization"];

  if (!token || !token.startsWith("Bearer ")) {
    return res
      .status(400)
      .send({ message: "No token provided or invalid format!" });
  }

  token = token.split(" ")[1];
  blacklistToken(token);

  return res.status(200).send({ message: "Logged out successfully." });
};
