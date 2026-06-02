require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");

// Route imports
const authRoutes = require("./routes/auth");
const packageRoutes = require("./routes/packages");
const bookingRoutes = require("./routes/bookings");
const inquiryRoutes = require("./routes/inquiries");
const careerRoutes = require("./routes/careers");
const testimonialRoutes = require("./routes/testimonials");
const blogRoutes = require("./routes/blog");
const userRoutes = require("./routes/users");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/users", userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Antigravity API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
