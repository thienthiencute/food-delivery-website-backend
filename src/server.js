require("dotenv").config();
const express = require("express");

const routes = require("@routes/index");
const useMiddlewares = require("@middlewares/index");
const { connectToDatabase } = require("@config/sequelize");

const app = express();

app.use(express.json());

// using middlewares
useMiddlewares(app);

// routing
routes(app);

// connect to the database
connectToDatabase();

module.exports = app;
