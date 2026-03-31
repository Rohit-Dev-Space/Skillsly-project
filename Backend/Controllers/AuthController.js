const User = require('../Models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRatings = require('../Models/UserRatings');
const evaluateConditionBadge = require("../Services/evaluateConditionBadges");
const Notification = require('../Models/Notifications');

const assignJWT = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_PASS, { expiresIn: '7d' });
}

const RegisterUserInitial = async (req, res) => {
    try {
        const { name, userName, email, password, profileImageUrl } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name, userName, email, password: hashedPassword, profileImageUrl, lastActive: Date.now()
        });

        const token = assignJWT(newUser._id);
        res.status(201).json({ user: newUser, token });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

const RegisterUserFinal = async (req, res) => {
    try {
        const { email, skillsKnow, skillsWantToKnow, socialLink, bio, languages, workImageUrl } = req.body;

        const updatedUser = await User.findOneAndUpdate({ email }, {
            skillsKnow, skillsWantToKnow, socialLink, bio, languages, workImageUrl
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const userId = updatedUser._id;

        // Create Ratings
        if (skillsKnow && skillsKnow.length > 0) {
            for (let skill of skillsKnow) {
                await UserRatings.create({ userId, skill });
            }
        }

        // Badge Logic - Wrapped in try/catch to NEVER cause a 500
        try {
            const badgeResult = await evaluateConditionBadge(userId, "SKILLS_KNOWN");
            if (badgeResult && badgeResult.awarded) {
                await Notification.create({
                    userId: userId, 
                    type: "System",
                    title: `🎉 Congratulations! You earned the ${badgeResult.badgeName} badge.`
                });
            }
        } catch (badgeErr) {
            console.log("Badge logic skipped due to internal error");
        }

        return res.status(201).json({ user: updatedUser });

    } catch (err) {
        console.error("Final registration error:", err);
        return res.status(500).json({ message: "Registration failed", error: err.message });
    }
}

const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                user.lastActive = Date.now();
                await user.save();
                const token = assignJWT(user._id);
                return res.status(200).json({ user, token });
            }
        }
        return res.status(400).json({ message: "Invalid credentials" });
    } catch (err) {
        res.status(500).json({ message: "Login Error" });
    }
}

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Profile Error" });
    }
}

module.exports = { RegisterUserInitial, RegisterUserFinal, LoginUser, getUserProfile };