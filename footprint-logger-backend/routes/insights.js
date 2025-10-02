// routes/insights.js
const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// auth middleware (reuse same method as activities.js)
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

// helper to compute start-of-week (7 days ago)
function weekAgo() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d;
}

// simple tip database per category
const TIPS = {
  transport: [
    { text: "Try cycling twice this week to cut ~2 kg CO₂", estReduction: 2 },
    { text: "Combine trips and avoid short car journeys to save ~1 kg", estReduction: 1 }
  ],
  food: [
    { text: "Swap one meat meal for plant-based to save ~1.5 kg", estReduction: 1.5 },
    { text: "Cut dairy for two meals to save ~1 kg", estReduction: 1 }
  ],
  energy: [
    { text: "Turn off lights for 2 hours daily to save ~0.5 kg", estReduction: 0.5 },
    { text: "Reduce heating by 1°C this week to save ~3 kg", estReduction: 3 }
  ],
  default: [
    { text: "Try small changes — every bit helps!", estReduction: 0.5 }
  ]
};

// GET /api/insights - returns category totals, highest category, chosen tip, weeklyGoal + progress
router.get("/", auth, async (req, res) => {
  try {
    const uid = req.user.id;
    const since = weekAgo();
    // aggregate by category across last 7 days for this user
    const acts = await Activity.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(uid), date: { $gte: since } } },
      { $group: { _id: "$category", total: { $sum: "$co2Value" } } }
    ]);

    const totals = {};
    acts.forEach(a => totals[a._id] = a.total);

    // determine highest category
    let highest = null;
    let highestVal = 0;
    Object.entries(totals).forEach(([cat, val]) => {
      if (val > highestVal) { highestVal = val; highest = cat; }
    });

    if (!highest) highest = "default";

    // pick a tip heuristically (first available)
    const tipsForCat = TIPS[highest] || TIPS.default;
    const tip = tipsForCat[0];

    // fetch user's weeklyGoal
    const user = await User.findById(uid).select("weeklyGoal username");
    const weeklyGoal = user.weeklyGoal || { targetKg: 0, progressKg: 0, weekStart: new Date() };

    // compute progress: e.g., current total (this week) vs baseline - for now, progress = (baseline - current)
    // simpler: progressKg = weeklyGoal.targetKg - highestVal (or something meaningful). We'll expose both numbers.
    const response = {
      username: user.username,
      totals,
      highestCategory: highest,
      highestValueKg: highestVal,
      tip: tip.text,
      suggestedReductionKg: tip.estReduction,
      weeklyGoal
    };

    return res.json(response);
  } catch (err) {
    console.error("Insights error", err);
    res.status(500).json({ error: "Server error computing insights" });
  }
});

// POST /api/insights/goal - set target (body: { targetKg })
router.post("/goal", auth, async (req, res) => {
  try {
    const uid = req.user.id;
    const { targetKg } = req.body;
    if (typeof targetKg !== "number") return res.status(400).json({ error: "Invalid targetKg" });

    const weekStart = new Date();
    weekStart.setHours(0,0,0,0);

    const user = await User.findByIdAndUpdate(uid, {
      $set: { "weeklyGoal.targetKg": targetKg, "weeklyGoal.progressKg": 0, "weeklyGoal.weekStart": weekStart }
    }, { new: true }).select("weeklyGoal");

    // Ideally emit real-time update via socket (we'll show how to emit from server when integrated)
    res.json({ weeklyGoal: user.weeklyGoal });
  } catch (err) {
    console.error("Set goal error", err);
    res.status(500).json({ error: "Unable to set weekly goal" });
  }
});

module.exports = router;
