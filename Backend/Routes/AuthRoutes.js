const express = require('express');
const { RegisterUserFinal, RegisterUserInitial, LoginUser, getUserProfile } = require('../Controllers/AuthController');
const authMiddleWare = require('../MiddleWare/AuthMiddleware');
const { googleLoginOnly } = require('../Controllers/googleAuthController');
const router = express.Router();

router.post('/register-initial', RegisterUserInitial);
router.put('/register-final', RegisterUserFinal); // Clean route
router.post('/login', LoginUser);
router.get('/profile', authMiddleWare, getUserProfile);
router.post("/google-login", googleLoginOnly);

module.exports = router;