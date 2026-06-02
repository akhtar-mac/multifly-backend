require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check — always works
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.json({ status: "ok", name: "Multifly API", db: states[dbState] || "unknown", time: new Date().toISOString() });
});

// All models
const User = require("./models/User");
const Package = require("./models/Package");
const Booking = require("./models/Booking");
const Inquiry = require("./models/Inquiry");
const Testimonial = require("./models/Testimonial");
const BlogPost = require("./models/BlogPost");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "multifly-secret-key-2026";
const auth = require("./middleware/auth");

// Auth routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "Name, email, password required" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: "User already exists" });
    const user = await User.create({ name, email, password, phone });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ success: true, data: { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, data: { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/auth/me", auth, async (req, res) => {
  try { res.json({ success: true, data: { user: { _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } } }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Packages
app.get("/api/packages", async (req, res) => {
  try {
    const { category, featured, limit } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (featured === "true") filter.isFeatured = true;
    const packages = await Package.find(filter).sort({ createdAt: -1 }).limit(parseInt(limit) || 50);
    res.json({ success: true, data: packages });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/packages/:slug", async (req, res) => {
  try {
    const pkg = await Package.findOne({ slug: req.params.slug, isActive: true });
    if (!pkg) return res.status(404).json({ success: false, message: "Package not found" });
    res.json({ success: true, data: pkg });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Bookings
app.get("/api/bookings", auth, async (req, res) => {
  try { const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 }); res.json({ success: true, data: bookings }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/bookings", auth, async (req, res) => {
  try { const booking = await Booking.create({ ...req.body, user: req.user._id }); res.status(201).json({ success: true, data: booking }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Inquiries
app.post("/api/inquiries", async (req, res) => {
  try { const inquiry = await Inquiry.create(req.body); res.status(201).json({ success: true, data: inquiry }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/inquiries", auth, async (req, res) => {
  try { const inquiries = await Inquiry.find().sort({ createdAt: -1 }); res.json({ success: true, data: inquiries }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Testimonials
app.get("/api/testimonials", async (req, res) => {
  try { const testimonials = await Testimonial.find({ isVisible: true }).sort({ order: 1 }); res.json({ success: true, data: testimonials }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Blog
app.get("/api/blog", async (req, res) => {
  try { const posts = await BlogPost.find({ isPublished: true }).sort({ publishedAt: -1 }); res.json({ success: true, data: posts }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/blog/:slug", async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, isPublished: true });
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    res.json({ success: true, data: post });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Careers
app.post("/api/careers", async (req, res) => {
  try { const app = await require("./models/CareerApplication").create(req.body); res.status(201).json({ success: true, data: app }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/careers", auth, async (req, res) => {
  try { const apps = await require("./models/CareerApplication").find().sort({ createdAt: -1 }); res.json({ success: true, data: apps }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Gallery
app.get("/api/gallery", async (req, res) => {
  try { const items = await require("./models/Gallery").find().sort({ order: 1 }); res.json({ success: true, data: items }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Users (admin)
app.get("/api/users", auth, async (req, res) => {
  try { const users = await User.find().sort({ createdAt: -1 }); res.json({ success: true, data: users }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// 404
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Error handler
app.use((err, req, res, next) => { console.error(err.stack); res.status(500).json({ message: err.message || "Internal Server Error" }); });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Multifly API running on port", PORT);
  
  // Connect to DB in background (don't block server start)
  mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 30000,
  }).then(conn => {
    console.log("MongoDB connected:", conn.connection.host);
    // Seed data
    require("./utils/seedData")().catch(e => console.error("Seed error:", e.message));
  }).catch(err => {
    console.error("MongoDB connection failed:", err.message);
  });
});

module.exports = app;
