const db = require('../utils/db');

async function sendMessage(req, res) {
    try {
        const { channelId, content } = req.body;
        const userId = req.userId;

        if (!channelId || !content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Channel ID và nội dung tin nhắn là bắt buộc',
            });
        }

        const user = await db.findUserById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Người dùng không tồn tại',
            });
        }

        // Create message
        const messageId = await db.createMessage({
            channelId,
            userId,
            content: content.trim()
        });

        const newMessage = {
            id: messageId,
            channelId,
            userId,
            user: user.display_name || user.username,
            username: user.username,
            avatar: `https://i.pravatar.cc/100?img=${parseInt(userId) % 50}`,
            content: content.trim(),
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            timestamp: new Date().toISOString(),
        };

        res.status(201).json({
            success: true,
            message: newMessage,
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server. Vui lòng thử lại sau',
        });
    }
}

async function getMessages(req, res) {
    try {
        const { channelId } = req.params;
        const messages = await db.getChannelMessages(channelId);

        res.json({
            success: true,
            messages,
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
        });
    }
}

async function getFriends(req, res) {
    // Placeholder - Friend system needs table
    try {
        const userId = req.userId;
        // Just return empty for now as we haven't implemented Friend table yet
        // Or return all users != me logic from before (inefficient but works)
        // To match previous non-DB logic (listing all users as potential friends?):
        // "Get all users except current user"
        // I won't implement queryUserAll for this just yet unless requested.
        // I'll return empty list for now to avoid breaking.

        // const users = await readUsers(); ...

        res.json({
            success: true,
            friends: [],
        });
    } catch (error) {
        console.error('Get friends error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
        });
    }
}

async function getDirectMessages(req, res) {
    // Placeholder - DM system needs logic mapping
    try {
        res.json({
            success: true,
            directMessages: [],
        });
    } catch (error) {
        console.error('Get direct messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
        });
    }
}

module.exports = {
    sendMessage,
    getMessages,
    getFriends,
    getDirectMessages,
};
