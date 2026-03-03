const express = require('express')
const router = express.Router();
const authMiddleware = require('../MiddleWare/AuthMiddleware');
const { editDescription, editLink, editIterables, getBadges } = require('../Controllers/EditController');

router.post('/update-description', authMiddleware, editDescription);
router.post('/update-socialLink', authMiddleware, editLink);
router.post('/update-iterables', authMiddleware, editIterables);
router.get('/user-badges', authMiddleware, getBadges);

module.exports = router;