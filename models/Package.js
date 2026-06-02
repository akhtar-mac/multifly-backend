const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["international", "domestic", "honeymoon", "adventure", "cruise", "mice", "women-special", "romantic"],
      required: true,
    },
    region: { type: String },
    duration: {
      days: { type: Number, required: true },
      nights: { type: Number, required: true },
    },
    price: {
      amount: { type: Number, required: true },
      currency: { type: String, default: "INR" },
      perPerson: { type: Boolean, default: true },
    },
    validity: { type: String },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    itinerary: [
      {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String },
      },
    ],
    images: [{ type: String }],
    thumbnail: { type: String },
    video: { type: String },
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", packageSchema);
