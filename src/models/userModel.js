const { DataTypes } = require("sequelize");
const { sequelize } = require("@config/sequelize");

const User = sequelize.define(
    "User",
    {
        user_id: {
            type: DataTypes.STRING(255),
            primaryKey: true,
        },
        fullname: DataTypes.STRING(255),
        address: DataTypes.STRING(255),
        gender: DataTypes.ENUM("Male", "Female", "Other"),
        date_of_birth: DataTypes.DATE,
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        username: DataTypes.STRING(255),
        type_login: {
            type: DataTypes.ENUM("Standard", "Google", "Facebook", "Apple"),
            allowNull: false,
            defaultValue: "Standard",
        },
        email: {
            type: DataTypes.STRING(255),
            unique: true,
        },
        phone_number: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        country_code: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("Admin", "Customer", "Owner", "Employee"),
            defaultValue: "Customer",
        },
        avatar_path: DataTypes.STRING(1000),
        payment_method: {
            type: DataTypes.ENUM("Credit Card", "Momo", "Zalo Pay", "Bank Transfer", "Cash"),
            defaultValue: "Cash",
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW,
        },
        last_login: DataTypes.DATE,
        is_online: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "Users",
        timestamps: false,
    },
);

module.exports = User;
