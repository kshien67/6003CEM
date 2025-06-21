const mongoose = require('mongoose');

const newsItemSchema = new mongoose.Schema({
  title: String,
  url: String,
  urlToImage: String,
  description: String,
  publishedAt: String
});

const favouriteNewsSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  favourites: { type: [newsItemSchema], default: [] }  // ✅ plural & default array
}, { collection: 'favouriteNews' });

module.exports = mongoose.model('FavouriteNews', favouriteNewsSchema);
