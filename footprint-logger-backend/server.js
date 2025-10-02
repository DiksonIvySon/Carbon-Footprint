const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const activityRoutes = require("./routes/activities");

const app = express();

// ✅ This simple version worked (allowed everything)
app.use(cors());

app.use(express.json());

// ✅ Mongo connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/activities", activityRoutes);

app.get("/", (req, res) => {
  res.send("Carbon Footprint Tracker API is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



