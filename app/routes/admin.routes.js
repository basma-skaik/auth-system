const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares");
const adminController = require("../controllers/admin.controller");

router.post(
  "/send-verification-code/:userId",
  [authJwt.verifyToken, authJwt.checkAdmin],
  adminController.sendVerificationCode
);

module.exports = router;
