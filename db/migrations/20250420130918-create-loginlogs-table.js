"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Login_logs", {
      loginId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        field: "login_id",
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
      ipAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        field: "ip_address",
      },
      userAgent: {
        type: Sequelize.STRING,
        allowNull: false,
        field: "user_agent",
      },
      loginTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: "login_time",
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
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Login_logs");
  },
};
