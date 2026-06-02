// Minimal server that starts instantly
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", name: "Multifly API", time: new Date().toISOString() });
});

// Root
app.get("/", (req, res) => {
  res.json({ message: "Multifly API is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
  
  // Lazy load DB and routes
  setTimeout(async () => {
    try {
      const mongoose = require("mongoose");
      if (process.env.MONGODB_URI) {
        const conn = await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 30000 });
        console.log("MongoDB:", conn.connection.host);
        
        app.use("/api/auth", require("./routes/auth"));
        app.use("/api/packages", require("./routes/packages"));
        app.use("/api/bookings", require("./routes/bookings"));
        app.use("/api/inquiries", require("./routes/inquiries"));
        app.use("/api/careers", require("./routes/careers"));
        app.use("/api/testimonials", require("./routes/testimonials"));
        app.use("/api/blog", require("./routes/blog"));
        app.use("/api/gallery", require("./routes/gallery"));
        app.use("/api/users", require("./routes/users"));
        app.use((req, res) => res.status(404).json({ message: "Not found" }));
        
        // Seed
        try { await require("./utils/seedData")(); console.log("Seeded"); } catch(e) { console.log("Seed:", e.message); }
        console.log("Routes loaded");
      }
    } catch(e) {
      console.error("DB error:", e.message);
    }
  }, 2000); // Wait 2s before connecting DB
});
