const express = require("express");
const router = express.Router();
const passport = require("passport");

const authController = require("@controllers/authController");
const { authMiddleware } = require("@middlewares/authMiddleware");

// GET
router.get("/", authMiddleware, (req, res) => {
    res.json({ success: true, message: "Request authenticated and processed!" });
});
router.get(
    "/google",
    (req, res, next) => {
        const { memorizedLogin } = req.query;
        res.cookie("memorizedLogin", memorizedLogin);
        res.status(200);
        next();
    },
    passport.authenticate("google", {
        scope: ["profile", "email"],
    }),
);
router.get(
    "/google/redirect",
    passport.authenticate("google", {
        successRedirect: `${process.env.CLIENT_URL}/login/status`,
        failureRedirect: `${process.env.CLIENT_URL}/login/status`,
    }),
);
router.get(
    "/facebook",
    (req, res, next) => {
        const { memorizedLogin } = req.query;
        res.cookie("memorizedLogin", memorizedLogin);
        res.status(200);
        next();
    },
    passport.authenticate("facebook", {
        scope: ["email"],
    }),
);
router.get(
    "/facebook/redirect",
    passport.authenticate("facebook", {
        successRedirect: `${process.env.CLIENT_URL}/login/status`,
        failureRedirect: `${process.env.CLIENT_URL}/login/status`,
    }),
);
router.get("/login-status", authController.loginStatus);

// POST
router.post("/send-otp", authController.sendOTP);
router.post("/verify-otp", authController.verifyOTP);
router.post("/login-user", authController.loginUser);
router.post("/register-user", authController.registerUser);
router.post("/logout-user", authController.loginStatus);
router.post("/forgot-password/send-otp", authController.forgotPasswordSendOTP);
router.post("/forgot-password/verify-otp", authController.forgotPasswordVerifyOTP);
router.post("/forgot-password/reset-password", authController.resetPassword);

module.exports = router;
