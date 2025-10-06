const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  targetReduction: { type: Number, required: true }, // e.g., reduce 5kg CO2
  achieved: { type: Boolean, default: false },
  weekStart: { type: Date, default: () => {
    const now = new Date();
    now.setDate(now.getDate() - now.getDay()); // start of week (Sunday)
    return now;
  }}
});

module.exports = mongoose.model("Goal", goalSchema);