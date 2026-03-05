const ApprovedBadgeUser = require("../Models/ApprovedBadgeUser.js");
const Badges = require("../Models/Badges.js");
const User = require("../Models/Users.js");
const Group = require("../Models/Groups.js");
const GroupMessages = require("../Models/GroupMessages.js");
const Message = require("../Models/Message.js");

async function evaluateConditionBadges(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) return { awarded: false };

        const skillsKnow = user.skillsKnow || [];
        const skillsWantToKnow = user.skillsWantToKnow || [];
        const languages = user.languages || [];

        const badges = await Badges.find({ type: "ACHIEVEMENT" });

        for (const badge of badges) {
            let achieved = false;

            switch (badge.condition) {
                case "SOCIAL_BUTTERFLY": {

                    const conversations = await Message.distinct("conversationId", {
                        senderId: userId
                    });

                    achieved = conversations.length >= 10;

                    break;
                }

                case "GROUPS_CREATED": {
                    const count = await Group.countDocuments({ createdBy: userId });
                    achieved = count >= (badge.count || 0);
                    break;
                }

                case "SKILLS_KNOWN": {
                    achieved = skillsKnow.length >= (badge.count || 0);
                    break;
                }

                case "ALL_EARS": {
                    const reviewsGiven = await GroupMessages.countDocuments({
                        reviewerId: userId,
                        type: "review"
                    });
                    achieved = reviewsGiven >= 10;
                    break;
                }

                case "PROFILE_COMPLETED": {
                    achieved =
                        !!user.bio &&
                        !!user.profileImageUrl &&
                        skillsKnow.length > 0 &&
                        skillsWantToKnow.length > 0 &&
                        !!user.socialLink &&
                        languages.length > 0;
                    break;
                }
            }

            if (!achieved) continue;

            const alreadyHas = await ApprovedBadgeUser.findOne({
                userId,
                badgeId: badge._id
            });

            if (!alreadyHas) {
                await ApprovedBadgeUser.create({
                    userId,
                    badgeId: badge._id,
                    awardedAt: new Date(),
                    title: badge.title,
                    Description: badge.description
                });

                return {
                    awarded: true,
                    badgeName: badge.title,
                    type: badge.type,
                    condition: badge.condition
                };
            }
        }

        return { awarded: false };
    } catch (err) {
        console.error("Error evaluating badges:", err);
        return { awarded: false };
    }
}

module.exports = evaluateConditionBadges;