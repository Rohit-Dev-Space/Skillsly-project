const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    title: { type: String, required: true },
    content: { type: String, required: true },
}, {
    timestamps: true
})

const Notes = mongoose.model('Notes', Schema);

module.exports = Notes;