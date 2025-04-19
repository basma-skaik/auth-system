const express = require("express");
const router = express.Router();
const passport = require("passport");
const { validateRequest, verifySignUp, authJwt } = require("../middlewares");
const authController = require("../controllers/auth.controller");

// Signup route
router.post(
  "/signup",
  [
    validateRequest.validateSignup,
    verifySignUp.checkDuplicateEmail,
    verifySignUp.checkRoleExisted,
  ],
  authController.signup
);

router.post("/login", [validateRequest.validateLogin], authController.login);

router.post("/logout", [authJwt.verifyToken], authController.logout);

router.post("/verify-code", authController.verifyCode);

router.post("/request-reset", authController.requestResetCode);

router.post("/reset-password", authController.resetPassword);

// Step 1: Start Google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Step 2: Callback after Google login
router.get(
  "/",
  passport.authenticate("google", {
    successRedirect: "/api/auth/success",
    failureRedirect: "/api/auth/failure",
  })
);

// Optional Success/Failure routes
router.get("/success", (req, res) => {
  res.send("✅ Login successful! Welcome, " + req.user.displayName);
});

router.get("/failure", (req, res) => {
  res.send("❌ Login failed.");
});

module.exports = router;
