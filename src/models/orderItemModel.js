const { DataTypes } = require("sequelize");
const { sequelize } = require("@config/sequelize");

const orderItemModel = sequelize.define(
    "OrderItem",
    {
        order_item_id: {
            type: DataTypes.STRING(255),
            primaryKey: true,
        },
        order_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            references: {
                model: "Orders",
                key: "order_id",
            },
            onDelete: "CASCADE",
        },
        dish_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            references: {
                model: "Dishes",
                key: "dish_id",
            },
            onDelete: "CASCADE",
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
    },
    {
        tableName: "OrderItems",
        timestamps: false,
        underscored: false,
    },
);

module.exports = orderItemModel;
