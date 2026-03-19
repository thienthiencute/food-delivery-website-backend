const { DataTypes } = require("sequelize");
const { sequelize } = require("@config/sequelize");

const dishModel = sequelize.define(
    "Dish",
    {
        dish_id: {
            type: DataTypes.STRING(255),
            primaryKey: true,
        },
        category_id: {
            type: DataTypes.STRING(255),
            allowNull: true,
            references: {
                model: "Categories",
                key: "category_id",
            },
            onDelete: "CASCADE",
        },
        thumbnail_path: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        available: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        points: {
            type: DataTypes.DECIMAL(2, 1),
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 5,
            },
        },
        rate_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
        discount_amount: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        update_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW,
        },
    },
    {
        tableName: "Dishes",
        timestamps: false,
        underscored: false,
    },
);

module.exports = dishModel;
