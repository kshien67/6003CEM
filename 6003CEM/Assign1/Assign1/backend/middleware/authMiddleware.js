const jwt = require("jsonwebtoken");
const User = require("../models/User");

const SECRET = '1467b19a850780f9c0156aa766b663e337a98ea37885eadc973a6a56b74ffff37e0739dfe4eba8ff13254c2814e9b8eaeade00152f10286a9686cd97fb5efae8';

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ msg: "User not found" });
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = authenticateUser;
