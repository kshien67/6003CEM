const mongoose = require("mongoose");

const savedCryptoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coinId: {
      type: String,
      required: true,
    },
    name: String,
    symbol: String,
    image: String,
    current_price: Number,
    market_cap: Number,
    last_updated: String,
    sparkline: [Number],
  },
  { timestamps: true }
);

// ✅ Enforce unique constraint per user per coin
savedCryptoSchema.index({ userId: 1, coinId: 1 }, { unique: true });

module.exports = mongoose.model("SavedCrypto", savedCryptoSchema);
