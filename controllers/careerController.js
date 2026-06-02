const CareerApplication = require("../models/Career");

const OPEN_POSITIONS = [
  { id: 1, title: "Travel Consultant", location: "Mumbai", department: "Sales", type: "Full-time", description: "Consult with clients to plan and book their dream vacations. Strong communication skills required." },
  { id: 2, title: "Travel Consultant", location: "Delhi", department: "Sales", type: "Full-time", description: "Consult with clients to plan and book their dream vacations. Strong communication skills required." },
  { id: 3, title: "Travel Consultant", location: "Bangalore", department: "Sales", type: "Full-time", description: "Consult with clients to plan and book their dream vacations. Strong communication skills required." },
  { id: 4, title: "Travel Consultant", location: "Chennai", department: "Sales", type: "Full-time", description: "Consult with clients to plan and book their dream vacations. Strong communication skills required." },
  { id: 5, title: "Travel Consultant", location: "Hyderabad", department: "Sales", type: "Full-time", description: "Consult with clients to plan and book their dream vacations. Strong communication skills required." },
  { id: 6, title: "Tour Operations Executive", location: "Mumbai", department: "Operations", type: "Full-time", description: "Manage tour logistics, coordinate with vendors, and ensure seamless travel experiences." },
  { id: 7, title: "Tour Operations Executive", location: "Delhi", department: "Operations", type: "Full-time", description: "Manage tour logistics, coordinate with vendors, and ensure seamless travel experiences." },
  { id: 8, title: "Tour Operations Executive", location: "Bangalore", department: "Operations", type: "Full-time", description: "Manage tour logistics, coordinate with vendors, and ensure seamless travel experiences." },
  { id: 9, title: "Tour Operations Executive", location: "Chennai", department: "Operations", type: "Full-time", description: "Manage tour logistics, coordinate with vendors, and ensure seamless travel experiences." },
  { id: 10, title: "Tour Operations Executive", location: "Kolkata", department: "Operations", type: "Full-time", description: "Manage tour logistics, coordinate with vendors, and ensure seamless travel experiences." },
  { id: 11, title: "Visa Consultant", location: "Mumbai", department: "Visa Services", type: "Full-time", description: "Handle visa applications and documentation for international travel. Knowledge of visa processes preferred." },
  { id: 12, title: "Visa Consultant", location: "Delhi", department: "Visa Services", type: "Full-time", description: "Handle visa applications and documentation for international travel. Knowledge of visa processes preferred." },
  { id: 13, title: "Visa Consultant", location: "Bangalore", department: "Visa Services", type: "Full-time", description: "Handle visa applications and documentation for international travel. Knowledge of visa processes preferred." },
];

// GET /positions — public
const getOpenPositions = async (req, res) => {
  try {
    res.json({ success: true, data: { positions: OPEN_POSITIONS } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /apply — public
const apply = async (req, res) => {
  try {
    const { name, email, phone, position, cvUrl } = req.body;

    if (!name || !email || !phone || !position) {
      return res.status(400).json({ success: false, message: "Name, email, phone, and position are required." });
    }

    const application = await CareerApplication.create({ fullName: name, email, phone, position, cvUrl });
    res.status(201).json({ success: true, data: { application } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /applications — admin
const getApplications = async (req, res) => {
  try {
    const applications = await CareerApplication.find().sort({ createdAt: -1 });
    res.json({ success: true, data: { applications } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getOpenPositions, apply, getApplications };
