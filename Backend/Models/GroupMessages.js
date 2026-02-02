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
    sessionToken: {
        type: String,
        unique: true,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    skillWantToLearn: {
        type: String,
        default: null
    },
    time: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["session_request", "session_created"],
        required: true
    },
    status: {
        type: String,
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
