const User = require('../Models/Users')

const isBlockMiddleware = async (req, res, next) => {
    if (!req.user) return next();

    const user = await User.findById(req.user.id);

    if (user.isBlocked && user.blockedAt) {
        const now = new Date();
        const diff = now - user.blockedAt;
        const hours48 = 48 * 60 * 60 * 1000;

        if (diff >= hours48) {
            user.isBlocked = false;
            user.blockedAt = null;
            user.blockReason = null;
            await user.save();
        }
    }

    if (user.isBlocked) {
        return res.status(403).json({
            message: "Account temporarily blocked",
            unblockAt: new Date(user.blockedAt.getTime() + 48 * 60 * 60 * 1000)
        });
    }

    next();
};

module.exports = isBlockMiddleware;
