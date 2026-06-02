const Inquiry = require("../models/Inquiry");

// POST / — public
const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, message, package: packageId, source } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: "Name, email, phone, and message are required." });
    }

    const inquiry = await Inquiry.create({ name, email, phone, message, package: packageId, source });
    res.status(201).json({ success: true, data: { inquiry } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET / — admin
const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).populate("package", "title slug");
    res.json({ success: true, data: { inquiries } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /:id — admin update status
const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found." });
    }
    res.json({ success: true, data: { inquiry } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createInquiry, getAllInquiries, updateInquiryStatus };
