const express = require('express')
const { getSkillCategories, searchSkill, getRanking, getReccomendedSkills, getNotifications, SendNotification, deleteNotification, markAllNotificationsRead, sendRequestNotifictaion } = require('../Controllers/SkillCategories')
const authMiddleWare = require("../MiddleWare/AuthMiddleware")
const router = express.Router()

router.get('/GetSkillCategories', authMiddleWare, getSkillCategories);
router.post('/getReccomendedSkills', authMiddleWare, getReccomendedSkills);
router.get('/searchSkill', authMiddleWare, searchSkill);
router.get('/get-rankings', authMiddleWare, getRanking);
router.get('/get-Notifications', authMiddleWare, getNotifications);
router.post('/send-Notifications', authMiddleWare, SendNotification);
router.post('/delete-Notifications', authMiddleWare, deleteNotification);
router.patch('/mark-notifications', authMiddleWare, markAllNotificationsRead);
router.post('/send-request-notification', authMiddleWare, sendRequestNotifictaion);

module.exports = router;