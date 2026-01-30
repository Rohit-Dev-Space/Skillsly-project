const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../Models/Users");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const assignJWT = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_PASS, {
        expiresIn: "7d",
    });
};

const googleLoginOnly = async (req, res) => {
    try {
        const { credential } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, sub } = payload;

        const user = await User.findOneAndUpdate({ email }, { lastActive: Date.now() });

        // 🚫 No auto signup
        if (!user) {
            return res.status(403).json({
                message: "No account found. Please sign up manually first.",
            });
        }

        // 🚫 Not linked to Google
        if (!user.googleId) {
            user.googleId = sub; // Google's unique user ID
            await user.save();
        }

        const token = assignJWT(user._id);

        res.status(200).json({ user, token });

    } catch (err) {
        res.status(401).json({
            message: "Google login failed",
            error: err.message,
        });
    }
};

module.exports = { googleLoginOnly };
