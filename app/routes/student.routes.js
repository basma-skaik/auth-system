const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares");
const studentController = require("../controllers/student.controller");

router.put(
  "/complete-profile",
  [authJwt.verifyToken, authJwt.checkStudent],
  studentController.completeStudentProfile
);

router.get(
  "/profile",
  [authJwt.verifyToken, authJwt.checkStudent || authJwt.checkAdmin],
  studentController.getStudentProfile
);

module.exports = router;
