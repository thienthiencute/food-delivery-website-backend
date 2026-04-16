const { getCartItemsByUserId } = require("@services/cartService");
const { jwtDecode } = require("jwt-decode");

const { updateCartItemQuantity, deleteCartItem } = require("@services/cartService");

class cartController {
    /**
     * GET /api/cart
     */
    async getCart(req, res) {
        try {
            const userId = req.user.user_id;
            const cartData = await cartService.getCartItemsByUserId(userId);
            res.status(200).json({ success: true, data: cartData });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
     /**
     * GET /api/cart/items
     */
    getCartItems = async (req, res, next) => {
    try {
        const userId = req.user.user_id;

        const cartItems = await cartItemModel.findAll({
        where: { user_id: userId },
        });

        return res.json({
        success: true,
        data: cartItems,
        });
    } catch (err) {
        console.error("❌ getCartItems error:", err); 
        next(err);
    }
    }
    /**
     * POST /api/cart/items
     */
    async addItem(req, res) {
        try {
            const userId = req.user.user_id;
            const { dish_id, quantity } = req.body;

            if (!dish_id || !quantity) {
                return res.status(400).json({ success: false, message: "Missing dish_id or quantity" });
            }

            const cartData = await cartService.addCartItem(userId, dish_id, parseInt(quantity));
            res.status(200).json({ success: true, data: cartData });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    /**
     * PUT /api/cart/items/:id
     */
    async updateItem(req, res) {
        try {
            const userId = req.user.user_id;
            const cartItemId = req.params.id;
            const { quantity } = req.body;

            if (quantity === undefined) {
                return res.status(400).json({ success: false, message: "Missing quantity" });
            }

            const cartData = await cartService.updateCartItemQuantity(userId, cartItemId, parseInt(quantity));
            res.status(200).json({ success: true, data: cartData });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    /**
     * DELETE /api/cart/items/:id
     */
    async deleteItem(req, res) {
        try {
            const userId = req.user.user_id;
            const cartItemId = req.params.id;

            const cartData = await cartService.deleteCartItem(userId, cartItemId);
            res.status(200).json({ success: true, data: cartData });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    /**
     * DELETE /api/cart/items/clear
     */
    async clearCart(req, res) {
        try {
            const userId = req.user.user_id;
            const cartData = await cartService.clearCartByUserId(userId);
            res.status(200).json({ success: true, data: cartData });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new cartController();

