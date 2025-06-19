const mongoose = require('mongoose');

const dbURI = "mongodb+srv://esthertansiying:ep69JzbahwQae8LG@cluster0.0gnzbyw.mongodb.net/Assignment";

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // exit process with failure
  }
};

module.exports = connectDB;
