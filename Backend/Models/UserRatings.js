const mongoose = require('mongoose');

const Schema = new mongoose.Schema(
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

const UserRatings = mongoose.model("UserRatings", Schema)

module.exports = UserRatings;
