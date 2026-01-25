const User = require('../Models/Users');
const Badges = require('../Models/Badges')
const UserRatings = require('../Models/UserRatings')

const getNumberOfUser = async (req, res) => {
    try {
        const response = await User.countDocuments()
        return res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const getActiveUsersCount = async (req, res) => {
    try {
        const now = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);

        const response = await User.find({
            lastActive: {
                $gte: oneWeekAgo,
                $lte: now
            }
        })

        return res.status(200).json(response)

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const newlyRegistered = async (req, res) => {
    try {
        const now = new Date();

        const fiveWeeksAgo = new Date();
        fiveWeeksAgo.setDate(now.getDate() - 35);

        const data = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: fiveWeeksAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $ceil: {
                            $divide: [
                                { $subtract: [now, "$createdAt"] },
                                1000 * 60 * 60 * 24 * 7
                            ]
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    week: "$_id",
                    count: 1,
                    _id: 0
                }
            },
            {
                $sort: { week: 1 }
            }
        ]);

        return res.status(200).json(data);

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

const getReportedUsers = async (req, res) => {
    try {
        const reportedUsers = await User.find({
            reportedCount: { $gte: 1 }
        }).select("userName email reportedCount reports isBlocked");

        const count = reportedUsers.length;

        return res.status(200).json({
            reportedUsers,
            count
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

const BlockUser = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isBlocked = true;
        user.blockedAt = new Date.now();
        user.BlockCount = user.BlockCount + 1;

        await user.save();

        return res.status(200).json({
            message: "User blocked for 48 hours",
            blockedUntil: new Date(user.blockedAt.getTime() + 48 * 60 * 60 * 1000)
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

const getPopularSkills = async (req, res) => {
    try {
        const topSkillsKnow = await User.aggregate([
            { $unwind: "$skillsKnow" },
            { $group: { _id: "$skillsKnow", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const topSkillsWant = await User.aggregate([
            { $unwind: "$skillsWantToKnow" },
            { $group: { _id: "$skillsWantToKnow", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const skillMap = {};

        topSkillsKnow.forEach(item => {
            skillMap[item._id] = {
                skill: item._id,
                know: item.count,
                want: 0
            };
        });

        topSkillsWant.forEach(item => {
            if (skillMap[item._id]) {
                skillMap[item._id].want = item.count;
            } else {
                skillMap[item._id] = {
                    skill: item._id,
                    know: 0,
                    want: item.count
                };
            }
        });

        res.status(200).json(chartData = Object.values(skillMap));

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

const getAllUser = async (req, res) => {
    try {
        const response = await User.find()
            .select("name userName profileImageUrl")
            .limit(20)
            .sort({ createdAt: -1 });;
        if (!response) {
            return res.status(400).json({ message: "Could not fetch Users" });
        }
        return res.status(200).json(response)
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
}

const searchUser = async (req, res) => {
    try {
        const { q } = req.query;

        const response = await User.find({
            $or: [
                { userName: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } },
                { name: { $regex: q, $options: 'i' } }
            ]
        }).select("name userName profileImageUrl")

        return res.status(200).json(response)
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
}

const badgeEligibleUser = async (req, res) => {
    try {
        // Fetch all badges
        const badges = await Badges.find();

        // Prepare result
        const eligibleUsers = [];

        for (const badge of badges) {
            // Find ratings for this skill
            const ratings = await UserRatings.aggregate([
                { $match: { skill: badge.skill } },
                {
                    $group: {
                        _id: "$reviewedUserId",
                        avgRating: { $avg: "$rating" },
                        reviewCount: { $sum: 1 }
                    }
                },
                { $match: { avgRating: { $gte: 8.5 }, reviewCount: { $gte: 10 } } }
            ]);

            for (const r of ratings) {
                // Check if user is already approved or pending
                if (
                    !badge.approvedUsers.includes(r._id) &&
                    !badge.pendingApproval.includes(r._id)
                ) {
                    const user = await User.findById(r._id).select("userName name email skillsKnow");
                    eligibleUsers.push({
                        badgeId: badge._id,
                        badgeTitle: badge.title,
                        badgeSkill: badge.skill,
                        userId: r._id,
                        userName: user.userName,
                        name: user.name,
                        avgRating: r.avgRating.toFixed(2),
                        reviewCount: r.reviewCount
                    });
                }
            }
        }

        return res.status(200).json(eligibleUsers);

    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
}

const setBadgeForUser = async (req, res) => {
    try {
        const { badgeId, userId } = req.body;

        const badge = await Badges.findById(badgeId);
        if (!badge) return res.status(404).json({ message: "Badge not found" });

        // Avoid duplicates
        if (!badge.approvedUsers.includes(userId)) {
            badge.approvedUsers.push(userId);
        }

        // Remove from pendingApproval if exists
        badge.pendingApproval = badge.pendingApproval.filter(id => id.toString() !== userId);

        await badge.save();

        return res.status(200).json({ message: "Badge approved for user", badge });

    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
}


