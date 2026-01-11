const express = require('express');
const router = express.Router();
const serverController = require('../controllers/serverController');
const verifyToken = require('../middleware/auth');

// Apply verifyToken to all routes
router.use(verifyToken);

router.post('/create', serverController.createServer);
router.get('/', serverController.getServers);
router.get('/:serverId/channels', serverController.getChannels);
router.post('/:serverId/channels', serverController.createChannel);

module.exports = router;
