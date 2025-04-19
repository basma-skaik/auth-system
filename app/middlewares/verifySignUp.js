const db = require("../../db/models");
const User = db.User;

const checkDuplicateEmail = async (req, res, next) => {
  try {
    let user = await User.findOne({ where: { email: req.body.email } });

    if (user) {
      return res.status(400).send({
        message: "Failed! Email is already in use!",
      });
    }

    // If no duplicates, proceed to the next middleware
    next();
  } catch (error) {
    return res.status(500).send({ message: "Unable to validate Email!" });
  }
};

const checkRoleExisted = async (req, res, next) => {
  try {
    if (req.body.role) {
      if (role !== "student" || role !== "admin") {
        return res.status(400).send({
          message: `Failed! Role ${req.body.role} does not exist.`,
        });
      }
    }
    next(); // Proceed to the next middleware if the roleId is valid
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Role!",
    });
  }
};

const checkIsVerified = async (req, res, next) => {
  const userId = req.user.userId; //userId is decoded from JWT
  try {
    const user = await User.findByPk(userId);
    if (!user.isVerified) {
      return res.status(403).send({ message: "Account not verified!" });
    }
    next();
  } catch (error) {
    res.status(500).send({ message: "Unable to validate user." });
  }
};

const verifySignUp = {
  checkDuplicateEmail,
  checkRoleExisted,
  checkIsVerified,
};

module.exports = verifySignUp;
