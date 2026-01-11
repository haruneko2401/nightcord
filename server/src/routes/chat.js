const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const verifyToken = require('../middleware/auth');

router.use(verifyToken);
router.post('/typing', chatController.typing);
router.get('/typing/:channelId', chatController.getTypingUsers);

module.exports = router;
