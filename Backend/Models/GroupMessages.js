const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    recevierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    reviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GroupMessages"
    },
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    reviewedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    rating: {
        type: Number,
        default: 0
    },
    sessionToken: {
        type: String,
        unique: true,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
    skillWantToLearn: {
        type: String,
        default: null
    },
    time: {
        type: String,
    },
    type: {
        type: String,
        enum: ["session_request", "session_created", "review"],
        required: true
    },
    status: {
        type: String,
        enum: ["upcoming", "active", "Session Completed"],
        default: null
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isReviewed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const GroupMessages = mongoose.model("GroupMessages", Schema)

module.exports = GroupMessages;
