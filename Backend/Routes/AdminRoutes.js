const express = require('express');
const authMiddleware = require('../MiddleWare/AuthMiddleware');
const adminMiddleware = require('../MiddleWare/adminMiddleware');
const { getUserProfile } = require('../Controllers/AuthController');
const { getSkillCategories } = require('../Controllers/SkillCategories');

const router = express.Router();

router.get('/admin-dashboard', authMiddleware, adminMiddleware, (req, res) => {
    res.json({ message: "Welcome Admin" });
});

router.get('/users', authMiddleware, adminMiddleware, getUserProfile);
router.delete('/user/:id', authMiddleware, adminMiddleware, getSkillCategories);

module.exports = router;
