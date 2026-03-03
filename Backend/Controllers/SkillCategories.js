const SkillCategories = require('../Models/SkillCategories');
const Notification = require('../Models/Notifications');
const User = require('../Models/Users');
const UserRatings = require('../Models/UserRatings')

const getSkillCategories = async (req, res) => {
    try {
        const response = await SkillCategories.find();
        if (!response) {
            return res.status(400).json({ message: "Could not fetch Skill categories" });
        }
        return res.json({ data: response })
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
}

const searchSkill = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === '') {
            return res.status(200).json({ data: [] });
        }

        const skills = await SkillCategories.find({
            title: {
                $regex: q,
                $options: 'i'
            }
        });

        return res.status(200).json({ data: skills });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err.message
        });
    }
};

const getRanking = async (req, res) => {
    try {
        const { categoryId } = req.query;

        if (!categoryId) {
            return res.status(400).json({ message: "categoryId is required" });
        }

        // 1️⃣ Find category
        const category = await SkillCategories.findById(categoryId).select("title");
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const categoryTitle = category.title;

        // 2️⃣ Find users who KNOW this skill
        const users = await User.find({
            skillsKnow: {
                $regex: `^\\s*${categoryTitle}\\s*$`,
                $options: "i"
            }
        }).select("-password -googleId -__v");

        // 3️⃣ Build ranking data
        const rankingData = await Promise.all(
            users.map(async (user) => {
                const userRating = await UserRatings.findOne({
                    UserId: user._id,
                    skill: {
                        $regex: `^\\s*${categoryTitle}\\s*$`,
                        $options: "i"
                    }
                }).select("rating");

                const ratingsArray = userRating?.rating || [];
                const totalReviews = ratingsArray.length;

                const avgRating =
                    totalReviews > 0
                        ? Number(
                            (
                                ratingsArray.reduce((a, b) => a + b, 0) / totalReviews
                            ).toFixed(2)
                        )
                        : 0;

                return {
                    user, // full user data (safe)
                    ratingStats: {
                        avgRating,
                        totalReviews
                    }
                };
            })
        );

        // 4️⃣ Sort leaderboard
        rankingData.sort(
            (a, b) =>
                b.ratingStats.avgRating - a.ratingStats.avgRating ||
                b.ratingStats.totalReviews - a.ratingStats.totalReviews
        );

        return res.status(200).json({
            category: categoryTitle,
            rankingData
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const skillList = async (req, res) => {
    try {
        const response = await SkillCategories.find().select("title")
        if (Array.isArray(response)) {
            return res.status(200).json(response);
        }
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });

    }
}

const getReccomendedSkills = async (req, res) => {
    try {
        const { skills } = req.body;

        if (!skills || skills.length === 0) {
            return res.status(200).json({
                data: ['sorry Nothing found'],
                message: "No skills provided"
            });
        }

        const skillsFound = await SkillCategories.find({
            title: { $in: skills }
        });

        return res.status(201).json({ data: skillsFound });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const SendNotification = async (req, res) => {
    try {
        const { reciverId, type, skillOffering, category } = req.body;
        let isSent = false;
        if (!reciverId) {
            return res.status(400).json("User does not Exist");
        }
        const checkForSameNotification = await Notification.findOne({
            senderId: req.user._id,
            userId: reciverId,
            skillOffering: skillOffering,
            title: `sent Request To Learn ${category} in Exchange To Teach ${skillOffering}`,
        })

        if (checkForSameNotification) {
            return res.status(200).json({
                message: "Notification already sent",
                isSent: true
            });
        }

        const response = await Notification.create({
            userId: reciverId,
            senderId: req.user._id,
            category: category,
            skillOffering: skillOffering,
            type: type,
            title: `sent Request To Learn ${category} in Exchange To Teach ${skillOffering}`,
            isRead: false
        })

        return res.status(200).json({ messagae: "Notification Sent", response, isSent: false })

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const sendRequestNotifictaion = async (req, res) => {
    try {
        const { requestedSkill } = req.body;
        const userId = req.user._id;

        const response = await Notification.create({
            userId: userId,
            type: "User_request",
            requestedSkill: requestedSkill,
            title: `Requested Skill: ${requestedSkill}`,
        })
        return res.status(200).json({ messagae: "Notification Sent", response })
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ userId, type: { $ne: "User_request" } })
            .populate("senderId", "userName profileImageUrl _id")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            data: notifications
        });

    } catch (err) {
        console.error("Get Notifications Error:", err);
        res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.body

        const response = await Notification.findOneAndDelete({ _id: id })
        if (response) {
            return res.status(200).json({ messagae: 'Notification Deleted' })
        } else {
            return res.status(400).json({ messagae: 'Notification not Deleted' })
        }
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const markAllNotificationsRead = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.updateMany(
            { userId, isRead: false },
            { $set: { isRead: true } }
        );

        return res.status(200).json({ message: "All notifications marked as read" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};



module.exports = { getSkillCategories, searchSkill, getRanking, getReccomendedSkills, SendNotification, getNotifications, deleteNotification, markAllNotificationsRead, sendRequestNotifictaion, skillList };