const { v4: uuidv4 } = require("uuid");
const dynamodb = require("@config/dynamodb");

const TABLE_NAME = "messages";

class MessageModel {
    static async create(messageData) {
        const message_id = uuidv4();
        const now = new Date().toISOString();

        const params = {
            TableName: TABLE_NAME,
            Item: {
                message_id,
                ...messageData,
                created_at: now,
                updated_at: now,
                is_read: false,
                is_deleted: false,
                is_edited: false,
            },
        };

        await dynamodb.put(params).promise();
        return params.Item;
    }

    static async findById(conversationId, messageId) {
        const params = {
            TableName: TABLE_NAME,
            Key: { conversation_id: conversationId, message_id: messageId },
        };

        const result = await dynamodb.get(params).promise();
        return result.Item || null;
    }

    static async getHistory(conversationId, limit = 50, cursor = null, userId = null, deletedAt = null) {
        const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "conversation_id = :conversationId",
            FilterExpression: "is_deleted = :is_deleted",
            ExpressionAttributeValues: {
                ":conversationId": conversationId,
                ":is_deleted": false,
            },
            Limit: limit,
            ScanIndexForward: false, // des descending (newest first)
            ExclusiveStartKey: cursor,
        };

        const result = await dynamodb.query(params).promise();

        // Filter out messages that have been deleted by this user
        let messages = result.Items || [];
        if (userId) {
            messages = messages.filter((msg) => {
                const deletedBy = msg.deleted_by || [];
                return !deletedBy.includes(userId);
            });
        }

        // Filter out messages created before user deleted the conversation
        if (deletedAt) {
            messages = messages.filter((msg) => new Date(msg.created_at) > new Date(deletedAt));
        }

        return {
            messages,
            lastKey: result.LastEvaluatedKey,
        };
    }

    static async update(conversationId, messageId, updateData) {
        const now = new Date().toISOString();
        const updateFields = Object.keys(updateData)
            .map((key) => `${key} = :${key}`)
            .join(", ");

        const expressionAttributeValues = Object.keys(updateData).reduce(
            (acc, key) => {
                acc[`:${key}`] = updateData[key];
                return acc;
            },
            { ":updated_at": now },
        );

        const params = {
            TableName: TABLE_NAME,
            Key: { conversation_id: conversationId, message_id: messageId },
            UpdateExpression: `SET ${updateFields}, updated_at = :updated_at`,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "ALL_NEW",
        };

        const result = await dynamodb.update(params).promise();
        return result.Attributes;
    }

    static async updateStatus(conversationId, messageId, isRead = true) {
        const now = new Date().toISOString();
        const params = {
            TableName: TABLE_NAME,
            Key: { conversation_id: conversationId, message_id: messageId },
            UpdateExpression: "SET is_read = :is_read, read_at = :read_at",
            ExpressionAttributeValues: {
                ":is_read": isRead,
                ":read_at": now,
            },
            ReturnValues: "ALL_NEW",
        };

        const result = await dynamodb.update(params).promise();
        return result.Attributes;
    }

    static async delete(conversationId, messageId) {
        const now = new Date().toISOString();
        const params = {
            TableName: TABLE_NAME,
            Key: { conversation_id: conversationId, message_id: messageId },
            UpdateExpression: "SET is_deleted = :is_deleted, updated_at = :updated_at",
            ExpressionAttributeValues: {
                ":is_deleted": true,
                ":updated_at": now,
            },
            ReturnValues: "ALL_NEW",
        };

        const result = await dynamodb.update(params).promise();
        return result.Attributes;
    }

    // Delete message for a specific user (Delete for Me)
    static async deleteMessageForUser(conversationId, messageId, userId) {
        const now = new Date().toISOString();
        const params = {
            TableName: TABLE_NAME,
            Key: { conversation_id: conversationId, message_id: messageId },
            UpdateExpression: "SET deleted_by = if_not_exists(deleted_by, :empty) + :userId, updated_at = :updated_at",
            ExpressionAttributeValues: {
                ":empty": new Set(),
                ":userId": new Set([userId]),
                ":updated_at": now,
            },
            ReturnValues: "ALL_NEW",
        };

        const result = await dynamodb.update(params).promise();
        return result.Attributes;
    }

    // Check if message is deleted for a specific user
    static async isDeletedForUser(conversationId, messageId, userId) {
        const message = await this.findById(conversationId, messageId);
        if (!message) return true;

        const deletedBy = message.deleted_by || [];
        return deletedBy.includes(userId);
    }

    static async addReaction(conversationId, messageId, emoji, userId) {
        const params = {
            TableName: TABLE_NAME,
            Key: { conversation_id: conversationId, message_id: messageId },
            UpdateExpression: "SET reactions = if_not_exists(reactions, :empty) + :reaction",
            ExpressionAttributeValues: {
                ":empty": [],
                ":reaction": [{ emoji, userId, createdAt: new Date().toISOString() }],
            },
            ReturnValues: "ALL_NEW",
        };

        const result = await dynamodb.update(params).promise();
        return result.Attributes;
    }

    static async removeReaction(conversationId, messageId, emoji, userId) {
        const message = await this.findById(conversationId, messageId);
        if (!message) return null;

        const reactions = (message.reactions || []).filter((r) => !(r.emoji === emoji && r.userId === userId));

        const params = {
            TableName: TABLE_NAME,
            Key: { conversation_id: conversationId, message_id: messageId },
            UpdateExpression: "SET reactions = :reactions",
            ExpressionAttributeValues: {
                ":reactions": reactions,
            },
            ReturnValues: "ALL_NEW",
        };

        const result = await dynamodb.update(params).promise();
        return result.Attributes;
    }

    static async countUnread(conversationId, userId) {
        const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression:
                "conversation_id = :conversationId AND is_deleted = :is_deleted AND is_read = :is_read",
            ExpressionAttributeValues: {
                ":conversationId": conversationId,
                ":is_deleted": false,
                ":is_read": false,
            },
            Select: "COUNT",
        };

        const result = await dynamodb.query(params).promise();
        return result.Count;
    }
}

module.exports = MessageModel;
