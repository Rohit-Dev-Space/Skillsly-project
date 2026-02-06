const express = require('express');
const User = require('../Models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRatings = require('../Models/UserRatings');

const assignJWT = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_PASS, { expiresIn: '7d' });
}

const RegisterUserInitial = async (req, res) => {
    try {
        const { name, userName, email, password, profileImageUrl } = req.body;

        const existingUser = await User.findOne({ email: email })
        const existingUserName = await User.findOne({ userName: userName })

        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        if (existingUserName) {
            return res.status(400).json({ message: "User Name already taken 🥲" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            name,
            userName,
            email,
            password: hashedPassword,
            profileImageUrl,
            lastActive: Date.now()
        })

        const token = assignJWT(newUser._id);
        res.status(201).json({ user: newUser, token });

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const RegisterUserFinal = async (req, res) => {
    try {
        const { email, skillsKnow, skillsWantToKnow, socialLink, bio, languages, workImageUrl } = req.body;
        const newUserInfo = await User.findOneAndUpdate({ email: email }, {
            skillsKnow: skillsKnow,
            skillsWantToKnow: skillsWantToKnow,
            socialLink: socialLink,
            bio: bio,
            languages: languages,
            workImageUrl: workImageUrl
        }, { new: true })

        const findUser = await User.findOne({ email: email }).select('_id');

        for (let skill of skillsKnow) {
            const createSkillRatings = await UserRatings.create({
                userId: findUser,
                skill: skill
            })
        }

        if (!newUserInfo) {
            return res.status(400).json({ message: "User not found with this email" });
        }

        res.status(201).json({ user: newUserInfo });

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}


const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userExisting = await User.findOne({ email: email })

        if (userExisting) {
            const isMatch = await bcrypt.compare(password, userExisting.password)
            if (isMatch) {
                userExisting.lastActive = Date.now();
                await userExisting.save();
                const token = assignJWT(userExisting._id);
                res.status(200).json({ user: userExisting, token });
            } else {
                return res.status(400).json({ message: "Invalid password" });
            }
        } else {
            return res.status(400).json({ message: "Invalid email" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")

        if (!user) {
            return res.json({ message: 'User does not exist' })
        }

        res.json(user)
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err })
    }
}

module.exports = { RegisterUserInitial, RegisterUserFinal, LoginUser, getUserProfile };