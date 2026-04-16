const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminController");
const { authMiddleware } = require("@middlewares/authMiddleware");

// PUT /api/admin/orders/:id/status
// NOTE: In a real app, this should be protected by authAdminMiddleware
// For now, using authMiddleware for testing purposes
router.put("/orders/:id/status", authMiddleware, AdminController.updateOrderStatus);

module.exports = router;
