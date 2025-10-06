// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const Activity = require("../models/Activity");

// router.get("/", async (req, res) => {
//   // Calculate total CO2 for each user
//   const users = await User.find({});
//   const leaderboard = await Promise.all(users.map(async (user) => {
//     const total = await Activity.aggregate([
//       { $match: { userId: user._id } },
//       { $group: { _id: "$userId", totalCO2: { $sum: "$co2Value" } } }
//     ]);
//     return { username: user.username, totalCO2: total[0]?.totalCO2 || 0 };
//   }));

//   // Sort ascending: low CO2 first
//   leaderboard.sort((a, b) => a.totalCO2 - b.totalCO2);
//   res.json(leaderboard);
// });

// module.exports = router;
