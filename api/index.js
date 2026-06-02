const app = require("../app");
const connectDB = require("../config/db");
const seedData = require("../utils/seedData");

let seeded = false;

// Ensure DB connection and seed on first request
const ensureDB = async () => {
  await connectDB();
  if (!seeded) {
    seeded = true;
    try {
      await seedData();
    } catch (e) {
      console.error("Seed error:", e.message);
    }
  }
};

// Vercel serverless handler
module.exports = async (req, res) => {
  try {
    await ensureDB();
  } catch (e) {
    console.error("DB connection failed:", e.message);
    return res.status(500).json({ success: false, message: "Database connection failed" });
  }
  return app(req, res);
};
