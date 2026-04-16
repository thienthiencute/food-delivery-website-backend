const orderController = require("@controllers/orderController");
const express = require("express");
const router = express.Router();

// All order routes require authentication (already handled in main router but included for safety)
router.post("/", orderController.createOrderFromCart);
router.get("/my", orderController.getMyOrders);
router.get("/:id", orderController.getOrderDetail);
router.post("/:id/reorder", orderController.reorder);

module.exports = router;
