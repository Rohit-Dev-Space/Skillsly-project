const ReportedUser = require('../Models/ReportedUser')
const Notification = require('../Models/Notifications')

const reportUser = async (req, res) => {
    try {
        const { reportedId, userId, reporterName, reason } = req.body

        const user = await ReportedUser.create({
            reportedId: reportedId,
            reporterId: userId,
            reports: reason,
            reportedDateTime: Date()
        });

        const createNotification = await Notification.create({
            userId: reportedId,
            senderId: userId,
            type: "Reported",
            title: `${reporterName} has Reported You for ${reason}. Please do not repeat The mistake or there will be Consequences`
        })

        if (!user) {
            res.status(400).json({ message: "Something went wrong while updating report", error: err.message })
        } else {
            res.status(200).json({ message: "Reported Succesfully", data: user })
        }
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }

}

const isAlreadyReported = async (req, res) => {
    try {
        const { reportedId, userId } = req.body;
        const exist = false;

        const response = await ReportedUser.findOne({ reportedId: reportedId, reporterId: userId })
        if (response) {
            return res.status(200).json({ message: 'Already Exists', exist: true })
        } else {
            return res.status(200).json({ message: 'Already Exists', exist: false })
        }
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

module.exports = { reportUser, isAlreadyReported }