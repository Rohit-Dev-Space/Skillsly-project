const Groups = require('../Models/Groups');

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
            memberOne: memberOne,
            memberTwo: memberTwo,
            memberOneSkill: memberOneSkill,
            memberTwoSkill: memberTwoSkill,
            createdBy: createdBy
        });

        res.status(201).json({ message: "Group created successfully", group: newGroup });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const getGroups = async (req, res) => {
    try {
        const userId = req.user._id;
        const response = await Groups.find({ $or: [{ memberOne: userId }, { memberTwo: userId }] }).populate('createdBy', 'userName');
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

const deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await Groups.findById(id);
        if (group.createdBy.toString() === req.user._id.toString()) {
            await Groups.findByIdAndDelete(id);
            return res.status(200).json({ message: 'Group deleted successfully' });
        }
        return res.status(403).json({ message: 'You are not authorized to delete this group' });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

module.exports = { createGroup, getGroups, editTitle, deleteGroup, getOneGroup };