const UserRatings = new mongoose.Schema(
    {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: true,
            unique: true,
        },

        reviewedUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        reviewerUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        skill: {
            type: String,
            required: true,
        },

        rating: {
            type: Number,
            min: 1,
            max: 10,
            required: true,
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("UserRatings", UserRatings);
