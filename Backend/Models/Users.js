const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    name: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    }, googleId: {
        type: String,
        default: null
    },
    profileImageUrl: { type: String, default: null },
    workImageUrl: { type: [String], default: [] },
    bio: { type: String, default: '' },
    skillsKnow: { type: [String], default: [] },
    skillsWantToKnow: { type: [String], default: [] },
    socialLink: { type: String, default: '' },
    languages: { type: [String], default: [] },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    lastActive: { type: Date, default: null },
    reports: [
        {
            reason: {
                type: String,
                enum: [
                    "sexual_harassment",
                    "theft",
                    "impersonation",
                    "vulgar_language",
                    "spam",
                    "other"
                ]
            },
            count: { type: Number, default: 1 }
        }
    ],
    reportedCount: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
    blockedAt: { type: Date, default: null },
    BlockCount: { type: Number, default: 0 }
}, { timestamps: true }
);

const User = mongoose.model('User', Schema);

module.exports = User;