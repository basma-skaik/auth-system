"use strict";
module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define("Students", {
    studentId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "student_id",
    },
    bio: {
      type: Sequelize.STRING(300),
      allowNull: true,
      field: "bio",
    },
    level: {
      type: Sequelize.STRING,
      allowNull: true,
      field: "level",
    },
    futureSpeciality: {
      type: Sequelize.STRING,
      allowNull: true,
      field: "future_speciality",
    },
    instagram: {
      type: Sequelize.STRING,
      allowNull: true,
      field: "instagram",
    },
    location: {
      type: Sequelize.STRING,
      allowNull: true,
      field: "location",
    },
    organization: {
      type: Sequelize.STRING,
      allowNull: true,
      field: "organization",
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
      field: "user_id",
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

  return Student;
};
