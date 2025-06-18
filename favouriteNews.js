const express = require('express');
const router = express.Router();
const FavoriteNews = require('../models/FavouriteNews');

// Add to favourites
router.post('/favourites', async (req, res) => {
  const { username, ...newsItem } = req.body;

  if (!username || !newsItem.title) {
    return res.status(400).json({ error: 'Missing username or article title' });
  }

  try {
    let userDoc = await FavoriteNews.findOne({ username });

    if (!userDoc) {
      userDoc = new FavoriteNews({ username, favourites: [newsItem] });
    } else {
      const alreadyExists = userDoc.favourites.some(fav => fav.title === newsItem.title);
      if (alreadyExists) {
        return res.status(200).json({ message: 'Already in favourites' });
      }
      userDoc.favourites.push(newsItem);
    }

    await userDoc.save();
    res.status(201).json({ message: 'Saved to favourites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving favourite' });
  }
});

// Remove from favourites
router.delete('/favourites', async (req, res) => {
  const { username, title } = req.body;

  if (!username || !title) {
    return res.status(400).json({ error: 'Missing username or title' });
  }

  try {
    await FavoriteNews.updateOne(
      { username },
      { $pull: { favourites: { title } } }
    );

    res.json({ message: 'Removed from favourites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error removing favourite' });
  }
});

// Get user's favourites
router.get('/favourites', async (req, res) => {
  const { username } = req.query;

  if (!username) return res.status(400).json({ error: 'Missing username' });

  try {
    const userDoc = await FavoriteNews.findOne({ username });
    res.json(userDoc ? userDoc.favourites : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching favourites' });
  }
});

module.exports = router;
