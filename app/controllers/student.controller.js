const db = require("../../db/models");
const Student = db.Student;
const User = db.User;
const Errors = require("../utils/customErrors");

exports.completeStudentProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { bio, level, futureSpeciality, instagram, location, organization } =
      req.body;

    const student = await Student.findOne({ where: { userId } });

    if (!student) {
      const error = Errors.NotFoundError("Student", userId);
      return res.status(error.status).send({ message: error.message });
    }

    await student.update({
      bio,
      level,
      futureSpeciality,
      instagram,
      location,
      organization,
      updatedBy: process.env.ADMIN_ID,
    });

    return res.status(200).send({
      message: "Student profile updated successfully!",
      data: student,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.getStudentProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const student = await Student.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["fullName", "phone"],
        },
      ],
    });

    if (!student) {
      const error = Errors.NotFoundError("Student", userId);
      return res.status(error.status).send({ message: error.message });
    }

    res.status(200).send({
      message: "Student profile retrieved successfully!",
      data: student,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
