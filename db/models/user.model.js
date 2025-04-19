const jwt = require("jsonwebtoken");

("use strict");
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("Users", {
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "user_id",
    },
    fullName: {
      type: Sequelize.STRING,
      allowNull: false,
      field: "full_name",
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
      field: "phone",
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "student",
      field: "role",
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_verified",
    },
    verificationCode: {
      type: Sequelize.STRING(6),
      allowNull: true,
      field: "verification_code",
    },
    verificationCodeExpires: {
      type: Sequelize.DATE,
      allowNull: true,
      field: "verification_code_expires",
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      field: "updated_at",
    },
    deletedAt: {
      type: Sequelize.DATE,
      allowNull: true,
      field: "deleted_at",
    },
    createdBy: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: "created_by",
    },
    updatedBy: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: "updated_by",
    },
    deletedBy: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: "deleted_by",
    },
  });

  User.prototype.generateJwt = function () {
    return jwt.sign(
      { userId: user.userId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
  };

  return User;
};
