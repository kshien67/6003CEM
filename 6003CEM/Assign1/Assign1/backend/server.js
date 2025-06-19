// backend/server.js

const express = require('express');
const cors = require('cors');
const connectDB = require('./connect');

const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news_api');
const cryptoRoutes = require('./routes/crypto'); // ✅ Import crypto routes
const favouriteNewsRoutes = require('./routes/favouriteNews');
const exchangeRoutes = require('./routes/exchange');
// ✅ Import favourite news routes
const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ Route mounting
app.use('/api', authRoutes);         // /api/login, /api/register, /api/protected
app.use('/api', newsRoutes);         // /api/news or similar
app.use('/api', cryptoRoutes); // /api/crypto, /api/crypto/watchlist etc.
app.use('/api', favouriteNewsRoutes);
app.use('/api', exchangeRoutes);

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
