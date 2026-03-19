const { getAllDish, getDishesByName } = require("@services/dishService");
const dishModel = require("@models/dishModel");
const { where, Op } = require("sequelize");
const categoryModel = require("@models/categoryModel");

class dishController {
    async getDishes(req, res) {
        const searchCondition = {};
        const { name, sort, category } = req.query;

        if (name) {
            searchCondition.name = { [Op.like]: `%${name}%` };
        }

        if (category) {
            const categoryRecord = await categoryModel.findOne({
                where: { name: category },
            });
            if (!categoryRecord) {
                return res.status(404).json({ message: "Category not found" });
            }
            searchCondition.category_id = categoryRecord.category_id;
        }

        try {
            const dishes = await dishModel.findAll({ where: searchCondition, order: [["price", sort || "ASC"]] });
            if (!dishes || dishes.length === 0) {
                return res.status(404).json({ message: "No dishes found" });
            }
            res.status(200).json(dishes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }


}

module.exports = new dishController();
