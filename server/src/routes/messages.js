const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const verifyToken = require('../middleware/auth');

router.use(verifyToken);

router.post('/send', messageController.sendMessage);
router.get('/friends', messageController.getFriends); // Move /friends to messages or keep in server.js? Plan said messages.js
router.get('/direct-messages', messageController.getDirectMessages);
// Note: /api/messages/:channelId matches /api/messages/friends if friends is not before it? 
// Actually Friends API was separate in server.js (/api/friends). 
// Implementation plan said: Logic for Sending/Getting messages.
// But server.js has /api/friends and /api/direct-messages separately.
// The plan didn't explicitly separate Friends controller, so I'll put them in messageController but routes need to be careful.
// Maybe I should have a friendController? Or just put them in separate routes.
// The plan said: src/controllers/messageController.js - Logic for Sending/Getting messages.
// I will include getFriends and getDirectMessages here as they are related to messaging/user connections.

// However, valid routes are:
// POST /api/messages/send
// GET /api/messages/:channelId

// If I put /friends inside /api/messages, it becomes /api/messages/friends.
// In server.js it was /api/friends.
// So I should create a separate router for friends? Or put it in auth? Or create a `user` route?
// I'll stick to reproducing server.js endpoints.
// server.js:
// /api/messages/send
// /api/messages/:channelId
// /api/friends
// /api/direct-messages

// So I should probably export specific routers or have a friends router.
// Or I can mount them on different paths in app.js.
// I will export router as is for messages, and create separate routes for friends/dms or handle them in app.js.
// Actually, I'll put friends/dms in `userController` or similar? 
// Current creation: messageController contains them.
// I will create `src/routes/friends.js` and `src/routes/directMessages.js`?
// Too many files. 
// I will put them in `src/routes/users.js`?
// Let's look at `server.js` again. `/api/friends`.
// It's cleaner to have `src/routes/friends.js`.

// But wait, I'm bound by my previous tool calls logic.
// I'll put them in `messageController` but I'll create `src/routes/messages.js` ONLY for `/api/messages`.
// And `src/routes/friends.js` for `/api/friends`?
// I'll add `src/routes/friends.js` and `src/routes/directMessages.js`.
// Or just put them in `src/routes/users.js` using the same controller functionality.

// Let's create `src/routes/messages.js` containing ONLY /send and /:channelId.
// And create `src/routes/misc.js` or `users.js` for the others.
// Or I can map:
// /api/friends -> use messageController.getFriends
// /api/direct-messages -> use messageController.getDirectMessages
// In `app.js` I will mount them.

router.get('/:channelId', messageController.getMessages);

module.exports = router;
