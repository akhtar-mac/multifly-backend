require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.json({ status: "ok", name: "Multifly API", db: states[dbState] || "unknown", time: new Date().toISOString() });
});

// Connect DB in background then load routes
const startServer = async () => {
  try {
    // Connect MongoDB
    if (process.env.MONGODB_URI) {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 10000,
      });
      console.log("MongoDB connected:", conn.connection.host);

      // Seed data
      try {
        const seedData = require("./utils/seedData");
        await seedData();
      } catch (e) {
        console.error("Seed error:", e.message);
      }
    } else {
      console.warn("MONGODB_URI not set, skipping DB connection");
    }

    // Load routes AFTER DB is ready
    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/packages", require("./routes/packages"));
    app.use("/api/bookings", require("./routes/bookings"));
    app.use("/api/inquiries", require("./routes/inquiries"));
    app.use("/api/careers", require("./routes/careers"));
    app.use("/api/testimonials", require("./routes/testimonials"));
    app.use("/api/blog", require("./routes/blog"));
    app.use("/api/gallery", require("./routes/gallery"));
    app.use("/api/users", require("./routes/users"));

    // 404
    app.use((req, res) => res.status(404).json({ message: "Route not found" }));
    app.use((err, req, res, next) => { console.error(err); res.status(500).json({ message: err.message }); });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log("Multifly API running on port", PORT));
  } catch (error) {
    console.error("Server start error:", error.message);
    process.exit(1);
  }
};

startServer();
module.exports = app;
