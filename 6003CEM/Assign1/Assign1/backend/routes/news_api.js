const express = require('express');
const axios = require('axios');

const router = express.Router();

const NEWS_API_KEY = 'd8f7aa07fd4c44e48a4f830950b93cc2';

router.get('/crypto-news', async (req, res) => {
  try {
    // NewsAPI allows max pageSize of 100
    const limit = Math.min(Number(req.query.limit) || 100, 100);

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'crypto',
        sortBy: 'publishedAt',
        language: 'en',
        pageSize: limit,
        apiKey: NEWS_API_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

module.exports = router;
