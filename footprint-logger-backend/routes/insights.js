const express = require("express");
const Activity = require("../models/Activity");
const Goal = require("../models/Goal");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware
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

// Generate a simple personalized tip
function generateTip(category, total) {
  const tips = {
    travel: `Try cycling or walking twice this week to cut around ${(total * 0.2).toFixed(1)} kg CO₂.`,
    food: `Go meat-free for two days to save ${(total * 0.15).toFixed(1)} kg CO₂.`,
    energy: `Reduce your electricity usage by 10% to save ${(total * 0.1).toFixed(1)} kg CO₂.`,
    default: `You're doing great! Keep monitoring your activities to stay eco-friendly.`
  };

  return tips[category] || tips.default;
}

// Analyze emissions and return insights
router.get("/weekly", auth, async (req, res) => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const acts = await Activity.find({
    userId: req.user.id,
    date: { $gte: weekAgo }
  });

  if (!acts.length) return res.json({ message: "No activity this week yet." });

  // Group by category
  const totalsByCategory = {};
  acts.forEach(a => {
    totalsByCategory[a.category] = (totalsByCategory[a.category] || 0) + a.co2Value;
  });

  const [highestCategory, highestEmission] = Object.entries(totalsByCategory)
    .sort((a, b) => b[1] - a[1])[0];

  const tip = generateTip(highestCategory, highestEmission);

  // Save or update a goal for the week
  const goal = await Goal.findOneAndUpdate(
    { userId: req.user.id, weekStart: { $gte: weekAgo } },
    { category: highestCategory, targetReduction: (highestEmission * 0.15).toFixed(2) },
    { new: true, upsert: true }
  );

  res.json({
    category: highestCategory,
    weeklyTotal: highestEmission.toFixed(2),
    tip,
    goal
  });
});

module.exports = router;