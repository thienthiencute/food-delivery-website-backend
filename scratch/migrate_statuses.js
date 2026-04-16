require("dotenv").config();
const { orderModel } = require("../src/models");

const migrateStatuses = async () => {
    try {
        console.log("Starting status migration...");
        
        // 1. Convert Pending -> pending
        const [p] = await orderModel.update(
            { order_status: "pending" },
            { where: { order_status: "Pending" } }
        );
        console.log(`Updated ${p} Pending -> pending`);

        // 2. Convert In Progress -> delivering
        const [ip] = await orderModel.update(
            { order_status: "delivering" },
            { where: { order_status: "In Progress" } }
        );
        console.log(`Updated ${ip} In Progress -> delivering`);

        // 3. Convert Completed -> delivered
        const [c] = await orderModel.update(
            { order_status: "delivered" },
            { where: { order_status: "Completed" } }
        );
        console.log(`Updated ${c} Completed -> delivered`);

        // 4. Convert Cancelled -> cancelled
        const [can] = await orderModel.update(
            { order_status: "cancelled" },
            { where: { order_status: "Cancelled" } }
        );
        console.log(`Updated ${can} Cancelled -> cancelled`);

        console.log("Migration finished successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

migrateStatuses();
