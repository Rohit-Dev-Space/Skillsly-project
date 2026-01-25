const SkillCategories = require('../Models/SkillCategories');
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

        return res.status(200).json({ data: skillsFound });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

module.exports = { getSkillCategories, searchSkill, getRanking, getReccomendedSkills };