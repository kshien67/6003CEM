// 📁 Path: backend/models/savedExchange.js

const mongoose = require("mongoose");

const savedExchangeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  base: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("SavedExchange", savedExchangeSchema);