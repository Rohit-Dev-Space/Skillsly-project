const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    badgeId: { type: mongoose.Schema.Types.ObjectId, ref: "Badges", required: true },
    level: { type: String, enum: ["Efficiency III", "Efficiency II", "Guru"] },
    title: { type: String, default: '' },
    Description: { type: String, default: '' },
    awardedAt: { type: Date, default: Date.now }
});

const ApprovedBadgeUser = mongoose.model("ApprovedBadgeUser", Schema);

module.exports = ApprovedBadgeUser;