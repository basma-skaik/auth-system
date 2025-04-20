const db = require("../../db/models");
const config = require("../../config/auth.config");
const User = db.User;
const Loginlog = db.Loginlog;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { blacklistToken } = require("../middlewares/authJwt");
const Errors = require("../utils/customErrors");

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const { fullName, phone, password } = req.body;

    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return res.status(400).send({ message: "User already registered" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await User.create({
      fullName,
      password: hashedPassword,
      phone,
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
    const { phone, password, rememberMe } = req.body;

    const user = await User.findOne({ where: { phone } });

    if (!user) {
      const error = Errors.NotFoundError("User", phone);
      return res.status(error.status).send({ message: error.message });
    }

    if (!user.isVerified) {
      return res.status(403).send({ message: "Account not verified!" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res
        .status(401)
        .send({ accessToken: null, message: "Invalid Password!" });
    }

    // ✅ Log device info
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || // handles proxy chains
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.connection?.socket?.remoteAddress;
    const userAgent = req.headers["user-agent"];
    console.log(`Login from IP: ${ip}, User-Agent: ${userAgent}`);
    console.log("Full headers:", req.headers);

    await Loginlog.create({
      userId: user.userId,
      ipAddress: ip,
      userAgent,
      loginTime: new Date(),
    });

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
