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
            validate: {
                isIn: [["Pending", "In Progress", "Completed", "Cancelled"]],
            },
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
