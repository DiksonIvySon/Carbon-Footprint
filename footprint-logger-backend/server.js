const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const activityRoutes = require("./routes/activities");

const app = express();
app.use(cors({
  origin: 'https://carbon-footprint-frontend-4nzs.onrender.com'
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/activities", activityRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
