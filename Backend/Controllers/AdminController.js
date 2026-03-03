const User = require('../Models/Users');
const Badges = require('../Models/Badges')
const UserRatings = require('../Models/UserRatings')
const ReportedUser = require('../Models/ReportedUser')
const Notification = require('../Models/Notifications');
const SkillCategories = require('../Models/SkillCategories');
const AdminActions = require('../Models/AdminActions');
const ApprovedBadgeUser = require('../Models/ApprovedBadgeUser')
const mongoose = require('mongoose');


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

        const startOfWeek = new Date(now);
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(now.getDate() - now.getDay() + 1);

        const fiveWeeksAgo = new Date(startOfWeek);
        fiveWeeksAgo.setDate(startOfWeek.getDate() - 28);

        const data = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: fiveWeeksAgo }
                }
            },
            {
                $addFields: {
                    week: {
                        $floor: {
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
                    _id: "$week",
                    users: { $sum: 1 }
                }
            },
            {
                $project: {
                    weekIndex: "$_id",
                    users: 1,
                    _id: 0
                }
            },
            { $sort: { weekIndex: 1 } }
        ]);


        const result = Array.from({ length: 5 }, (_, i) => ({
            week: `Week ${i + 1}`,
            users: data.find(d => d.weekIndex === i)?.users || 0
        }));

        return res.status(200).json(result);

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
        const { reportId, userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const response = await ReportedUser.findByIdAndUpdate({ _id: reportId }, { isRead: true })

        user.isBlocked = true;
        user.blockedAt = new Date();
        user.BlockCount = user.BlockCount + 1;

        await user.save();

        return res.status(200).json({
            message: "User blocked for 48 hours",
            blockedUntil: new Date(user.blockedAt.getTime() + 48 * 60 * 60 * 1000),
            response
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

const terminateUser = async (req, res) => {
    try {
        const { userId } = req.body;

        const response = await User.findByIdAndDelete({ _id: userId })
        if (response) {
            return res.status(200).json(response)
        }

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

const createBadge = async (req, res) => {
    try {
        const payload = req.body;
        const { type } = payload;

        if (!type) {
            return res.status(400).json({ message: "Badge type is required" });
        }

        /* ---------- SKILL BADGE ---------- */
        if (type === "SKILL") {
            const { skill, description, levels } = payload;

            if (!skill || !Array.isArray(levels) || levels.length === 0) {
                return res.status(400).json({ message: "Invalid skill badge data" });
            }

            // sanitize payload
            const cleanPayload = {
                title: `${skill}`,
                type,
                skill,
                description,
                levels,
                iconUrl: '',
            };

            const badge = await Badges.create(cleanPayload);

            return res.status(201).json({
                message: "Skill badge created",
                badge
            });
        }

        if (type === "ACHIEVEMENT") {
            const { title, description, condition, count, iconUrl } = payload;

            if (!title || !condition || !count || !iconUrl) {
                return res.status(400).json({ message: "Invalid achievement badge data" });
            }

            const cleanPayload = {
                title,
                type,
                description,
                condition,
                count,
                iconUrl,
            };

            const badge = await Badges.create(cleanPayload);

            return res.status(201).json({
                message: "Achievement badge created",
                badge
            });
        }

        return res.status(400).json({ message: "Invalid badge type" });

    } catch (err) {
        console.error("CREATE BADGE ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const requestedSkill = async (req, res) => {
    try {
        const response = await Notification.find({
            type: 'User_request'
        }).populate('userId', 'userName profileImgUrl').sort({ createdAt: -1 });

        return res.status(200).json(response);

    } catch (err) {
        return res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
}

const addSkillCategory = async (req, res) => {
    try {
        const { title, iconBg, iconUrl } = req.body;

        const response = await SkillCategories.create({
            title: title,
            iconBg: iconBg,
            iconUrl: iconUrl
        })

        if (response) {
            return res.status(200).json(response);
        }

    } catch (err) {
        return res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
}

const registerAdminAction = async (req, res) => {
    try {
        const { reportedUser, action, reportedReason } = req.body;
        const date_time = new Date();
        const response = await AdminActions.create({
            reportedUser: reportedUser,
            action: action,
            reportedReason: reportedReason,
            date_time: date_time
        })
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
}

const getAdminAction = async (req, res) => {
    try {
        const response = await AdminActions.find().populate('reportedUser', 'userName profileImageUrl email').sort({ createdAt: -1 });
        return res.status(200).json(response)
    } catch (err) {
        return res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
}

const getReportsInformation = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "User id is required" });
        }

        const reportStats = await ReportedUser.aggregate([
            {
                $match: {
                    reportedId: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $group: {
                    _id: "$reports",
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalReports = reportStats.reduce(
            (sum, r) => sum + r.count,
            0
        );

        const reportsByReason = reportStats.map(r => ({
            reason: r._id,
            count: r.count
        }));

        return res.status(200).json({
            totalReports,
            reportsByReason
        });

    } catch (err) {
        return res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};

module.exports = { getNumberOfUser, getActiveUsersCount, newlyRegisteredNumber, getReportedUsersNumber, getPopularSkills, newlyRegistered, searchUser, getReportedUsers, reportedReasonCount, warnUser, BlockUser, terminateUser, requestedSkill, addSkillCategory, createBadge, registerAdminAction, getAdminAction, getReportsInformation }
