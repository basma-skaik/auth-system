const db = require("../../db/models");
const User = db.User;
const Student = db.Student;
const Errors = require("../utils/customErrors");

exports.verifyUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ where: { userId } });

    if (!user) {
      const error = Errors.NotFoundError("User", user.userId);
      return res.status(error.status).send({ message: error.message });
    }

    if (user.isVerified === 1) {
      const error = Errors.AlreadyVerifiedError(user.userId);
      return res.status(error.status).send({ message: error.message });
    }

    if (user.role !== "student") {
      const error = Errors.UnsupportedRoleError();
      return res.status(error.status).send({ message: error.message });
    }

    const existingStudent = await Student.findOne({
      where: { userId: user.userId },
    });
    if (existingStudent) {
      const error = Errors.DuplicateUserError(user.userId);
      return res.status(error.status).send({ message: error.message });
    }

    await Student.create({
      userId: user.userId,
      createdBy: process.env.ADMIN_ID,
      updatedBy: process.env.ADMIN_ID,
    });

    user.isVerified = true;
    await user.save();

    res.status(200).send({
      message: `User verified successfully!`,
    });
  } catch (err) {
    const error = Errors.InternalServerError(err);
    return res
      .status(error.status)
      .send({ message: error.message, details: error.details });
  }
};
