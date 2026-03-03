const authMiddleWare = require('../MiddleWare/AuthMiddleware');
const { createGroup, getGroups, editTitle, deleteGroup, getOneGroup, leaveGroup } = require('../Controllers/GroupController');
const express = require('express');
const router = express.Router();

router.post('/create-group', authMiddleWare, createGroup);
router.get('/get-groups', authMiddleWare, getGroups);
router.get('/get-one-group/:id', authMiddleWare, getOneGroup);
router.put('/change-title', authMiddleWare, editTitle);
router.delete('/delete-group/:id', authMiddleWare, deleteGroup);
router.put('/leave-group/:id', authMiddleWare, leaveGroup);

module.exports = router;