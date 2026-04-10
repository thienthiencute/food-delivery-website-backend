const cartController = require("@controllers/cartController");
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /api/cart/cart:
 *   get:
 *     summary: Get cart items
 *     tags:
 *       - Cart
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cart items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       dish_id:
 *                         type: integer
 *                       quantity:
 *                         type: integer
 *                       dish:
 *                         $ref: '#/components/schemas/Dish'
 *       401:
 *         description: Unauthorized
 */
router.get("/cart", cartController.getCartItems);

/**
 * @swagger
 * /api/cart/update-quantity:
 *   put:
 *     summary: Update cart item quantity
 *     tags:
 *       - Cart
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart_item_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart item quantity updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.put("/update-quantity", cartController.updateQuantity);

/**
 * @swagger
 * /api/cart/delete-item/{id}:
 *   delete:
 *     summary: Delete cart item
 *     tags:
 *       - Cart
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Cart item deleted successfully
 *       404:
 *         description: Cart item not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/delete-item/:id", cartController.deleteCartItem);

module.exports = router;
