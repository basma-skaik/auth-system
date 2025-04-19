const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares");
const adminController = require("../controllers/admin.controller");

router.post(
  "/send-login-code",
  [authJwt.verifyToken, authJwt.checkAdmin],
  adminController.sendLoginCode
);

module.exports = router;
