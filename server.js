const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", name: "Multifly API", time: new Date().toISOString() });
});

// Root
app.get("/", (req, res) => {
  res.json({ message: "Multifly API v3 - ALL ROUTES INLINE" });
});

// ============ AUTH ROUTES (inline) ============
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const JWT_SECRET = process.env.JWT_SECRET || "multifly-secret-key";

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, password required" });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "User exists" });
    const user = await User.create({ name, email, password, phone });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ success: true, data: { user: { _id: user._id, name, email, phone, role: user.role }, token } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email, password required" });
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, data: { user: { _id: user._id, name: user.name, email, phone: user.phone, role: user.role }, token } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/auth/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "No token" });
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: { user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } } });
  } catch (e) { res.status(401).json({ success: false, message: "Invalid token" }); }
});

// ============ PACKAGES ROUTES (inline) ============
const Package = require("./models/Package");

app.get("/api/packages", async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: packages.length, data: packages });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/packages/:slug", async (req, res) => {
  try {
    const pkg = await Package.findOne({ slug: req.params.slug, isActive: true });
    if (!pkg) return res.status(404).json({ success: false, message: "Package not found" });
    res.json({ success: true, data: pkg });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ============ BOOKINGS ROUTES (inline) ============
const Booking = require("./models/Booking");

app.post("/api/bookings", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ============ INQUIRIES ============
app.post("/api/inquiries", async (req, res) => {
  try {
    const Inquiry = require("./models/Inquiry");
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json({ success: true, data: inquiry });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/inquiries", async (req, res) => {
  try {
    const Inquiry = require("./models/Inquiry");
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ============ 404 ============
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// ============ SERVER ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Multifly API v3 running on port", PORT);

  // Connect DB in background
  if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 30000 })
      .then(conn => {
        console.log("MongoDB:", conn.connection.host);
        // Seed
        seedData().catch(e => console.log("Seed:", e.message));
      })
      .catch(e => console.error("DB error:", e.message));
  }
});

async function seedData() {
  const count = await User.countDocuments();
  if (count === 0) {
    await User.create([
      { name: "Admin", email: "admin@antigravity.com", password: "admin123", role: "admin", phone: "9999999999" },
      { name: "Demo User", email: "user@antigravity.com", password: "user123", role: "user", phone: "8888888888" },
    ]);
    console.log("Seeded admin + user");
  }
}
