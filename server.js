const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", name: "Multifly API", time: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.json({ message: "Multifly API is running!" });
});

// Auth
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "multifly-secret";
const mongoose = require("mongoose");

// Connect DB in background
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 30000 })
    .then(c => console.log("DB:", c.connection.host))
    .catch(e => console.error("DB err:", e.message));
}

const User = require("./models/User");
const auth = require("./middleware/auth");

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, data: { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ success: false, message: "User exists" });
    const user = await User.create({ name, email, password, phone });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ success: true, data: { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/auth/me", auth, (req, res) => {
  res.json({ success: true, data: { user: { _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } } });
});

// Packages
const Package = require("./models/Package");
app.get("/api/packages", async (req, res) => {
  try {
    const pkgs = await Package.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: pkgs });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/packages/:slug", async (req, res) => {
  try {
    const pkg = await Package.findOne({ slug: req.params.slug });
    if (!pkg) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: pkg });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Testimonials
app.get("/api/testimonials", async (req, res) => {
  try {
    const items = await require("./models/Testimonial").find({ isVisible: true }).sort({ order: 1 });
    res.json({ success: true, data: items });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Blog
app.get("/api/blog", async (req, res) => {
  try {
    const posts = await require("./models/BlogPost").find({ isPublished: true }).sort({ publishedAt: -1 });
    res.json({ success: true, data: posts });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Inquiries
app.post("/api/inquiries", async (req, res) => {
  try {
    const inquiry = await require("./models/Inquiry").create(req.body);
    res.status(201).json({ success: true, data: inquiry });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Careers
app.post("/api/careers", async (req, res) => {
  try {
    const app = await require("./models/CareerApplication").create(req.body);
    res.status(201).json({ success: true, data: app });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Bookings
const Booking = require("./models/Booking");
app.get("/api/bookings", auth, async (req, res) => {
  try { res.json({ success: true, data: await Booking.find({ user: req.user._id }).sort({ createdAt: -1 }) }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/bookings", auth, async (req, res) => {
  try { res.status(201).json({ success: true, data: await Booking.create({ ...req.body, user: req.user._id }) }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Users
app.get("/api/users", auth, async (req, res) => {
  try { res.json({ success: true, data: await User.find().sort({ createdAt: -1 }) }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Gallery
app.get("/api/gallery", async (req, res) => {
  try { res.json({ success: true, data: await require("./models/Gallery").find().sort({ order: 1 }) }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ message: err.message }); });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Multifly API running on port", PORT);
  // Seed on first start
  mongoose.connection.on("connected", () => {
    require("./utils/seedData")().catch(e => console.error("Seed:", e.message));
  });
});

module.exports = app;
