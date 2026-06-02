const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    source: { type: String, default: "website" },
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema);
