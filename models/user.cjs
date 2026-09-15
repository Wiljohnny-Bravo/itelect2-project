"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Task, {
        foreignKey: "userId",
      });
    }
    toJSON() {
      const values = { ...this.get() };
      delete values.password;
      return values;
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: { msg: "email is required" },
          isEmail: { msg: "email must look like an email address" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: "password is required" } },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "member",
      },
    },
    {
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
