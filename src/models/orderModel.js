const { DataTypes } = require("sequelize");
const { sequelize } = require("@config/sequelize");

const orderModel = sequelize.define(
    "Order",
    {
        order_id: {
            type: DataTypes.STRING(255),
            primaryKey: true,
        },
        account_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            references: {
                model: "Accounts",
                key: "account_id",
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        foods: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        order_note: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        order_status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "pending",
            validate: {
                isIn: [["pending", "confirmed", "delivering", "delivered", "cancelled"]],
            },
        },
        address_id: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        payment_method: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: "Cash",
        },
        delivery_address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        order_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "Orders",
        timestamps: false,
        underscored: false,
    },
);

module.exports = orderModel;
