const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require('./Config/connDB');

const app = express();
const port = process.env.PORT || 5000;

// Routes
const authRoutes = require('./Routes/AuthRoutes');
const skillRoutes = require('./Routes/SkillCategories');
const NotesRoutes = require('./Routes/NotesRotes');
const adminRoutes = require('./Routes/AdminRoutes');
const GroupRoutes = require('./Routes/GroupRoutes');
const GroupMessagesRoute = require('./Routes/GroupMessagesRoute');
const ReportRoutes = require('./Routes/ReportRoute');
const ConversationRoutes = require('./Routes/ConversationRoute');
const EditRoutes = require('./Routes/EditRoutes');

// DATABASE
connectDB();

// CORS SETUP (Fixed for credentials error)
const allowedOrigins = ["https://skillsly.vercel.app", "http://localhost:5173"];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'PUT', 'DELETE', 'POST', 'PATCH'],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

// SOCKET.IO SETUP (Must have credentials: true)
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['polling', 'websocket']
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
    socket.on("setup", (userId) => {
        onlineUsers.set(userId, socket.id);
        socket.join(userId);
    });

    socket.on("send-message", (message) => {
        const receiverId = message.receiverId;
        const senderId = message.senderId._id || message.senderId;
        io.to(receiverId).emit("receive-message", { ...message, isMe: false });
        
        const updatePayload = {
            conversationId: message.conversationId,
            lastMessage: message.text,
            senderId: message.senderId,
            time: message.time
        };
        io.to(receiverId).emit("conversation-updated", updatePayload);
        io.to(senderId).emit("conversation-updated", updatePayload);
    });

    socket.on("disconnect", () => {
        for (let [key, value] of onlineUsers.entries()) {
            if (value === socket.id) onlineUsers.delete(key);
        }
    });
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/skills', skillRoutes);
app.use('/Notes', NotesRoutes);
app.use('/Admin', adminRoutes);
app.use('/groups', GroupRoutes);
app.use('/session-requests', GroupMessagesRoute);
app.use('/report', ReportRoutes);
app.use('/message', ConversationRoutes);
app.use('/edit', EditRoutes);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});