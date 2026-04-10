require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("@config/swagger");

const routes = require("@routes/index");
const useMiddlewares = require("@middlewares/index");
const { connectToDatabase } = require("@config/sequelize");

const app = express();

app.use(express.json());

// using middlewares
useMiddlewares(app);

// Swagger UI
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecs, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    }),
);

// routing
routes(app);

// connect to the database
connectToDatabase();

module.exports = app;
