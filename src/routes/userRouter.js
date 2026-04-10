
const express = require("express");
const router = express.Router();

const userController = require("@controllers/userController");
const upload = require("@config/multer");
const { authMiddleware } = require("../middlewares/authMiddleware");
// Profile routes
router.get("/api/profile", authMiddleware, userController.getProfile);
router.put(
  "/api/profile",
  authMiddleware,
  upload.single("avatar"),
  userController.updateProfile,
);
router.put("/api/password", authMiddleware, userController.changePassword);

// Addresses routes
router.get("/api/addresses", authMiddleware, userController.getAddresses);
router.post("/api/addresses", authMiddleware, userController.addAddress);
router.put("/api/addresses/:id", authMiddleware, userController.updateAddress);
router.delete("/addresses/:id", authMiddleware, userController.deleteAddress);
router.put(
  "/api/addresses/:id/default",
  authMiddleware,
  userController.setDefaultAddress,
);

module.exports = router;
