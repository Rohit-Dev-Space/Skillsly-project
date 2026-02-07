const User = require('../Models/Users');
const Badges = require('../Models/Badges')
const UserRatings = require('../Models/UserRatings')
const ReportedUser = require('../Models/ReportedUser')
const Notification = require('../Models/Notifications')

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

        const response = await User.countDocuments({
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

const newlyRegisteredNumber = async (req, res) => {
    try {
        const now = new Date();
        const oneWeek = new Date();
        oneWeek.setDate(now.getDate() - 7);

        const response = await User.countDocuments({
            createdAt: {
                $gte: oneWeek,
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
                $addFields: {
                    weekIndex: {
                        $ceil: {
                            $divide: [
                                { $subtract: ["$createdAt", fiveWeeksAgo] },
                                1000 * 60 * 60 * 24 * 7
                            ]
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$weekIndex",
                    users: { $sum: 1 }
                }
            },
            {
                $project: {
                    week: { $concat: ["W", { $toString: "$_id" }] },
                    users: 1,
                    _id: 0
                }
            },
            { $sort: { week: 1 } }
        ]);

        return res.status(200).json(data);

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};


const getReportedUsers = async (req, res) => {
    try {
        const reportedUsers = await ReportedUser.find({ isRead: false }).populate('reportedId', 'userName profileImgUrl name BlockCount')

        return res.status(200).json(reportedUsers);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

const reportedReasonCount = async (req, res) => {
    try {
        const { id, reason } = req.body;
        const reportedUsersCount = await ReportedUser.countDocuments({ reportedId: id, reports: reason })

        return res.status(200).json(reportedUsersCount);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

const getReportedUsersNumber = async (req, res) => {
    try {
        const now = new Date();
        const week = new Date();
        week.setDate(now.getDate() - 7);

        const reportedUsers = await ReportedUser.countDocuments({
            reportedDateTime: {
                $gte: now,
                $lte: week
            }
        });

        return res.status(200).json(reportedUsers);
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

const searchUser = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === "") {
            return res.status(200).json([]);
        }

        const response = await User.find({
            $or: [
                { userName: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } },
                { name: { $regex: q, $options: 'i' } }
            ]
        })

        return res.status(200).json(response)
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
}

const badgeEligibleUser = async (req, res) => {
    try {
        const badges = await Badges.find();

        const eligibleUsers = [];

        for (const badge of badges) {
            // Only skill-based badges
            if (!badge.skill) continue;

            const ratings = await UserRatings.aggregate([
                { $match: { skill: badge.skill } },
                { $unwind: "$rating" },
                {
                    $group: {
                        _id: "$UserId",
                        avgRating: { $avg: "$rating" },
                        reviewCount: { $sum: 1 }
                    }
                },
                {
                    $match: {
                        avgRating: { $gte: 8.5 },
                        reviewCount: { $gte: 10 }
                    }
                }
            ]);

            const userIds = ratings.map(r => r._id);

            const users = await User.find({ _id: { $in: userIds } })
                .select("userName name email skillsKnow");

            const userMap = new Map(users.map(u => [u._id.toString(), u]));

            for (const r of ratings) {
                if (
                    badge.approvedUsers.includes(r._id) ||
                    badge.pendingApproval.includes(r._id)
                ) continue;

                const user = userMap.get(r._id.toString());
                if (!user) continue;

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

        res.status(200).json(eligibleUsers);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};


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

const warnUser = async (req, res) => {
    try {
        const { reportId, userId } = req.body;
        const response = await ReportedUser.findByIdAndUpdate({ _id: reportId }, { isRead: true })
        const createNotification = await Notification.create({
            userId: userId,
            type: "System",
            title: `Your account has been reported multiple times for behavior that violates our community standards or else you could be temporarily Banned`
        })
        if (response && createNotification) {
            return res.status(200).json(createNotification)
        }
    } catch (err) {

    }
}

module.exports = { getNumberOfUser, getActiveUsersCount, newlyRegisteredNumber, getReportedUsersNumber, getPopularSkills, newlyRegistered, searchUser, getReportedUsers, reportedReasonCount, warnUser }


