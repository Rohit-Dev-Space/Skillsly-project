const SkillCategories = require('../Models/SkillCategories');
const Notification = require('../Models/Notifications');
const User = require('../Models/Users');

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
        let { category } = req.query;

        if (!category) {
            return res.status(500).json({ message: "Category not recevied", error: err.message })
        }

        const normalize = category
            .replace(/-/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        const regex = new RegExp(
            `^${normalize.split(' ').join('[\\s&]*')}$`,
            'i'
        );

        const response = await User.find({
            skillsKnow: { $elemMatch: { $regex: regex } }
        }).sort({ rating: -1, reviewsCount: -1 });

        return res.status(200).json(response);

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
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
        const { reciverId, title, type } = req.body;
        let isSent = false;
        if (!reciverId) {
            return res.status(400).json("User does not Exist");
        }
        const checkForSameNotification = await Notification.findOne({
            senderId: req.user._id,
            userId: reciverId,
            title: title
        })

        if (checkForSameNotification) {
            return res.status(409).json({
                message: "Notification already sent",
                isSent: true
            });
        }

        const response = await Notification.create({
            userId: reciverId,
            senderId: req.user._id,
            type: type,
            title: title,
            isRead: false
        })

        return res.status(200).json({ messagae: "Notification Sent", response, isSent: false })

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ userId })
            .populate("senderId", "userName profileImageUrl")
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



module.exports = { getSkillCategories, searchSkill, getRanking, getReccomendedSkills, SendNotification, getNotifications, deleteNotification, markAllNotificationsRead };