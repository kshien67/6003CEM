// 📁 Path: backend/routes/exchange.js

const express = require("express");
const router = express.Router();
const axios = require("axios");
const authenticateUser = require("../middleware/authMiddleware");
const SaveExchange = require("../models/saveExchange");

// ✅ Get live currency exchange rates
router.get("/exchange/live", authenticateUser, async (req, res) => {
  try {
    const response = await axios.get("https://api.exchangerate.host/live", {
      params: {
        access_key: "e145ca4845eb39eeb8ef8deeaf42f07f",
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("❌ Exchange rate fetch error:", err.message);
    res.status(500).json({ msg: "Unable to fetch exchange rates" });
  }
});

// ✅ Save a favourite currency pair
router.post("/exchange/save", authenticateUser, async (req, res) => {
  try {
    const { base, target, rate } = req.body;

    const exists = await SaveExchange.findOne({
      userId: req.user._id,
      base,
      target,
    });

    if (exists) {
      return res.status(400).json({ msg: "Already saved." });
    }

    const newPair = new SaveExchange({
      userId: req.user._id,
      base,
      target,
      rate,
    });

    await newPair.save();
    res.json({ msg: "Exchange rate saved." });
  } catch (err) {
    console.error("❌ Save exchange error:", err.message);
    res.status(500).json({ msg: "Save failed." });
  }
});

// ✅ Get user's saved exchange pairs
router.get("/exchange/favourites", authenticateUser, async (req, res) => {
  try {
    const saved = await SaveExchange.find({ userId: req.user._id });
    res.json(saved);
  } catch (err) {
    console.error("❌ Fetch favourites error:", err.message);
    res.status(500).json({ msg: "Failed to load saved exchange rates" });
  }
});

// ✅ Delete a saved currency pair
router.delete("/exchange/delete/:base/:target", authenticateUser, async (req, res) => {
  try {
    const { base, target } = req.params;

    const deleted = await SaveExchange.findOneAndDelete({
      userId: req.user._id,
      base,
      target,
    });

    if (!deleted) {
      return res.status(404).json({ msg: "Pair not found." });
    }

    res.json({ msg: "Deleted from favourites." });
  } catch (err) {
    console.error("❌ Delete exchange error:", err.message);
    res.status(500).json({ msg: "Delete failed." });
  }
});

module.exports = router;