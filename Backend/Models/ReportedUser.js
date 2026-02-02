const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    reportedId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, required: true },
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, required: true },
    reports: { type: String, default: null },
    reportedDateTime: { type: String, default: null }
})

const ReportedUser = mongoose.model("ReportedUser", Schema)

module.exports = ReportedUser;