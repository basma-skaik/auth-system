"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "phone", {
      type: Sequelize.STRING,
      allowNull: true, // ✅ allow nulls now
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "phone", {
      type: Sequelize.STRING,
      allowNull: false, // revert if needed
    });
  },
};
