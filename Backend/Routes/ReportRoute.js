const express = require('express')
const authMiddleWare = require('../MiddleWare/AuthMiddleware')
const router = express.Router();
const { reportUser, isAlreadyReported } = require('../Controllers/ReportController')

router.post('/report-user', authMiddleWare, reportUser);
router.post('/already-reported', authMiddleWare, isAlreadyReported)

module.exports = router;