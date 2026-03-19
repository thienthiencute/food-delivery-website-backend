const { sequelize } = require("@config/sequelize");

const userModel = require("@models/userModel");
const dishModel = require("@models/dishModel");
const orderItemModel = require("@models/orderItemModel");
const cartItemModel = require("@models/cartItemModel");
const orderModel = require("@models/orderModel");
const cartModel = require("@models/cartModel");
const categoryModel = require("@models/categoryModel");
const customerModel = require("@models/customerModel");
const invoiceItemModel = require("@models/invoiceItemModel");
const invoiceModel = require("@models/invoiceModel");
const voucherModel = require("@models/voucherModel");
const otpModel = require("@models/otpModel");
const reviewModel = require("@models/reviewModel");
const accountVoucher = require("@models/userVoucher");

sequelize
    .sync()
    .then(() => {
        console.log("\n\nTables have been created\n\n");
    })
    .catch((error) => console.log("\n\nThis error occurred", error + "\n\n"));

module.exports = {
    userModel,
    cartItemModel,
    orderItemModel,
    orderModel,
    otpModel,
    reviewModel,
    dishModel,
    cartModel,
    categoryModel,
    customerModel,
    invoiceItemModel,
    invoiceModel,
    voucherModel,
    accountVoucher,
};
