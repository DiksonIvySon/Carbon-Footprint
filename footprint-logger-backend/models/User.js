const mongoose = require("mongoose");

const weeklyGoalSchema = new mongoose.Schema({
  targetKg: { type: Number, default: 0 },       // target reduction per week in kg
  progressKg: { type: Number, default: 0 },     // how many kg reduced so far (or current total)
  weekStart: { type: Date, default: () => {
    const d = new Date(); d.setHours(0,0,0,0); return d;
  }},
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  weeklyGoal: { type: weeklyGoalSchema, default: () => ({}) },
});

module.exports = mongoose.model("User", userSchema);
