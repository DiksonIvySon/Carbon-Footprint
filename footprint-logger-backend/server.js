const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const activityRoutes = require("./routes/activities");

const app = express();

const allowedOrigins = [
  'http://127.0.0.1:5500',                     // local testing
  'https://carbon-footprint-frontend-4nzs.onrender.com'  // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/activities", activityRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
