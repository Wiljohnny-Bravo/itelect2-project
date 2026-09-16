"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const adminHash = await bcrypt.hash("admin123", 10);

    await queryInterface.bulkInsert("Users", [
      {
        name: "Admin User",
        email: "admin@task.test",
        password: adminHash,
        role: "admin",
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", { email: "admin@task.test" }, {});
  },
};
