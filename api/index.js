const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let cachedDB = null;

async function connectDB() {
  if (cachedDB && mongoose.connection.readyState >= 1) {
    return cachedDB;
  }
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 30000,
    });
    cachedDB = conn;
    console.log('MongoDB connected:', conn.connection.host);
    return conn;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
}

// Inline routes for serverless simplicity
const User = require('./models/User');
const Package = require('./models/Package');
const Booking = require('./models/Booking');
const Inquiry = require('./models/Inquiry');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'multifly-secret';
const auth = require('./middleware/auth');

// Health
app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    const dbState = mongoose.connection.readyState;
    res.json({ status: 'ok', db: dbState === 1 ? 'connected' : 'disconnected', dbState });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    await connectDB();
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email, password required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'User already exists' });
    const user = await User.create({ name, email, password, phone });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ success: true, data: { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, data: { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.get('/api/auth/me', auth, async (req, res) => {
  try {
    await connectDB();
    res.json({ success: true, data: { user: { _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Packages
app.get('/api/packages', async (req, res) => {
  try {
    await connectDB();
    const { category, featured, limit } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    const packages = await Package.find(filter).sort({ createdAt: -1 }).limit(parseInt(limit) || 50);
    res.json({ success: true, data: packages });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.get('/api/packages/:slug', async (req, res) => {
  try {
    await connectDB();
    const pkg = await Package.findOne({ slug: req.params.slug, isActive: true });
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, data: pkg });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Bookings
app.get('/api/bookings', auth, async (req, res) => {
  try {
    await connectDB();
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.post('/api/bookings', auth, async (req, res) => {
  try {
    await connectDB();
    const booking = await Booking.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: booking });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Inquiries
app.post('/api/inquiries', async (req, res) => {
  try {
    await connectDB();
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json({ success: true, data: inquiry });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.get('/api/inquiries', auth, async (req, res) => {
  try {
    await connectDB();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, data: inquiries });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Testimonials
app.get('/api/testimonials', async (req, res) => {
  try {
    await connectDB();
    const testimonials = await require('./models/Testimonial').find({ isVisible: true }).sort({ order: 1 });
    res.json({ success: true, data: testimonials });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Blog
app.get('/api/blog', async (req, res) => {
  try {
    await connectDB();
    const posts = await require('./models/BlogPost').find({ isPublished: true }).sort({ publishedAt: -1 });
    res.json({ success: true, data: posts });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.get('/api/blog/:slug', async (req, res) => {
  try {
    await connectDB();
    const post = await require('./models/BlogPost').findOne({ slug: req.params.slug, isPublished: true });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

module.exports = app;
