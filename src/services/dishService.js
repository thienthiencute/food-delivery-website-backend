const { Op } = require("sequelize");
const dishModel = require("@models/dishModel");

const getAllDish = async () => {
    try {
        return await dishModel.findAll();
    } catch (error) {
        console.error(error);
    }
};

const getDishesByName = async (name) => {
    try {
        return await dishModel.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`,
                },
            },
        });
    } catch (error) {
        console.error("Error finding dishes by name:", error);
        throw error;
    }
};

const getDishById = async (dish_id, attributes) => {
    try {
        return await dishModel.findOne({ attributes: attributes, where: { dish_id: dish_id } });
    } catch (error) {
        console.log("Get dish failed", error);
    }
};

module.exports = { getAllDish, getDishesByName, getDishById };
