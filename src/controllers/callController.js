const CallService = require("@services/callService");

/**
 * Initiate a call
 * POST /api/calls
 */
const initiateCall = async (req, res) => {
    try {
        const userId = req.user.username;
        const { recipientId, conversationId, callType } = req.body;

        if (!recipientId || !conversationId || !callType) {
            return res.status(400).json({
                success: false,
                message: "recipientId, conversationId, and callType are required",
            });
        }

        if (userId === recipientId) {
            return res.status(400).json({
                success: false,
                message: "Cannot call yourself",
            });
        }

        const call = await CallService.initiateCall(userId, recipientId, conversationId, callType);

        res.status(201).json({
            success: true,
            data: call,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Accept a call
 * POST /api/calls/:callId/accept
 */
const acceptCall = async (req, res) => {
    try {
        const { callId } = req.params;
        const io = req.app.get("io");

        if (!callId) {
            return res.status(400).json({
                success: false,
                message: "callId is required",
            });
        }

        // Note: recipientSocketId should be captured from socket connection
        const result = await CallService.acceptCall(callId, "");

        // Emit event to initiator
        if (io) {
            io.emit("call_accepted", {
                callId,
                timestamp: new Date().toISOString(),
            });
        }

        res.status(200).json({
            success: true,
            data: result.call,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Reject a call
 * POST /api/calls/:callId/reject
 */
const rejectCall = async (req, res) => {
    try {
        const { callId } = req.params;
        const { reason = "user_declined" } = req.body;
        const io = req.app.get("io");

        if (!callId) {
            return res.status(400).json({
                success: false,
                message: "callId is required",
            });
        }

        const call = await CallService.rejectCall(callId, reason);

        // Emit event to initiator
        if (io) {
            io.emit("call_rejected", {
                callId,
                reason,
                timestamp: new Date().toISOString(),
            });
        }

        res.status(200).json({
            success: true,
            data: call,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * End a call
 * POST /api/calls/:callId/end
 */
const endCall = async (req, res) => {
    try {
        const { callId } = req.params;
        const io = req.app.get("io");

        if (!callId) {
            return res.status(400).json({
                success: false,
                message: "callId is required",
            });
        }

        const call = await CallService.endCall(callId);

        // Emit event
        if (io) {
            io.emit("call_ended", {
                callId,
                duration: call.duration_seconds,
                timestamp: new Date().toISOString(),
            });
        }

        res.status(200).json({
            success: true,
            data: call,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get call history for conversation
 * GET /api/conversations/:conversationId/calls
 */
const getCallHistory = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { limit = 50, cursor } = req.query;

        if (!conversationId) {
            return res.status(400).json({
                success: false,
                message: "conversationId is required",
            });
        }

        const result = await CallService.getCallHistory(conversationId, parseInt(limit), cursor);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get active calls for user
 * GET /api/calls/active
 */
const getActiveCalls = async (req, res) => {
    try {
        const userId = req.user.username;

        const calls = await CallService.getActiveCallsForUser(userId);

        res.status(200).json({
            success: true,
            data: calls,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get call by ID
 * GET /api/calls/:callId
 */
const getCallById = async (req, res) => {
    try {
        const { callId } = req.params;

        if (!callId) {
            return res.status(400).json({
                success: false,
                message: "callId is required",
            });
        }

        const CallModel = require("@models/callModel");
        const call = await CallModel.findById(callId);

        if (!call) {
            return res.status(404).json({
                success: false,
                message: "Call not found",
            });
        }

        res.status(200).json({
            success: true,
            data: call,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    initiateCall,
    acceptCall,
    rejectCall,
    endCall,
    getCallHistory,
    getActiveCalls,
    getCallById,
};
