const db = require("../../db/models");
const User = db.User;
const Student = db.Student;
const Errors = require("../utils/customErrors");
const { sendWhatsAppOTP } = require("../utils/whatsapp");

exports.sendLoginCode = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ where: { phone } });

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

    // generate code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await user.update({
      verificationCode: code,
      verificationCodeExpires: expires,
    });

    // Send code via WhatsApp
    const message = `Your Simplify login code is: ${code}`;
    await sendWhatsAppOTP(phone, message);

    res.status(200).send({
      message: `Login code sent via WhatsApp successfully! ${code}`,
    });
  } catch (err) {
    const error = Errors.InternalServerError(err);
    return res
      .status(error.status)
      .send({ message: error.message, details: error.details });
  }
};
