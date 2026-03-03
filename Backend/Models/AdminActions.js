const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date_time: { type: String, default: '' },
    reportedReason: { type: String, default: '' },
    action: { type: String, default: '' }
}, { timestamps: true })

const AdminActions = mongoose.model('AdminActions', Schema);
module.exports = AdminActions;