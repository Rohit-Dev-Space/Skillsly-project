const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const port = process.env.PORT || 5000;
const connectDB = require('./Config/connDB');

const authRoutes = require('./Routes/AuthRoutes');
const skillRoutes = require('./Routes/SkillCategories');
const NotesRoutes = require('./Routes/NotesRotes');
const adminRoutes = require('./Routes/AdminRoutes');
const GroupRoutes = require('./Routes/GroupRoutes');
const GroupMessagesRoute = require('./Routes/GroupMessagesRoute');
const ReportRoutes = require('./Routes/ReportRoute');
const ConversationRoutes = require('./Routes/ConversationRoute');
const EditRoutes = require('./Routes/EditRoutes')

app.use(
    cors({
        origin: ["https://skillsly.vercel.app", "http://localhost:5173"],
        methods: ['GET', 'PUT', 'DELETE', 'POST', 'PATCH'],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

connectDB();
app.use(express.json());

/* ---------------- SOCKET.IO SETUP ---------------- */

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "https://skillsly.vercel.app"
        ],
        methods: ["GET", "POST"]
    }
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("setup", (userId) => {
        onlineUsers.set(userId, socket.id);
        socket.join(userId);
    });

    socket.on("send-message", (message) => {
        io.to(message.receiverId).emit("receive-message", {
            ...message,
            isMe: false
        });

        io.to(message.receiverId).emit("conversation-updated", {
            conversationId: message.conversationId,
            lastMessage: message.text,
            senderId: message.senderId,
            time: message.time
        });

        io.to(message.senderId._id || message.senderId).emit("conversation-updated", {
            conversationId: message.conversationId,
            lastMessage: message.text,
            senderId: message.senderId,
            time: message.time
        });
    });

    socket.on("disconnect", () => {
        for (let [key, value] of onlineUsers.entries()) {
            if (value === socket.id) {
                onlineUsers.delete(key);
            }
        }
    });
});

/* 🔥 MAKE IO AVAILABLE IN CONTROLLERS */
app.use((req, res, next) => {
    req.io = io;
    next();
});

/* ---------------- ROUTES ---------------- */

app.use('/api/auth', authRoutes);
app.use('/skills', skillRoutes);
app.use('/Notes', NotesRoutes);
app.use('/Admin', adminRoutes);
app.use('/groups', GroupRoutes);
app.use('/session-requests', GroupMessagesRoute);
app.use('/report', ReportRoutes);
app.use('/message', ConversationRoutes);
app.use('/edit', EditRoutes);


/* ---------------- START SERVER ---------------- */

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
