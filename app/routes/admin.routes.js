const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares");
const adminController = require("../controllers/admin.controller");

router.post(
  "/verify-user/:userId",
  [authJwt.verifyToken, authJwt.checkAdmin],
  adminController.verifyUser
);

module.exports = router;
