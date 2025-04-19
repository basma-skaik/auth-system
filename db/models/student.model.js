"use strict";
module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define("Students", {
    studentId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "student_id",
    },
    location: {
      type: Sequelize.STRING,
      allowNull: true,
      field: "location",
    },
    jobTitle: {
      type: Sequelize.STRING,
      allowNull: true,
      field: "job_title",
    },
    company: {
      type: Sequelize.STRING,
      allowNull: true,
      field: "company",
    },
    industry: {
      type: Sequelize.STRING,
      allowNull: true,
      field: "industry",
    },
    language: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "English",
      field: "language",
    },
    timeZone: {
      type: Sequelize.STRING,
      allowNull: true,
      field: "time_zone",
    },
    notifyAccountUpdates: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      field: "notify_account_updates",
    },
    notifyProductNews: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      field: "notify_product_news",
    },
    notifyMarketing: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      field: "notify_marketing",
    },
    bio: {
      type: Sequelize.STRING(200),
      allowNull: true,
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
