const express = require('express');
const authMiddleware = require('../MiddleWare/AuthMiddleware');
const { searchUser, getUserInfo, sendMessage, getMessages, getConversation, markMessagesAsRead } = require('../Controllers/Conversation');
const router = express.Router();

router.get('/fetch-users', authMiddleware, searchUser);
router.get('/fetch-conversations', authMiddleware, getConversation);
router.post('/fetch-messages', authMiddleware, getMessages);
router.post('/user-info', authMiddleware, getUserInfo);
router.post('/send-message', authMiddleware, sendMessage);
router.patch('/mark-read', authMiddleware, markMessagesAsRead);


module.exports = router;