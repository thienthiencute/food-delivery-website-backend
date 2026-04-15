const OrderService = require("@services/orderService");
const { emitOrderUpdated } = require("../websocket");
const catchAsync = require("../utils/catchAsync");

class AdminController {
    updateOrderStatus = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const { status } = req.body;
        const io = req.app.get("io");

        const updatedOrder = await OrderService.updateOrderStatus(id, status);
        
        // Notify the user in real-time via their personal room
        emitOrderUpdated(io, updatedOrder.account_id, {
            order_id: updatedOrder.order_id,
            status: updatedOrder.order_status,
        });

        res.json({
            success: true,
            message: `Order status updated to ${status}`,
            data: {
                order_id: updatedOrder.order_id,
                status: updatedOrder.order_status,
                updated_at: updatedOrder.updatedAt
            }
        });
    });
}

module.exports = new AdminController();
