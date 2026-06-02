require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check — always works, even without DB
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.json({ status: "ok", name: "Multifly API", db: states[dbState] || "unknown", time: new Date().toISOString() });
});

// Start server FIRST, then connect DB
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Multifly API running on port", PORT);
  
  // Connect to MongoDB in background — don't block server start
  if (process.env.MONGODB_URI) {
    console.log("Connecting to MongoDB...");
    mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
    }).then(async (conn) => {
      console.log("MongoDB connected:", conn.connection.host);
      
      // Load routes AFTER DB is connected
      try {
        app.use("/api/auth", require("./routes/auth"));
        app.use("/api/packages", require("./routes/packages"));
        app.use("/api/bookings", require("./routes/bookings"));
        app.use("/api/inquiries", require("./routes/inquiries"));
        app.use("/api/careers", require("./routes/careers"));
        app.use("/api/testimonials", require("./routes/testimonials"));
        app.use("/api/blog", require("./routes/blog"));
        app.use("/api/gallery", require("./routes/gallery"));
        app.use("/api/users", require("./routes/users"));
        
        app.use((req, res) => res.status(404).json({ message: "Route not found" }));
        app.use((err, req, res, next) => { console.error(err); res.status(500).json({ message: err.message }); });
        
        console.log("All routes loaded");
        
        // Seed data
        try {
          await require("./utils/seedData")();
          console.log("Seed data loaded");
        } catch (e) {
          console.error("Seed error:", e.message);
        }
      } catch (e) {
        console.error("Route loading error:", e.message);
      }
    }).catch(err => {
      console.error("MongoDB connection failed:", err.message);
      console.log("Server running without DB — health check still works");
    });
  } else {
    console.warn("MONGODB_URI not set");
  }
});

module.exports = app;
