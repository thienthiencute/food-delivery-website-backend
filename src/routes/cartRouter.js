const cartController = require("@controllers/cartController");
const express = require("express");
const router = express.Router();

router.get("/cart", cartController.getCartItems);
router.put("/update-quantity", cartController.updateQuantity);
router.delete("/delete-item/:id", cartController.deleteCartItem);

module.exports = router;
