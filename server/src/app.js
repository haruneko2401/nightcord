const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const serverRoutes = require('./routes/servers');
const messageRoutes = require('./routes/messages');
const chatRoutes = require('./routes/chat');
const messageController = require('./controllers/messageController'); // Directly using controller for separate routes
const verifyToken = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chat', chatRoutes);

// Shared logic routes that were top-level in server.js
// /api/friends
app.get('/api/friends', verifyToken, messageController.getFriends);
// /api/direct-messages
app.get('/api/direct-messages', verifyToken, messageController.getDirectMessages);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

module.exports = app;
