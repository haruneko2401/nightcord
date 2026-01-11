const { readTypingState, writeTypingState } = require('../utils/db');

async function typing(req, res) {
    try {
        const { channelId, username, isTyping } = req.body;
        const userId = req.userId;

        if (!channelId) {
            return res.status(400).json({
                success: false,
                message: 'Channel ID là bắt buộc',
            });
        }

        const typingState = await readTypingState();

        if (!typingState[channelId]) {
            typingState[channelId] = {};
        }

        if (isTyping) {
            typingState[channelId][userId] = {
                userId,
                username: username || 'User',
                timestamp: new Date().toISOString(),
            };
        } else {
            delete typingState[channelId][userId];
        }

        await writeTypingState(typingState);

        res.json({
            success: true,
            message: isTyping ? 'Đang soạn...' : 'Đã dừng soạn',
        });
    } catch (error) {
        console.error('Typing indicator error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
        });
    }
}

async function getTypingUsers(req, res) {
    try {
        const { channelId } = req.params;
        const typingState = await readTypingState();

        const channelTyping = typingState[channelId] || {};
        const typingUsers = Object.values(channelTyping).filter(user => {
            // Remove users who haven't typed in the last 5 seconds
            const lastTyped = new Date(user.timestamp);
            const now = new Date();
            return (now - lastTyped) < 5000;
        });

        res.json({
            success: true,
            typingUsers: typingUsers.map(u => ({ userId: u.userId, username: u.username })),
        });
    } catch (error) {
        console.error('Get typing users error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
        });
    }
}

module.exports = {
    typing,
    getTypingUsers,
};
