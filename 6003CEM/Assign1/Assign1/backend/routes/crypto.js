const express = require("express");
const router = express.Router();
const axios = require("axios");
const SavedCrypto = require("../models/savedCrypto");
const authenticateUser = require("../middleware/authMiddleware");

// ✅ Get top coins (homepage list)
router.get("/crypto", async (req, res) => {
  const limit = req.query.limit || 10;

  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: limit,
        page: 1,
        sparkline: true,
        price_change_percentage: "24h",
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("❌ Failed to fetch crypto data:", err.message);
    res.status(500).json({ msg: "Unable to fetch crypto data" });
  }
});

// ✅ Save a coin to watchlist
router.post("/crypto/save", authenticateUser, async (req, res) => {
  try {
    const {
      id,
      name,
      symbol,
      image,
      current_price,
      market_cap,
      last_updated,
      sparkline_in_7d,
    } = req.body;

    const exists = await SavedCrypto.findOne({ userId: req.user._id, coinId: id });
    if (exists) return res.status(400).json({ msg: "Already saved." });

    const crypto = new SavedCrypto({
      userId: req.user._id,
      coinId: id,
      name,
      symbol,
      image,
      current_price,
      market_cap,
      last_updated,
      sparkline: sparkline_in_7d?.price || [],
    });

    await crypto.save();
    res.json({ msg: "Saved to watchlist." });
  } catch (err) {
    console.error("❌ Save error:", err.message);
    res.status(500).json({ msg: "Save failed." });
  }
});

// ✅ Get user's saved watchlist
router.get("/crypto/watchlist", authenticateUser, async (req, res) => {
  try {
    const saved = await SavedCrypto.find({ userId: req.user._id });
    res.json(saved);
  } catch (err) {
    console.error("❌ Watchlist fetch error:", err.message);
    res.status(500).json({ msg: "Failed to load watchlist" });
  }
});

// ✅ Get individual coin details
router.get("/crypto/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
    res.json(response.data);
  } catch (err) {
    console.error("❌ Coin fetch error:", err.message);
    res.status(404).json({ msg: "Coin not found" });
  }
});

// ✅ Get market chart data
router.get("/crypto/:id/market_chart", async (req, res) => {
  const { id } = req.params;
  const { days } = req.query;

  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
      params: {
        vs_currency: "usd",
        days: days || 7,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("❌ Chart fetch error:", err.message);
    res.status(404).json({ msg: "Chart data not found" });
  }
});

// ✅ Delete a coin from watchlist
router.delete("/crypto/delete/:coinId", authenticateUser, async (req, res) => {
  try {
    const { coinId } = req.params;

    const result = await SavedCrypto.findOneAndDelete({
      userId: req.user._id,
      coinId: coinId,
    });

    if (!result) {
      return res.status(404).json({ msg: "Coin not found in watchlist." });
    }

    res.json({ msg: "Deleted from watchlist." });
  } catch (err) {
    console.error("❌ Delete error:", err.message);
    res.status(500).json({ msg: "Delete failed." });
  }
});

module.exports = router;
