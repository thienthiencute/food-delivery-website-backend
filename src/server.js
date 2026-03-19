const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const routes = require("@routes/index");
const useMiddlewares = require("@middlewares/index");
const { connectToDatabase } = require("@config/sequelize");

const app = express();

// using middlewares
useMiddlewares(app);

// routing
routes(app);

// connect to the database
connectToDatabase();

module.exports = app;
