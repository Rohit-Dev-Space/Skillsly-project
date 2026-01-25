const SessionSchema = new mongoose.Schema(
    {
        requesterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        providerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        skill: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["requested", "accepted", "completed", "cancelled"],
            default: "requested"
        },

        isRated: {
            type: Boolean,
            default: false
        },

        scheduledAt: Date,
        completedAt: Date
    },
    { timestamps: true }
);

module.exports = mongoose.model("Session", SessionSchema);
