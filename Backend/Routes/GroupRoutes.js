const authMiddleWare = require('../MiddleWare/AuthMiddleware');
const { createGroup, getGroups, editTitle, deleteGroup, getOneGroup } = require('../Controllers/GroupController');
const express = require('express');
const router = express.Router();

router.post('/create-group', authMiddleWare, createGroup);
router.get('/get-groups', authMiddleWare, getGroups);
router.get('/get-one-group/:id', authMiddleWare, getOneGroup);
router.put('/change-title', authMiddleWare, editTitle);
router.delete('/delete-group/:id', authMiddleWare, deleteGroup);

module.exports = router;