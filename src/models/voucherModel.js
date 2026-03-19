const { DataTypes } = require("sequelize");
const { sequelize } = require("@config/sequelize");

const voucherModel = sequelize.define(
    "Voucher",
    {
        voucher_id: {
            type: DataTypes.STRING(255),
            primaryKey: true,
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        discount_type: {
            type: DataTypes.ENUM("Percentage", "Amount"),
            allowNull: false,
        },
        discount_value: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        valid_from: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        valid_to: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        min_purchase: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
            allowNull: false,
        },
        number_of_uses: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
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
        tableName: "Vouchers",
        timestamps: false,
        underscored: false,
    },
);

module.exports = voucherModel;
