const Conversation = require('../Models/Conversation');
const Message = require('../Models/Message');
const Notification = require('../Models/Notifications');
const User = require('../Models/Users');
const evaluateConditionBadge = require("../Services/evaluateConditionBadges");

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

const getUserInfo = async (req, res) => {
    try {
        const { userId } = req.body;

        const response = await User.findOne({ _id: userId })
        if (response) {
            return res.status(200).json(response)
        }
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
}

const getConversation = async (req, res) => {
    try {
        const id = req.user._id;

        const response = await Conversation.find({
            participants: id
        })
            .populate('lastMessage')
            .populate("participants", "userName profileImgUrl lastSeen")
            .sort({ updatedAt: -1 });

        if (response) {
            res.status(200).json(response);
        }

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const markMessagesAsRead = async (req, res) => {
    try {
        const { user2 } = req.body;
        const user1 = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [user1, user2] }
        });

        if (!conversation) return res.status(200).json({});

        await Message.updateMany(
            {
                conversationId: conversation._id,
                readBy: { $ne: user1 }
            },
            {
                $addToSet: { readBy: user1 }
            }
        );

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const sendMessage = async (req, res) => {
    try {
        const { text, receiverId } = req.body;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const message = await Message.create({
            conversationId: conversation._id,
            senderId,
            text,
            readBy: [senderId]
        });

        const result = await evaluateConditionBadge(senderId, "SOCIAL_BUTTERFLY");

        if (result.awarded) {
            await Notification.create({
                userId: senderId,
                type: "System",
                title: `🎉 Congratulations! You earned the ${result.title} badge. Check your profile to view all badges.`
            });
        }

        await Conversation.findByIdAndUpdate(conversation._id, {
            lastMessage: message._id
        });

        const populated = await Message.findById(message._id)
            .populate("senderId", "userName profileImageUrl");

        res.status(201).json({
            _id: populated._id,
            text: populated.text,
            senderId: populated.senderId,
            conversationId: conversation._id,
            receiverId,
            isMe: true,
            time: new Date(populated.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            }),
            createdAt: populated.createdAt,
            readBy: populated.readBy
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const getMessages = async (req, res) => {
    try {
        const { user2 } = req.body;
        const user1 = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [user1, user2] }
        });

        if (!conversation) {
            return res.status(200).json([]);
        }

        const messages = await Message.find({
            conversationId: conversation._id
        })
            .populate("senderId", "userName profileImageUrl")
            .sort({ createdAt: 1 });

        const formatted = messages.map(msg => ({
            _id: msg._id,
            text: msg.text,
            senderId: msg.senderId,
            isMe: msg.senderId._id.toString() === user1.toString(),
            time: new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            }),
            createdAt: msg.createdAt,
            readBy: msg.readBy
        }));

        res.status(200).json(formatted);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = { searchUser, getUserInfo, sendMessage, getMessages, getConversation, markMessagesAsRead };

