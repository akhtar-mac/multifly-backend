const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

if (!process.env.MONGODB_URI) {
  require('dotenv').config();
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads if they exist
const uploadsDir = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsDir)) {
  app.use('/uploads', express.static(uploadsDir));
}

// Routes
const authRoutes = require('./routes/auth');
const packageRoutes = require('./routes/packages');
const bookingRoutes = require('./routes/bookings');
const inquiryRoutes = require('./routes/inquiries');
const careerRoutes = require('./routes/careers');
const testimonialRoutes = require('./routes/testimonials');
const blogRoutes = require('./routes/blog');
const galleryRoutes = require('./routes/gallery');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'Multifly API' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
