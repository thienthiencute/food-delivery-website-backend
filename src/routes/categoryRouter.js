const express = require("express");
const router = express.Router();

const categoryController = require("@controllers/categoryController");

// * Categories
router.get("/api/", categoryController.getCategories);

module.exports = router;
