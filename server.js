// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🛠️ 1. MIDDLEWARE CONFIGURATION
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

app.use(express.static('public'));

// 🔌 2. MONGODB CONNECTION LOGIC
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected successfully to MongoDB Social Database'))
  .catch((err) => console.error('❌ Database connection error:', err));

// 📡 3. ROUTE CONTROLLERS LINKING

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const followRoutes = require('./routes/followRoutes'); // <-- Add this line

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/follow', followRoutes); // <-- Add this line
// 🌐 4. BASE CHECKPOINT ROUTE
app.get('/', (req, res) => {
  res.send('Social Media API Backend is running smoothly.');
});

// 🚀 5. START LISTENING FOR TRAFFIC
app.listen(PORT, () => {
  console.log(`🚀 Server navigating fluidly on port ${PORT}`);
});