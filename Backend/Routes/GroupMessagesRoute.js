const { sendSessionRequest, deleteSessionRequest, createJoinSession, getJoinSessionsByGroup, checkIsReviewed, sendReview, verifySession, updateStatus, createReviewMessage, getMessagesByGroup, deleteJoinSession } = require('../Controllers/GroupMessagesController');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');

router.post('/send-session-request', authMiddleware, sendSessionRequest);
router.get('/group-messages/:groupId', authMiddleware, getMessagesByGroup);
router.delete('/delete-session-request/:sessionRequestId', authMiddleware, deleteSessionRequest);
router.post('/create-join-session/:sessionRequestId', authMiddleware, createJoinSession);
router.get('/get-join-sessions/:groupId', authMiddleware, getJoinSessionsByGroup);
router.get('/get-particular-Join-session/:groupId/:sessionId', authMiddleware, checkIsReviewed);
router.post('/give-review', authMiddleware, sendReview);
router.get('/verify/:sessionToken', authMiddleware, verifySession);
router.put('/update-status/:token', authMiddleware, updateStatus)
router.post('/create-review', authMiddleware, createReviewMessage)
router.delete('/delete-join-session/:id', authMiddleware, deleteJoinSession)


module.exports = router;