const usersRouter = require("./userRouter");
const authRouter = require("./authRouter");
const dishRouter = require("./dishRouter");
const cartRouter = require("./cartRouter");
const voucherRouter = require("./voucherRouter");
const categoryRouter = require("./categoryRouter");
const { authAdminMiddleware, authMiddleware } = require("@middlewares/authMiddleware");

const routes = (app) => {
    app.use("/api/dish", authMiddleware, dishRouter);
    app.use("/api/user", authMiddleware, usersRouter);
    app.use("/api/auth", authRouter);
    app.use("/api/cart", authMiddleware, cartRouter);
    app.use("/api/voucher", authMiddleware, voucherRouter);
    app.use("/api/category", authMiddleware, categoryRouter);
};

module.exports = routes;
