const db = require("../../db/models");
const User = db.User;
const Student = db.Student;
const Errors = require("../utils/customErrors");
const { sendEmail } = require("../utils/emailSender");

exports.sendVerificationCode = async (req, res) => {
  try {
    const userId = req.params.userId; //user that the admin will approve him
    const user = await User.findByPk(userId);

    if (!user) {
      const error = Errors.NotFoundError("User", userId);
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

    const existingStudent = await Student.findOne({ where: { userId } });
    if (existingStudent) {
      const error = Errors.DuplicateUserError(user.userId);
      return res.status(error.status).send({ message: error.message });
    }

    await Student.create({
      userId: user.userId,
      createdBy: process.env.ADMIN_ID,
      updatedBy: process.env.ADMIN_ID,
    });

    // generate code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await user.update({
      verificationCode: code,
      verificationCodeExpires: expires,
    });

    await sendEmail(
      user.email,
      "Verification code",
      `Your Verification code is: ${code}`
    );

    res.status(200).send({
      message: `Verification code sent successfully! ${code}`,
    });
  } catch (err) {
    const error = Errors.InternalServerError(err);
    return res
      .status(error.status)
      .send({ message: error.message, details: error.details });
  }
};
