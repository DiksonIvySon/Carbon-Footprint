const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  activity: { type: String, required: true },
  category: { type: String, enum: ["food", "transport", "energy"], required: true },
  co2Value: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Activity", activitySchema);
