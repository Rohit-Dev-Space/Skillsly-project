const GroupMessages = require('../Models/GroupMessages');
const Groups = require('../Models/Groups');
const crypto = require("crypto")
const evaluateConditionBadge = require("../Services/evaluateConditionBadges");
const Notification = require('../Models/Notifications');


const createGroup = async (req, res) => {
    try {
        const { title, memberOne, memberTwo, memberOneSkill, memberTwoSkill, createdBy } = req.body;

        const groupExists = await Groups.findOne({
            $or: [
                {
                    memberOne: memberOne,
                    memberTwo: memberTwo,
                    memberOneSkill: memberOneSkill,
                    memberTwoSkill: memberTwoSkill
                },
                {
                    memberOne: memberTwo,
                    memberTwo: memberOne,
                    memberOneSkill: memberTwoSkill,
                    memberTwoSkill: memberOneSkill
                }
            ]
        })

        if (groupExists) {
            return res.status(400).json({ message: "Group already exists between these members with the same skills." });
        }

        const newGroup = await Groups.create({
            title: title,
            groupMembers: [memberOne, memberTwo],
            memberOne: memberOne,
            memberTwo: memberTwo,
            memberOneSkill: memberOneSkill,
            memberTwoSkill: memberTwoSkill,
            createdBy: createdBy
        });

        const result = await evaluateConditionBadge(createdBy, "GROUPS_CREATED");
        if (result.awarded) {
            await Notification.create({
                userId: createdBy,
                type: "System",
                title: `🎉 Congratulations! You earned the ${result.badgeName} badge. Check your profile to view all badges.`
            });
        }

        res.status(201).json({ message: "Group created successfully", group: newGroup });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const getGroups = async (req, res) => {
    try {
        const userId = req.user._id;
        const response = await Groups.find({ groupMembers: userId }).populate('createdBy', 'userName');
        return res.status(200).json({ data: response });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const getOneGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await Groups.findById(id);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        return res.status(200).json({ data: group });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const editTitle = async (req, res) => {
    const { title, id } = req.body;
    const userId = req.user._id;

    const group = await Groups.findById(id);
    if (group.createdBy.toString() === userId.toString()) {
        group.title = title;
        await group.save();
        return res.status(200).json({ message: 'Changed the title successfully' });
    }
}

const leaveGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const removeMember = await Groups.findByIdAndUpdate(
            id,
            { $pull: { groupMembers: req.user._id } },
            { new: true }
        );

        if (removeMember) {
            const now = new Date();
            const sessionToken = crypto.randomBytes(24).toString("hex");
            const response = await GroupMessages.create({
                sessionToken: sessionToken,
                groupId: id,
                type: 'system',
                text: `${req.user.userName} Left the group on ${now}`
            })
            if (response) {
                return res.status(200).json({ message: "Left group successfully" });
            }
        }

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

const deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await Groups.findById(id);
        if (group.groupMembers.length < 2) {
            await Groups.findByIdAndDelete(id);
            return res.status(200).json({ message: 'Group deleted successfully' });
        }
        return res.status(403).json({ message: 'You are not authorized to delete this group' });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

module.exports = { createGroup, getGroups, editTitle, deleteGroup, getOneGroup, leaveGroup };