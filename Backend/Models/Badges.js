const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
    title: { type: String, required: true },      // e.g., "Python Guru"
    skill: { type: String, required: true },      // e.g., "Python"
    description: { type: String, default: '' },
    iconUrl: { type: String, default: '' },
    iconBg: { type: String, default: '#fff' },
    approvedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    pendingApproval: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Badges = mongoose.model('Badges', BadgeSchema);
module.exports = Badges;
