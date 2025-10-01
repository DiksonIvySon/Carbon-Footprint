const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();




const authRoutes = require("./routes/auth");
const activityRoutes = require("./routes/activities");

const app = express();

//

app.use((req, res, next) => {
  console.log("🌍 Incoming Origin:", req.headers.origin);
  next();
});

const corsOptions = {
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://carbon-footprint-frontend-4nzs.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true
};

app.use(cors(corsOptions));

// Explicitly respond to preflight
app.options(/.*/, cors(corsOptions));

// // ✅ Define allowed origins
// const allowedOrigins = [
//   "http://127.0.0.1:5500",
//   "http://localhost:5500",
//   "https://carbon-footprint-frontend-4nzs.onrender.com"
// ];

// // ✅ CORS middleware
// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow server-to-server (no origin) and allowed domains
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       console.error("❌ CORS blocked for:", origin);
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization", "Accept"],
//   credentials: true
// }));

// app.options(/.*/, cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true
// }));

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


