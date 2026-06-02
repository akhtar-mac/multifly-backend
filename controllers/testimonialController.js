const Testimonial = require("../models/Testimonial");

// GET / — public
const getVisibleTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isVisible: true }).sort({ order: 1 });
    res.json({ success: true, data: { testimonials } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST / — admin
const createTestimonial = async (req, res) => {
  try {
    const { name, photo, text, tour, isVisible, order } = req.body;

    if (!name || !text) {
      return res.status(400).json({ success: false, message: "Name and text are required." });
    }

    const testimonial = await Testimonial.create({ name, photo, text, tour, isVisible, order });
    res.status(201).json({ success: true, data: { testimonial } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /:id — admin
const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found." });
    }
    res.json({ success: true, data: { testimonial } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getVisibleTestimonials, createTestimonial, updateTestimonial };
