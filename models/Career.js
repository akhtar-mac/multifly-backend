const mongoose = require("mongoose");

const careerApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    cvUrl: { type: String },
    status: { type: String, enum: ["new", "reviewing", "shortlisted", "rejected", "hired"], default: "new" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareerApplication", careerApplicationSchema);
