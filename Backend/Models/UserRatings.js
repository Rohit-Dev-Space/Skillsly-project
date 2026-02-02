const mongoose = require('mongoose');

const UserRatings = new mongoose.Schema(
    {
        UserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        skill: {
            type: String,
            required: true,
        },

        rating: {
            type: [Number],
            min: 1,
            max: 10,
            required: true,
        },
        totalReviews: {
            type: Number,
            default: 0
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model("UserRatings", UserRatings);
