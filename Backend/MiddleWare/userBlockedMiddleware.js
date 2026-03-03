const User = require('../Models/Users')

const isBlockMiddleware = async (req, res, next) => {
    if (!req.user) return next();

    const user = await User.findById(req.user.id);

    if (user.isBlocked && user.blockedAt) {
        const hours48 = 48 * 60 * 60 * 1000;
        const unblockAt = new Date(user.blockedAt.getTime() + hours48);

        return res.status(403).json({
            blocked: true,
            blockedAt: user.blockedAt,
            blockReason: user.blockReason,
            unblockAt
        });
    }

    next();
};

module.exports = isBlockMiddleware;
