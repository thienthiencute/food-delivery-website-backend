const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("@config/sequelize");
const { cartModel, cartItemModel, dishModel } = require("@models");

/**
 * Get all cart items for a user, enriched with Dish details and computed totals.
 */
const getCartItemsByUserId = async (user_id) => {
    try {
        const cart = await cartModel.findOne({
            where: { user_id },
        });

        if (!cart) {
            return {
                items: [],
                totalQuantity: 0,
                totalAmount: 0,
            };
        }

        const cartItems = await cartItemModel.findAll({
            where: { cart_id: cart.cart_id },
            include: [
                {
                    model: dishModel,
                    as: "dish",
                    attributes: ["name", "price", "thumbnail_path", "available", "stock", "status", "brand"],
                },
            ],
            order: [["created_at", "DESC"]],
        });

        const enrichedItems = cartItems.map((item) => {
            const dish = item.dish;
            const is_available = dish && dish.available && dish.status === "active";
            const has_stock = dish && dish.stock >= item.quantity;

            return {
                ...item.get({ plain: true }),
                is_available,
                has_stock,
                warning: !is_available ? "Sản phẩm hiện không khả dụng" : !has_stock ? "Số lượng trong kho không đủ" : null,
            };
        });

        const totals = enrichedItems.reduce(
            (acc, item) => {
                if (item.is_available && item.has_stock) {
                    acc.totalQuantity += item.quantity;
                    acc.totalAmount += Number(item.price_snapshot) * item.quantity;
                }
                return acc;
            },
            { totalQuantity: 0, totalAmount: 0 },
        );

        return {
            items: enrichedItems,
            ...totals,
        };
    } catch (error) {
        console.error("Error in getCartItemsByUserId:", error);
        throw error;
    }
};

/**
 * Add or increment item in cart with stock validation and transaction.
 */
const addCartItem = async (userId, dishId, quantity) => {
    const transaction = await sequelize.transaction();
    try {
        // 1. Ensure Cart exists
        let cart = await cartModel.findOne({ where: { user_id: userId }, transaction });
        if (!cart) {
            cart = await cartModel.create({ cart_id: uuidv4(), user_id: userId }, { transaction });
        }

        // 2. Validate Dish
        const dish = await dishModel.findOne({ where: { dish_id: dishId }, transaction });
        if (!dish || dish.status !== "active" || !dish.available) {
            throw new Error("Sản phẩm không khả dụng");
        }

        if (dish.stock < quantity) {
            throw new Error(`Chỉ còn ${dish.stock} sản phẩm trong kho`);
        }

        // 3. Check if exists
        const existingItem = await cartItemModel.findOne({
            where: { cart_id: cart.cart_id, dish_id: dishId },
            transaction,
        });

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (dish.stock < newQuantity) {
                throw new Error(`Không thể thêm. Tổng số lượng vượt quá kho (${dish.stock})`);
            }
            await existingItem.update({ quantity: newQuantity, price_snapshot: dish.price }, { transaction });
        } else {
            await cartItemModel.create(
                {
                    cart_item_id: uuidv4(),
                    cart_id: cart.cart_id,
                    dish_id: dishId,
                    quantity,
                    price_snapshot: dish.price,
                },
                { transaction },
            );
        }

        await transaction.commit();
        return await getCartItemsByUserId(userId);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/**
 * Update item quantity with stock validation.
 */
const updateCartItemQuantity = async (userId, cartItemId, quantity) => {
    const transaction = await sequelize.transaction();
    try {
        const cartItem = await cartItemModel.findOne({
            where: { cart_item_id: cartItemId },
            include: [{ model: dishModel, as: "dish" }],
            transaction,
        });

        if (!cartItem) throw new Error("Mục giỏ hàng không tồn tại");

        if (quantity > 0) {
            const dish = cartItem.dish;
            if (!dish || dish.status !== "active" || !dish.available) {
                throw new Error("Sản phẩm không khả dụng");
            }
            if (dish.stock < quantity) {
                throw new Error(`Chỉ còn ${dish.stock} sản phẩm trong kho`);
            }
            await cartItem.update({ quantity, price_snapshot: dish.price }, { transaction });
        } else {
            await cartItem.destroy({ transaction });
        }

        await transaction.commit();
        return await getCartItemsByUserId(userId);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/**
 * Delete single cart item.
 */
const deleteCartItem = async (userId, cartItemId) => {
    try {
        await cartItemModel.destroy({
            where: { cart_item_id: cartItemId },
        });
        return await getCartItemsByUserId(userId);
    } catch (error) {
        console.error("Error in deleteCartItem:", error);
        throw error;
    }
};

/**
 * Clear all items in user's cart.
 */
const clearCartByUserId = async (userId) => {
    const transaction = await sequelize.transaction();
    try {
        const cart = await cartModel.findOne({ where: { user_id: userId }, transaction });
        if (cart) {
            await cartItemModel.destroy({
                where: { cart_id: cart.cart_id },
                transaction,
            });
        }
        await transaction.commit();
        return { items: [], totalQuantity: 0, totalAmount: 0 };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    getCartItemsByUserId,
    addCartItem,
    updateCartItemQuantity,
    deleteCartItem,
    clearCartByUserId,
};
