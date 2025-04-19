"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "verification_code", {
      type: Sequelize.STRING(6),
      allowNull: true,
      field: "verification_code",
    });

    await queryInterface.addColumn("Users", "verification_code_expires", {
      type: Sequelize.DATE,
      allowNull: true,
      field: "verification_code_expires",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "verification_code");
    await queryInterface.removeColumn("Users", "verification_code_expires");
  },
};
