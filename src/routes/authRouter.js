const express = require("express");
const router = express.Router();
const passport = require("passport");

const authController = require("@controllers/authController");
const { authMiddleware } = require("@middlewares/authMiddleware");

// GET
router.get("/api/", authMiddleware, (req, res) => {
    res.json({ success: true, message: "Request authenticated and processed!" });
});
router.get(
    "/api/google",
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
    "/api/google/redirect",
    passport.authenticate("google", {
        successRedirect: `${process.env.CLIENT_URL}/login/status`,
        failureRedirect: `${process.env.CLIENT_URL}/login/status`,
    }),
);
router.get(
    "/api/facebook",
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
    "/api/facebook/redirect",
    passport.authenticate("facebook", {
        successRedirect: `${process.env.CLIENT_URL}/login/status`,
        failureRedirect: `${process.env.CLIENT_URL}/login/status`,
    }),
);
router.get("/api/login-status", authController.loginStatus);

// POST
router.post("/api/send-otp", authController.sendOTP);
router.post("/api/verify-otp", authController.verifyOTP);
router.post("/api/login-user", authController.loginUser);
router.post("/api/register-user", authController.registerUser);
router.post("/api/logout-user", authController.loginStatus);
router.post("/api/forgot-password/send-otp", authController.forgotPasswordSendOTP);
router.post("/api/forgot-password/verify-otp", authController.forgotPasswordVerifyOTP);
router.post("/api/forgot-password/reset-password", authController.resetPassword);

module.exports = router;
