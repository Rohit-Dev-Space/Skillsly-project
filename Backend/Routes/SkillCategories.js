const express = require('express')
const { getSkillCategories, searchSkill, getRanking, getReccomendedSkills } = require('../Controllers/SkillCategories')
const authMiddleWare = require("../MiddleWare/AuthMiddleware")
const router = express.Router()

router.get('/GetSkillCategories', authMiddleWare, getSkillCategories);
router.post('/getReccomendedSkills', authMiddleWare, getReccomendedSkills);
router.get('/searchSkill', authMiddleWare, searchSkill);
router.get('/get-rankings', authMiddleWare, getRanking);

module.exports = router;