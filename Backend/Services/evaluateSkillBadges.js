const ApprovedBadgeUser = require('../Models/ApprovedBadgeUser')
const Badges = require('../Models/Badges')
const UserRatings = require('../Models/UserRatings')

async function evaluateSkillBadge(userId, skill) {
    const normalizedSkill = skill.toLowerCase();

    const ratingDoc = await UserRatings.findOne({
        UserId: userId,
        skill: { $regex: new RegExp(`^${normalizedSkill}$`, "i") }
    });

    if (!ratingDoc) return { awarded: false };

    const validRatings = ratingDoc.rating.filter(r => r > 0);
    const reviewCount = validRatings.length;

    if (reviewCount === 0) return { awarded: false };

    const avgRating =
        validRatings.reduce((a, b) => a + b, 0) / reviewCount;

    let newLevel = null;

    if (avgRating >= 9 && reviewCount >= 20) newLevel = "Guru";
    else if (avgRating >= 8 && reviewCount >= 10) newLevel = "Efficiency II";
    else if (avgRating >= 7 && reviewCount >= 5) newLevel = "Efficiency III";

    if (!newLevel) return { awarded: false };

    const badge = await Badges.findOne({
        skill: { $regex: new RegExp(`^${normalizedSkill}$`, "i") }
    });

    if (!badge) return { awarded: false };

    const existing = await ApprovedBadgeUser.findOne({
        userId,
        badgeId: badge._id
    }).sort({ awardedAt: -1 });

    const levelRank = {
        "Efficiency III": 1,
        "Efficiency II": 2,
        "Guru": 3
    };

    if (existing && levelRank[existing.level] >= levelRank[newLevel]) {
        return { awarded: false };
    }

    await ApprovedBadgeUser.create({
        userId,
        badgeId: badge._id,
        level: newLevel
    });

    return {
        awarded: true,
        badgeName: newLevel,
        skill: badge.skill
    };
}

module.exports = evaluateSkillBadge;
