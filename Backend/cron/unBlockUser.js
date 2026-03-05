const cron = require('node-cron');
const User = require('../Models/Users');

// Run every hour
module.exports = () => {
    cron.schedule('0 * * * *', async () => {
        try {
            const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

            const result = await User.updateMany(
                { isBlocked: true, blockedAt: { $lte: twoDaysAgo } },
                { $set: { isBlocked: false, blockedAt: null } }
            );

            if (result.modifiedCount > 0) {
                console.log(`✅ Unblocked ${result.modifiedCount} users automatically`);
            }
        } catch (err) {
            console.error('❌ Error unblocking users:', err);
        }
    });
}