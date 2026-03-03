const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    title: { type: String, required: true },
    groupMembers: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
    memberOne: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    memberTwo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    memberOneSkill: { type: String, required: true },
    memberTwoSkill: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Groups = mongoose.model('Groups', Schema);

module.exports = Groups;