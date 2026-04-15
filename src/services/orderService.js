const { orderModel, orderItemModel, dishModel, cartModel, cartItemModel } = require("@models");
const { v4: uuidv4 } = require("uuid");

const OrderService = {
    // GET /users/orders
    getUserOrders: async (userId) => {
        try {
            const orders = await orderModel.findAll({
                where: { account_id: userId },
                include: [
                    {
                        model: orderItemModel,
                        as: "items",
                        include: [
                            {
                                model: dishModel,
                                as: "dish",
                                attributes: ["name", "price", "thumbnail_path"],
                            },
                        ],
                    },
                ],
                order: [["order_date", "DESC"]],
            });

            // Map to a cleaner structure for the frontend
            return orders.map((order) => {
                const plainOrder = order.get({ plain: true });
                return {
                    order_id: plainOrder.order_id,
                    date: plainOrder.order_date,
                    status: plainOrder.order_status,
                    total_amount: plainOrder.items.reduce(
                        (sum, item) => sum + item.quantity * (item.dish?.price || 0),
                        0,
                    ),
                    items: plainOrder.items.map((item) => ({
                        dish_id: item.dish_id,
                        name: item.dish?.name || "Unknown Dish",
                        quantity: item.quantity,
                        price: item.dish?.price || 0,
                        thumbnail: item.dish?.thumbnail_path,
                    })),
                };
            });
        } catch (error) {
            console.error("Error fetching user orders:", error);
            throw error;
        }
    },

    // POST /users/orders/:id/reorder
    reorder: async (userId, orderId) => {
        try {
            // 1. Get the old order items
            const oldOrder = await orderModel.findOne({
                where: { order_id: orderId, account_id: userId },
                include: [
                    {
                        model: orderItemModel,
                        as: "items",
                        include: [{ model: dishModel, as: "dish" }],
                    },
                ],
            });

            if (!oldOrder) {
                throw new Error("Order not found");
            }

            // 2. Find or create the user's cart
            let cart = await cartModel.findOne({ where: { user_id: userId } });
            if (!cart) {
                cart = await cartModel.create({
                    cart_id: uuidv4(),
                    user_id: userId,
                });
            }

            const reorderResults = {
                added: [],
                skipped: [],
            };

            // 3. Process each item from the old order
            for (const item of oldOrder.items) {
                const dish = item.dish;

                // Check availability
                if (!dish || !dish.available || dish.status !== "active") {
                    reorderResults.skipped.push({
                        name: dish?.name || "Unknown Dish",
                        reason: "Item is currently unavailable",
                    });
                    continue;
                }

                // Add to cart (upsert)
                const existingItem = await cartItemModel.findOne({
                    where: { cart_id: cart.cart_id, dish_id: dish.dish_id },
                });

                if (existingItem) {
                    await existingItem.update({
                        quantity: existingItem.quantity + item.quantity,
                    });
                } else {
                    await cartItemModel.create({
                        cart_item_id: uuidv4(),
                        cart_id: cart.cart_id,
                        dish_id: dish.dish_id,
                        quantity: item.quantity,
                    });
                }

                reorderResults.added.push({
                    name: dish.name,
                    quantity: item.quantity,
                });
            }

            return {
                success: true,
                message: "Items from previous order processed",
                data: reorderResults,
            };
        } catch (error) {
            console.error("Error during reorder:", error);
            throw error;
        }
    },
};

module.exports = OrderService;
