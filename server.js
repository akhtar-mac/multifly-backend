require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check — no DB required
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.json({ status: "ok", name: "Multifly API", db: states[dbState] || "unknown", timestamp: new Date().toISOString() });
});

// DB connection (non-blocking)
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;
    console.log("Connecting to MongoDB...");
    console.log("URI exists:", !!process.env.MONGODB_URI);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    });
    console.log("MongoDB Connected:", conn.connection.host);
    
    // Seed data
    try {
      const seedData = require("./utils/seedData");
      await seedData();
    } catch (e) {
      console.error("Seed error:", e.message);
    }
  } catch (error) {
    console.error("MongoDB Error:", error.message);
  }
};

// Lazy load routes after DB is ready
let routesLoaded = false;
app.use(async (req, res, next) => {
  if (req.path === "/api/health") return next();
  
  try {
    if (!routesLoaded) {
      // Load models and routes
      require("./models/User");
      require("./models/Package");
      require("./models/Booking");
      require("./models/Inquiry");
      require("./models/Testimonial");
      require("./models/BlogPost");
      require("./models/CareerApplication");
      require("./models/Gallery");
      
      const authRoutes = require("./routes/auth");
      const packageRoutes = require("./routes/packages");
      const bookingRoutes = require("./routes/bookings");
      const inquiryRoutes = require("./routes/inquiries");
      const careerRoutes = require("./routes/careers");
      const testimonialRoutes = require("./routes/testimonials");
      const blogRoutes = require("./routes/blog");
      const galleryRoutes = require("./routes/gallery");
      const userRoutes = require("./routes/users");
      
      app.use("/api/auth", authRoutes);
      app.use("/api/packages", packageRoutes);
      app.use("/api/bookings", bookingRoutes);
      app.use("/api/inquiries", inquiryRoutes);
      app.use("/api/careers", careerRoutes);
      app.use("/api/testimonials", testimonialRoutes);
      app.use("/api/blog", blogRoutes);
      app.use("/api/gallery", galleryRoutes);
      app.use("/api/users", userRoutes);
      
      routesLoaded = true;
      console.log("Routes loaded");
    }
    next();
  } catch (e) {
    console.error("Route load error:", e.message);
    res.status(500).json({ success: false, message: "Server initialization error" });
  }
});

// 404
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Multifly API running on port ${PORT}`);
  // Connect DB in background
  connectDB();
});

module.exports = app;
