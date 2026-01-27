const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, enum: ["Friend_Request", "System"], required: true },
    title: { type: String, default: null },
    isRead: { type: Boolean, default: false }
}, { timestamps: true })

const Notification = mongoose.model("Notification", Schema);

module.exports = Notification;