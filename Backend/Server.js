const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const connectDB = require('./Config/connDB');


const authRoutes = require('./Routes/AuthRoutes');
const skillRoutes = require('./Routes/SkillCategories');
const NotesRoutes = require('./Routes/NotesRotes');
const adminRoutes = require('./Routes/AdminRoutes');

app.use(
    cors({
        origin: '*',
        methods: ['GET', 'PUT', 'DELETE', 'POST'],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
)

connectDB()
app.use(express.json())

app.use('/api/auth', authRoutes);
app.use('/skills', skillRoutes);
app.use('/Notes', NotesRoutes);
app.use('/Admin', adminRoutes);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});