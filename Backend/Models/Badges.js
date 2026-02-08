const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    skill: { type: String, default: '' },
    type: { type: String, enum: ["SKILL", "ACHIEVEMENT"], required: true },
    description: { type: String, default: '' },
    levels: [
        {
            name: String,            // "Efficiency III", "Efficiency II", "Guru"
            minAvgRating: Number,    // optional
            minReviews: Number,      // optional
            minCount: Number,        // for achievements
            iconUrl: String,
        }
    ],
    condition: { type: String, default: '' },
    count: { type: Number, default: 0 },
    iconUrl: { type: String, default: '' },
    approvedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Badges = mongoose.model('Badges', BadgeSchema);
module.exports = Badges;
