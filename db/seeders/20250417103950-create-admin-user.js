"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert(
        "users",
        [
          {
            user_id: 1,
            full_name: "Basma Skaik",
            phone: "+972502091566",
            is_verified: 1,
            role: "admin",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log("Error seeding users:", error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete("users", { user_id: 1 }, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log("Error rolling back roles:", error);
      throw error;
    }
  },
};
