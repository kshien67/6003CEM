const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const NEWS_API_KEY = 'd8f7aa07fd4c44e48a4f830950b93cc2'; // Your NewsAPI key

app.get('/api/crypto-news', async (req, res) => {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything?', {
      params: {
        q: 'crypto',
        sortBy: 'publishedAt',
        language: 'en',
        pageSize: 10,
        apiKey: NEWS_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'News fetch failed' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
