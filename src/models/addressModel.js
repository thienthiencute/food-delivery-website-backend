const { DataTypes } = require("sequelize");
const { sequelize } = require("@config/sequelize");
const User = require("@models/userModel");

const Address = sequelize.define(
  "Address",
  {
    addressId: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      field: "address_id",
    },
    userId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: "Users",
        key: "user_id",
      },
      field: "user_id",
    },
    street: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ward: DataTypes.STRING(255),
    district: DataTypes.STRING(255),
    zipCode: {
      type: DataTypes.STRING(20),
      field: "zip_code",
    },
    country: {
      type: DataTypes.STRING(100),
      defaultValue: "Vietnam",
    },
    label: {
      type: DataTypes.ENUM('Home', 'Work', 'Other'),
      defaultValue: "Home",
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_default",
    },
    latitude: DataTypes.DECIMAL(10, 8),
    longitude: DataTypes.DECIMAL(11, 8),
  },
  {
    tableName: "Addresses",
  },
);

module.exports = Address;
