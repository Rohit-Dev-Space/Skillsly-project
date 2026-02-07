const express = require('express');
const authMiddleware = require('../MiddleWare/AuthMiddleware');
const adminMiddleware = require('../MiddleWare/adminMiddleware');
const { getUserProfile } = require('../Controllers/AuthController');
const { getSkillCategories } = require('../Controllers/SkillCategories');
const { getNumberOfUser, getActiveUsersCount, newlyRegisteredNumber, getReportedUsersNumber, getPopularSkills, newlyRegistered, searchUser, getReportedUsers, reportedReasonCount, warnUser } = require('../Controllers/AdminController');

const router = express.Router();

router.get('/admin-dashboard', authMiddleware, adminMiddleware, (req, res) => {
    res.json({ message: "Welcome Admin" });
});

router.get('/users', authMiddleware, adminMiddleware, getUserProfile);
router.delete('/user/:id', authMiddleware, adminMiddleware, getSkillCategories);
router.get('/total-users', authMiddleware, adminMiddleware, getNumberOfUser);
router.get('/active-users', authMiddleware, adminMiddleware, getActiveUsersCount);
router.get('/active-user-number', authMiddleware, adminMiddleware, newlyRegisteredNumber);
router.get('/reported-user-number', authMiddleware, adminMiddleware, getReportedUsersNumber);
router.get('/popular-skills', authMiddleware, adminMiddleware, getPopularSkills);
router.get('/weekly-registrations', authMiddleware, adminMiddleware, newlyRegistered);
router.get('/user-search', authMiddleware, adminMiddleware, searchUser);
router.get('/reported-user', authMiddleware, adminMiddleware, getReportedUsers);
router.get('/rr-user-count', authMiddleware, adminMiddleware, reportedReasonCount);
router.post('/warning-message', authMiddleware, adminMiddleware, warnUser);

module.exports = router;
