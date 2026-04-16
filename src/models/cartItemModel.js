const { DataTypes } = require("sequelize");
const { sequelize } = require("@config/sequelize");

const cartItemModel = sequelize.define(
    "CartItem",
    {
        cart_item_id: {
            type: DataTypes.STRING(255),
            primaryKey: true,
        },
        dishId: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: "dish_id",
            references: {
                model: "Dishes",
                key: "dish_id",
            },
            onDelete: "CASCADE",
        },
        cart_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            references: {
                model: "Carts",
                key: "cart_id",
            },
            onDelete: "CASCADE",
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        priceSnapshot: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: "price_snapshot",
            comment: "Snapshot of dish price at the time item was added to cart",
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
        tableName: "CartItems",
        timestamps: false,
        underscored: false,
    },
);

module.exports = cartItemModel;
