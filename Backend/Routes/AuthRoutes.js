const express = require('express');
const { RegisterUserFinal, RegisterUserInitial, LoginUser, getUserProfile } = require('../Controllers/AuthController');
const authMiddleWare = require('../MiddleWare/AuthMiddleware');
const { googleLoginOnly } = require('../Controllers/googleAuthController');
const isBlockMiddleware = require('../MiddleWare/userBlockedMiddleware');
const router = express.Router();

router.post('/register-initial', RegisterUserInitial);
router.put('/register-final', isBlockMiddleware, RegisterUserFinal);
router.post('/login', isBlockMiddleware, LoginUser);
router.get('/profile', authMiddleWare, isBlockMiddleware, getUserProfile);
router.post("/google-login", isBlockMiddleware, googleLoginOnly);


module.exports = router;