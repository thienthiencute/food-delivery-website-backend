const cartController = require("@controllers/cartController");
const express = require("express");
const router = express.Router();

router.get("/api/cart", cartController.getCartItems);
router.put("/api/update-quantity", cartController.updateQuantity);
router.delete("/api/delete-item/:id", cartController.deleteCartItem);

module.exports = router;
