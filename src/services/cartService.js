const cartModel = require("@models/cartModel");
const cartItemModel = require("@models/cartItemModel");
const { getDishById } = require("./dishService");

const getCartItemsByUserId = async (user_id) => {
    try {
        const cart = await cartModel.findOne({
            where: { user_id: user_id },
        });

        const { cart_id } = cart;

        const cartItems = await cartItemModel.findAll({
            where: { cart_id: cart_id },
        });

        const newCartItems = Promise.all(
            cartItems.map(async (item) => {
                const { dish_id } = item;
                const dish = await getDishById(dish_id, { exclude: ["dish_id", "update_at"] });

                return { ...item.dataValues, ...dish.dataValues };
            }),
        );

        return newCartItems;
    } catch (error) {
        console.log("Error getting cart items", error);
    }
};

const addCartItem = async (currentUserId, newDishId, quantity) => {
    const currentCartItems = await getCartItemsByUserId(currentUserId);

    const { cart_id } = await cartModel.findOne({
        where: { user_id: currentUserId },
    });

    try {
        const isExistDish = currentCartItems.some((item) => item.dish_id === newDishId);

        if (isExistDish) {
            currentCartItems.forEach(async (item) => {
                if (item.dish_id === newDishId) {
                    return await updateCartItemQuantity(item.cart_item_id, item.quantity + quantity);
                }
            });
        }
        
        await cartItemModel.create({ dish_id: newDishId, cart_id, quantity });
    } catch (error) {
        console.log("Insert cart item failed ", error);
    }
};

const updateCartItemQuantity = async (cartItemId, quantity) => {
    try {
        await cartItemModel.update(
            { quantity },
            {
                where: {
                    cart_item_id: cartItemId,
                },
            },
        );
    } catch (error) {
        console.log("Update cart item quantity failed ", error);
    }
};

const deleteCartItem = async (cartItemId) => {
    try {
        await cartItemModel.destroy({
            where: {
                cart_item_id: cartItemId,
            },
        });
    } catch (error) {
        console.log("Delete cart item failed");
    }
};

module.exports = {
    getCartItemsByUserId,
    addCartItem,
    updateCartItemQuantity,
    deleteCartItem,
};
