const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news_api');
const favouriteNewsRoutes = require('./routes/favouriteNews');
const connectDB = require('./routes/connect');   // Import the db connection

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', authRoutes);
app.use('/api', newsRoutes);
app.use('/api', favouriteNewsRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

