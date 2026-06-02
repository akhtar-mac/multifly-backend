const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
    bookingDate: { type: Date, default: Date.now },
    travelDate: { type: Date },
    numberOfTravelers: { type: Number, default: 1 },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "pending" },
    contactInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    specialRequests: { type: String },
    paymentStatus: { type: String, enum: ["pending", "partial", "paid", "refunded"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
