"use strict";

// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "password", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "",
    });

    await queryInterface.addColumn("Users", "role", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "member",
    });

    await queryInterface.addConstraint("Users", {
      fields: ["email"],
      type: "unique",
      name: "Users_email_key",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Users", "Users_email_key");
    await queryInterface.removeColumn("Users", "roles");
    await queryInterface.removeColumn("Users", "password");
  },
};
