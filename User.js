const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { collection: 'username' });  // <-- Set collection name here);

module.exports = mongoose.model('User', userSchema);