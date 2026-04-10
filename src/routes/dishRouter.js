const express = require("express");
const router = express.Router();

const dishController = require("@controllers/dishController");

// * Dishes
router.get("/api/", dishController.getDishes);
router.get("/api/:id", dishController.getDishById);
router.get("/api/similar/:id", dishController.getSimilarDishes);
module.exports = router;
