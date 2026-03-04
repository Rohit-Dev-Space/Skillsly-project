const GroupMessages = require('../Models/GroupMessages');
const Notification = require('../Models/Notifications');
const UserRatings = require('../Models/UserRatings');
const evaluateSkillBadge = require('../Services/evaluateSkillBadges')
const evaluateConditionBadges = require('../Services/evaluateConditionBadges')
const crypto = require("crypto")

const sendSessionRequest = async (req, res) => {
    try {
        const sessionToken = crypto.randomBytes(24).toString("hex");
        const senderId = req.user._id;
        const { groupId, date, time, skillWantToLearn } = req.body;
        const messages = await GroupMessages.create({
            groupId: groupId,
            senderId: senderId,
            date: date,
            time: time,
            skillWantToLearn: skillWantToLearn,
            type: "session_request",
            isRead: false,
            sessionToken: sessionToken
        });
        res.status(201).json({ data: messages });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
};

const getMessagesByGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const GroupMessagess = await GroupMessages.find({ groupId })
            .populate("senderId recevierId reviewerId")
            .sort({ createdAt: 1 });
        res.status(200).json({ data: GroupMessagess });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const deleteSessionRequest = async (req, res) => {
    try {
        const { sessionRequestId } = req.params;
        const deletedGroupMessages = await GroupMessages.findByIdAndDelete(sessionRequestId);
        if (!deletedGroupMessages) {
            return res.status(404).json({ message: "Session Request not found" });
        }
        res.status(200).json({ message: "Session Request deleted successfully", data: deletedGroupMessages });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const createJoinSession = async (req, res) => {
    try {
        const recevierId = req.user._id;
        const sessionRequestId = req.params.sessionRequestId;
        const { groupId, senderId, date, time } = req.body;
        const sessionToken = crypto.randomBytes(24).toString("hex");
        const roomId = `skill-session-${Date.now()}`

        if (!sessionRequestId) {
            return res.status(400).json({ message: "Session Request ID is required" });
        }

        const response = await GroupMessages.findById(sessionRequestId)

        if (!response) {
            return res.status(404).json({ message: "Session request no longer exists" });
        }

        const checkIsSession = await GroupMessages.findOne({
            groupId: groupId,
            type: "session_created",
            status: { $in: ["upcoming", "active"] }
        });

        if (checkIsSession) {
            return res.status(409).json({ message: 'Cannnot create a session if already one Exists' })
        } else {
            const createSession = await GroupMessages.create({
                groupId: groupId,
                senderId: senderId,
                recevierId: recevierId,
                skillWantToLearn: response.skillWantToLearn,
                date: date,
                time: time,
                type: "session_created",
                isRead: false,
                isReviewed: false,
                sessionToken: sessionToken,
                roomId: roomId,
            })

            const deleteRequest = await GroupMessages.findByIdAndDelete(sessionRequestId);

            if (createSession && deleteRequest) {
                res.status(201).json({ data: createSession });
            } else {
                res.status(400).json({ message: "Failed to create session" });
            }
        }
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const createReviewMessage = async (req, res) => {
    try {
        const { groupId, sessionToken } = req.body
        const sessionTokenGenerate = crypto.randomBytes(24).toString("hex");
        const info = await GroupMessages.findOne({ sessionToken: sessionToken });
        const checkIsReviewed = await GroupMessages.findOne({ reviewId: info._id, type: 'review' })
        if (checkIsReviewed) {
            return res.status(200).json({ message: 'Review already completed' })
        } else {
            const response = await GroupMessages.create({
                groupId: groupId,
                reviewId: info._id,
                sessionToken: sessionTokenGenerate,
                reviewerId: info.senderId,
                reviewedId: info.recevierId,
                skillWantToLearn: info.skillWantToLearn,
                type: 'review'
            })
            return res.status(200).json({ message: "Review created", data: response })
        }
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const getJoinSessionsByGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const joinSessions = await GroupMessages.find({ groupId: groupId, type: "session_created" }).populate('senderId', 'userName');
        res.status(200).json({ data: joinSessions });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const checkIsReviewed = async (req, res) => {
    try {
        const { sessionId, groupId } = req.params;
        const response = await GroupMessages.findOne({
            _id: sessionId,
            groupId: groupId,
        }).populate('recevierId', 'userName _id');
        res.status(200).json({ data: response });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const sendReview = async (req, res) => {
    try {
        console.log("➡️ sendReview HIT");
        console.log("BODY:", req.body);
        console.log("USER:", req.user?._id);
        const { mentorId, rating, skillWantToLearn, reviewId } = req.body;
        const id = req.user._id;

        if (!mentorId || !rating || !skillWantToLearn || !reviewId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const userRating = await UserRatings.findOneAndUpdate(
            { UserId: mentorId, skill: skillWantToLearn },
            {
                $push: { rating: rating },
                $inc: { totalReviews: 1 }
            },
            { new: true, upsert: true }
        );

        await GroupMessages.findByIdAndUpdate(
            reviewId,
            { isReviewed: true, rating },
            { new: true }
        );

        const badgeResult = await evaluateSkillBadge(mentorId, skillWantToLearn);

        if (badgeResult && badgeResult.awarded) {
            await Notification.create({
                userId: mentorId,
                type: "System",
                title: `🎉 Congratulations! You earned the ${badgeResult.badgeName} badge in ${badgeResult.skill}.`
            });
        }
        console.log("BADGE RESULT:", badgeResult);

        console.log("✅ Evaluating condition badge");
        const badgeResult2 = await evaluateConditionBadges(id);

        if (badgeResult2 && badgeResult2.awarded) {
            await Notification.create({
                userId: id,
                type: "System",
                title: `🎉 Congratulations! You earned the ${badgeResult2.badgeName} badge.`
            });
        }
        console.log("CONDITION BADGE RESULT:", badgeResult2);
        return res.status(200).json({ message: "Review submitted successfully" });

    } catch (err) {
        console.error("🔥 SEND REVIEW ERROR 🔥");
        console.error(err);
        return res.status(500).json({
            message: err.message,
            stack: err.stack
        });
    }
};

const verifySession = async (req, res) => {
    const { sessionToken } = req.params;

    const session = await GroupMessages.findOne({ sessionToken: sessionToken })
        .populate("recevierId", "userName _id")
        .populate("senderId", "userName _id");

    if (!session) {
        return res.status(403).json({ message: "Invalid session" });
    }

    res.json({ data: session });
};

const updateStatus = async (req, res) => {
    try {
        const { token } = req.params;
        const { status } = req.body;

        const response = await GroupMessages.findOneAndUpdate({ sessionToken: token }, { status: status }, { new: true })
        if (!response) {
            return res.status(400).json({ message: "Something Went Wrong in Updating Status" });
        }

        return res.status(200).json({ message: "Updating Status Succesfull", data: response });

    } catch (err) {
        return res.status(403).json({ message: "Invalid session" });
    }
}

const deleteJoinSession = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await GroupMessages.findOneAndDelete({ _id: id })
        if (response) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json({ message: 'Could Not delete Session' });
        }

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

module.exports = { sendSessionRequest, getMessagesByGroup, deleteSessionRequest, createJoinSession, getJoinSessionsByGroup, checkIsReviewed, sendReview, verifySession, updateStatus, createReviewMessage, deleteJoinSession };