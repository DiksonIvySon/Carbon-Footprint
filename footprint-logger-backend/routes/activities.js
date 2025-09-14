const express = require("express");
const Activity = require("../models/Activity");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to check auth
function auth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Add Activity
router.post("/", auth, async (req, res) => {
  const { activity, category, co2Value } = req.body;
  const newAct = await Activity.create({ userId: req.user.id, activity, category, co2Value });
  res.json(newAct);
});

// Get User Activities
router.get("/", auth, async (req, res) => {
  const acts = await Activity.find({ userId: req.user.id });
  res.json(acts);
});

// Weekly Summary
router.get("/weekly", auth, async (req, res) => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const acts = await Activity.find({
    userId: req.user.id,
    date: { $gte: weekAgo }
  });

  const total = acts.reduce((sum, act) => sum + act.co2Value, 0);
  res.json({ activities: acts, weeklyTotal: total });
});

// Community Average
router.get("/community", async (req, res) => {
  const allActs = await Activity.aggregate([
    { $group: { _id: "$userId", total: { $sum: "$co2Value" } } }
  ]);
  const avg = allActs.reduce((sum, u) => sum + u.total, 0) / allActs.length;
  res.json({ communityAverage: avg });
});

// Leaderboard (lowest footprint)
router.get("/leaderboard", async (req, res) => {
  const allActs = await Activity.aggregate([
    { $group: { _id: "$userId", total: { $sum: "$co2Value" } } },
    { $sort: { total: 1 } },
    { $limit: 10 }
  ]);

  const withUsers = await Promise.all(allActs.map(async (u) => {
    const user = await User.findById(u._id);
    return { username: user.username, total: u.total };
  }));

  res.json(withUsers);
});

module.exports = router;
