const User = require('../Models/Users')
const ApprovedBadgeUser = require('../Models/ApprovedBadgeUser')
const evaluateConditionBadge = require("../Services/evaluateConditionBadges");
const Notification = require('../Models/Notifications');


const editDescription = async (req, res) => {
    const { text } = req.body;
    const id = req.user._id;
    const response = await User.findByIdAndUpdate(id, { bio: text });
    const result = await evaluateConditionBadge(id, "PROFILE_COMPLETED");
    if (result.awarded) {
        await Notification.create({
            userId: id,
            type: "System",
            title: `🎉 Congratulations! You earned the ${result.badgeName} badge. Check your profile to view all badges.`
        });
    }
    if (response) {
        await evaluateConditionBadge(id, "PROFILE_COMPLETED");
        return res.status(200).json(response);
    }
}

const editLink = async (req, res) => {
    try {
        const { link } = req.body;
        const id = req.user._id;

        const response = await User.findByIdAndUpdate(id, { socialLink: link })
        const result = await evaluateConditionBadge(id, "PROFILE_COMPLETED");
        if (result.awarded) {
            await Notification.create({
                userId: id,
                type: "System",
                title: `🎉 Congratulations! You earned the ${result.badgeName} badge. Check your profile to view all badges.`
            });
        }
        if (response) {
            await evaluateConditionBadge(id, "PROFILE_COMPLETED");
            return res.status(200).json(response);
        }

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const editIterables = async (req, res) => {
    try {
        const { skillsKnow, skillsWantToKnow, languages } = req.body;
        const id = req.user._id;

        const response = await User.findByIdAndUpdate(
            id,
            { skillsKnow, skillsWantToKnow, languages },
            { new: true }
        )
        const result = await evaluateConditionBadge(id, "PROFILE_COMPLETED");
        if (result.awarded) {
            await Notification.create({
                userId: id,
                type: "System",
                title: `🎉 Congratulations! You earned the ${result.badgeName} badge. Check your profile to view all badges.`
            });
        }

        const badgeResult = await evaluateConditionBadge(id, "SKILLS_KNOWN");
        if (badgeResult.awarded) {
            await Notification.create({
                userId: id,
                type: "System",
                title: `🎉 Congratulations! You earned the ${badgeResult.badgeName} badge. Check your profile to view all badges.`
            });
        }
        if (response) {
            return res.status(200).json(response)
        }
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const getBadges = async (req, res) => {
    try {
        const userId = req.query.userId || req.user._id;
        const response = await ApprovedBadgeUser
            .find({ userId })
            .populate('badgeId'); return res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}
module.exports = { editDescription, editLink, editIterables, getBadges }