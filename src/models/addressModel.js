const { DataTypes } = require("sequelize");
const { sequelize } = require("@config/sequelize");
const User = require("@models/userModel");

const Address = sequelize.define(
  "Address",
  {
    address_id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: "Users",
        key: "user_id",
      },
    },
    street: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    state: DataTypes.STRING(255),
    zip_code: DataTypes.STRING(20),
    country: {
      type: DataTypes.STRING(100),
      defaultValue: "Vietnam",
    },
    label: {
      type: DataTypes.STRING(100),
      defaultValue: "Home",
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "Addresses",
    timestamps: true,
    underscored: false,
  },
);

module.exports = Address;
