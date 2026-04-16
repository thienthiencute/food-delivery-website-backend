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
                    brand: plainOrder.brand || "Eatsy",
                    estimated_time: plainOrder.estimated_time,
                    total_amount: plainOrder.items.reduce(
                        (sum, item) => sum + item.quantity * (item.dish?.price || 0),
                        0,
                    ),
                    payment_method: plainOrder.payment_method,
                    delivery_address: plainOrder.delivery_address,
                    items_preview: plainOrder.items.map((item) => ({
                        name: item.dish?.name || "Unknown Dish",
                        quantity: item.quantity,
                    })),
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

    // POST /user/orders
    createOrder: async (userId, orderData) => {
        const { sequelize } = require("@config/sequelize");
        const { addressModel, dishModel } = require("@models");
        const AppError = require("../utils/AppError");
        
        const t = await sequelize.transaction();

        try {
            const { items, address_id, payment_method, note } = orderData;

            // 1. Fetch address for snapshot
            const address = await addressModel.findOne({
                where: { address_id, user_id: userId },
            });

            if (!address) {
                throw new AppError("Địa chỉ giao hàng không hợp lệ", 404);
            }

            const addressSnapshot = `${address.street}, ${address.ward ? address.ward + ", " : ""}${address.district ? address.district + ", " : ""}${address.city}, ${address.country}`;

            // 2. Fetch dishes to get real-time prices & validate availability
            const dishIds = items.map(item => item.dish_id);
            const dishes = await dishModel.findAll({
                where: { dish_id: dishIds, status: 'active', available: true }
            });

            if (dishes.length !== items.length) {
                throw new AppError("Một số món ăn không còn khả dụng hoặc không tồn tại", 400);
            }

            // 3. Enforce single-brand cart rule
            const brands = [...new Set(dishes.map(d => d.brand || "Eatsy"))];
            if (brands.length > 1) {
                throw new AppError(
                    `Không thể đặt hàng từ nhiều thương hiệu cùng lúc. Giỏ hàng chứa: ${brands.join(", ")}`,
                    400,
                );
            }
            const orderBrand = brands[0];

            // Map items with real prices
            const validatedItems = items.map(item => {
                const dish = dishes.find(d => d.dish_id === item.dish_id);
                return {
                    ...item,
                    name: dish.name,
                    price: dish.price,
                    preparation_time: dish.preparation_time || 0,
                };
            });

            // 4. Compute estimated delivery time
            // Base delivery time (15 min) + max preparation time across items
            const BASE_DELIVERY_MINUTES = 15;
            const maxPrepTime = Math.max(...validatedItems.map(i => i.preparation_time), 0);
            const estimatedTime = BASE_DELIVERY_MINUTES + maxPrepTime;

            // 5. Create the Order
            const orderId = uuidv4();
            const newOrder = await orderModel.create(
                {
                    order_id: orderId,
                    account_id: userId,
                    quantity: validatedItems.reduce((acc, i) => acc + i.quantity, 0),
                    foods: validatedItems.map((i) => `${i.name} x${i.quantity}`).join(", "),
                    brand: orderBrand,
                    estimated_time: estimatedTime,
                    order_note: note,
                    order_status: "pending",
                    address_id,
                    payment_method: payment_method || "Cash",
                    delivery_address: addressSnapshot,
                },
                { transaction: t },
            );

            // 6. Create Order Items
            const orderItems = validatedItems.map((item) => ({
                order_item_id: uuidv4(),
                order_id: orderId,
                dish_id: item.dish_id,
                quantity: item.quantity,
            }));

            await orderItemModel.bulkCreate(orderItems, { transaction: t });

            // 7. Remove items from Cart
            const cart = await cartModel.findOne({ where: { user_id: userId } });
            if (cart) {
                await cartItemModel.destroy({
                    where: {
                        cart_id: cart.cart_id,
                        dish_id: items.map((i) => i.dish_id),
                    },
                    transaction: t,
                });
            }

            await t.commit();
            return {
                order_id: orderId,
                brand: orderBrand,
                estimated_time: estimatedTime,
                total_amount: validatedItems.reduce((acc, i) => acc + (i.price * i.quantity), 0),
            };
        } catch (error) {
            if (t) await t.rollback();
            console.error("Error creating order:", error);
            throw error;
        }
    },

    // GET /user/orders/:id
    getOrderById: async (userId, orderId) => {
        try {
            const order = await orderModel.findOne({
                where: { order_id: orderId },
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
            });

            if (!order) {
                const error = new Error("Order not found");
                error.status = 404;
                throw error;
            }

            if (order.account_id !== userId) {
                const error = new Error("Access denied");
                error.status = 403;
                throw error;
            }

            const plainOrder = order.get({ plain: true });
            return {
                order_id: plainOrder.order_id,
                status: plainOrder.order_status,
                brand: plainOrder.brand || "Eatsy",
                estimated_time: plainOrder.estimated_time,
                total_amount: plainOrder.items.reduce(
                    (sum, item) => sum + item.quantity * (item.dish?.price || 0),
                    0,
                ),
                delivery_address: plainOrder.delivery_address,
                created_at: plainOrder.order_date,
                items_preview: plainOrder.items.map((item) => ({
                    name: item.dish?.name || "Unknown Dish",
                    quantity: item.quantity,
                })),
                items: plainOrder.items.map((item) => ({
                    name: item.dish?.name || "Unknown Dish",
                    quantity: item.quantity,
                    price: item.dish?.price || 0,
                    thumbnail: item.dish?.thumbnail_path,
                })),
            };
        } catch (error) {
            console.error("Error fetching order detail:", error);
            throw error;
        }
    },
    
    // PUT /admin/orders/:id/status
    updateOrderStatus: async (orderId, status) => {
        try {
            const order = await orderModel.findOne({ where: { order_id: orderId } });
            if (!order) {
                const error = new Error("Order not found");
                error.status = 404;
                throw error;
            }

            // Valid status transitions
            const validStatuses = ['pending', 'confirmed', 'delivering', 'delivered', 'cancelled'];
            if (!validStatuses.includes(status)) {
                const error = new Error("Invalid status");
                error.status = 400;
                throw error;
            }

            await order.update({ order_status: status });
            return order;
        } catch (error) {
            console.error("Error updating order status:", error);
            throw error;
        }
    },

    /**
     * Lightweight order summary for socket emission.
     * Fetches only the fields needed for real-time UI updates.
     */
    getOrderSummary: async (orderId) => {
        try {
            const order = await orderModel.findOne({
                where: { order_id: orderId },
                attributes: ["order_id", "order_status", "brand", "estimated_time", "order_date"],
                include: [
                    {
                        model: orderItemModel,
                        as: "items",
                        attributes: ["quantity"],
                        include: [
                            {
                                model: dishModel,
                                as: "dish",
                                attributes: ["name", "price"],
                            },
                        ],
                    },
                ],
            });

            if (!order) {
                const error = new Error("Order not found");
                error.status = 404;
                throw error;
            }

            const plainOrder = order.get({ plain: true });
            return {
                order_id: plainOrder.order_id,
                status: plainOrder.order_status,
                brand: plainOrder.brand || "Eatsy",
                estimated_time: plainOrder.estimated_time,
                total_amount: plainOrder.items.reduce(
                    (sum, item) => sum + item.quantity * (item.dish?.price || 0),
                    0,
                ),
                items_preview: plainOrder.items.map((item) => ({
                    name: item.dish?.name || "Unknown Dish",
                    quantity: item.quantity,
                })),
            };
        } catch (error) {
            console.error("Error fetching order summary:", error);
            throw error;
        }
    },
};

module.exports = OrderService;
