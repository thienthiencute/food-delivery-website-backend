
const express = require("express");
const router = express.Router();

const userController = require("@controllers/userController");
const upload = require("@config/multer");
const { authMiddleware } = require("../middlewares/authMiddleware");
// Profile routes
router.get("/profile", authMiddleware, userController.getProfile);
router.put(
  "/profile",
  authMiddleware,
  upload.single("avatar"),
  userController.updateProfile,
);
router.put("/password", authMiddleware, userController.changePassword);

// Addresses routes
router.get("/addresses", authMiddleware, userController.getAddresses);
router.post("/addresses", authMiddleware, userController.addAddress);
router.put("/addresses/:id", authMiddleware, userController.updateAddress);
router.delete("/addresses/:id", authMiddleware, userController.deleteAddress);
router.put(
  "/addresses/:id/default",
  authMiddleware,
  userController.setDefaultAddress,
);

module.exports = router;
