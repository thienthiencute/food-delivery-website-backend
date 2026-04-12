const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");

// Store active user connections
// Format: { userId: { socketId: socket, conversationIds: [...] } }
const userConnections = {};

const initializeWebSocket = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:1234",
            credentials: true,
        },
        transports: ["websocket", "polling"],
    });

    // Middleware to authenticate socket connection
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error("Authentication token required"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            socket.userId = decoded.user_id;
            socket.user = decoded;
            next();
        } catch (error) {
            next(new Error("Invalid token"));
        }
    });

    // Connection handler
    io.on("connection", (socket) => {
        const userId = socket.userId;
        console.log(`✅ User ${userId} connected: ${socket.id}`);

        // Track user connection
        if (!userConnections[userId]) {
            userConnections[userId] = {};
        }
        userConnections[userId][socket.id] = socket;

        // Join personal user room for receiving updates (use colon format for FE)
        socket.join(`user:${userId}`);
        console.log(`👤 User ${userId} joined personal room: user:${userId}`);

        // Join conversation rooms
        socket.on("join_conversation", (conversationId) => {
            const roomName = `conversation_${conversationId}`;
            socket.join(roomName);
            console.log(`👥 User ${userId} joined conversation: ${conversationId}`);

            // Notify others that user is online
            io.to(roomName).emit("user_online", {
                userId,
                conversationId,
                timestamp: new Date().toISOString(),
            });
        });

        // Leave conversation
        socket.on("leave_conversation", (conversationId) => {
            const roomName = `conversation_${conversationId}`;
            socket.leave(roomName);
            console.log(`👥 User ${userId} left conversation: ${conversationId}`);

            // Notify others that user is offline
            io.to(roomName).emit("user_offline", {
                userId,
                conversationId,
                timestamp: new Date().toISOString(),
            });
        });

        // Handle typing indicator
        socket.on("typing", (data) => {
            const { conversationId } = data;
            const roomName = `conversation_${conversationId}`;
            socket.to(roomName).emit("user_typing", {
                userId,
                conversationId,
                timestamp: new Date().toISOString(),
            });
        });

        // Handle stop typing
        socket.on("stop_typing", (data) => {
            const { conversationId } = data;
            const roomName = `conversation_${conversationId}`;
            socket.to(roomName).emit("user_stop_typing", {
                userId,
                conversationId,
                timestamp: new Date().toISOString(),
            });
        });

        // Disconnect handler
        socket.on("disconnect", () => {
            console.log(`❌ User ${userId} disconnected: ${socket.id}`);

            // Clean up user connection
            if (userConnections[userId]) {
                delete userConnections[userId][socket.id];
                if (Object.keys(userConnections[userId]).length === 0) {
                    delete userConnections[userId];
                }
            }
        });

        // Error handler
        socket.on("error", (error) => {
            console.error(`Socket error for user ${userId}:`, error);
        });
    });

    return io;
};

/**
 * Emit message to conversation
 * @param {SocketIO.Server} io - Socket.io server instance
 * @param {string} conversationId - Conversation ID
 * @param {object} message - Message data
 */
const emitMessageToConversation = (io, conversationId, message) => {
    const roomName = `conversation_${conversationId}`;
    io.to(roomName).emit("new_message", {
        ...message,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Emit message read status
 * @param {SocketIO.Server} io - Socket.io server instance
 * @param {string} conversationId - Conversation ID
 * @param {object} data - Read status data
 */
const emitMessageRead = (io, conversationId, data) => {
    const roomName = `conversation_${conversationId}`;
    io.to(roomName).emit("message_read", {
        ...data,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Emit message edited
 * @param {SocketIO.Server} io - Socket.io server instance
 * @param {string} conversationId - Conversation ID
 * @param {object} message - Message data
 */
const emitMessageEdited = (io, conversationId, message) => {
    const roomName = `conversation_${conversationId}`;
    io.to(roomName).emit("message_edited", {
        ...message,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Emit message deleted
 * @param {SocketIO.Server} io - Socket.io server instance
 * @param {string} conversationId - Conversation ID
 * @param {string} messageId - Message ID
 */
const emitMessageDeleted = (io, conversationId, messageId) => {
    const roomName = `conversation_${conversationId}`;
    io.to(roomName).emit("message_deleted", {
        conversationId,
        messageId,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Emit reaction added
 * @param {SocketIO.Server} io - Socket.io server instance
 * @param {string} conversationId - Conversation ID
 * @param {object} data - Reaction data
 */
const emitReactionAdded = (io, conversationId, data) => {
    const roomName = `conversation_${conversationId}`;
    io.to(roomName).emit("reaction_added", {
        ...data,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Emit reaction removed
 * @param {SocketIO.Server} io - Socket.io server instance
 * @param {string} conversationId - Conversation ID
 * @param {object} data - Reaction data
 */
const emitReactionRemoved = (io, conversationId, data) => {
    const roomName = `conversation_${conversationId}`;
    io.to(roomName).emit("reaction_removed", {
        ...data,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Emit member added to group
 * @param {SocketIO.Server} io - Socket.io server instance
 * @param {string} conversationId - Conversation ID
 * @param {object} member - Member data
 */
const emitMemberAdded = (io, conversationId, member) => {
    const roomName = `conversation_${conversationId}`;
    io.to(roomName).emit("member_added", {
        ...member,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Emit member removed from group
 * @param {SocketIO.Server} io - Socket.io server instance
 * @param {string} conversationId - Conversation ID
 * @param {string} memberId - Member ID
 */
const emitMemberRemoved = (io, conversationId, memberId) => {
    const roomName = `conversation_${conversationId}`;
    io.to(roomName).emit("member_removed", {
        conversationId,
        memberId,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Emit conversation updated (for conversation list)
 * @param {SocketIO.Server} io - Socket.io server instance
 * @param {string} conversationId - Conversation ID
 * @param {Array} memberIds - Array of member user IDs
 * @param {object} conversationData - Updated conversation data with lastMessage object
 */
const emitConversationUpdated = (io, conversationId, memberIds, conversationData) => {
    // Emit to each member's personal room so they see updated conversation list
    for (const memberId of memberIds) {
        const userRoom = `user:${memberId}`;
        io.to(userRoom).emit("conversation_updated", {
            conversationId,
            lastMessage: conversationData.lastMessage || null,
            lastMessageTimestamp: conversationData.lastMessageTimestamp,
            lastMessageId: conversationData.lastMessageId,
            unreadCount: conversationData.unreadCount,
            timestamp: new Date().toISOString(),
        });
    }
};

/**
 * Get online users in conversation
 * @param {string} conversationId - Conversation ID
 * @returns {Array} Array of online user IDs
 */
const getOnlineUsersInConversation = (io, conversationId) => {
    const roomName = `conversation_${conversationId}`;
    const sockets = io.sockets.adapter.rooms.get(roomName);
    if (!sockets) return [];

    const onlineUsers = new Set();
    for (const socketId of sockets) {
        const socket = io.sockets.sockets.get(socketId);
        if (socket && socket.userId) {
            onlineUsers.add(socket.userId);
        }
    }
    return Array.from(onlineUsers);
};

module.exports = {
    initializeWebSocket,
    emitMessageToConversation,
    emitMessageRead,
    emitMessageEdited,
    emitMessageDeleted,
    emitReactionAdded,
    emitReactionRemoved,
    emitMemberAdded,
    emitMemberRemoved,
    emitConversationUpdated,
    getOnlineUsersInConversation,
};
