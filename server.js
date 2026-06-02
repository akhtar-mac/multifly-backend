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
  res.json({ message: "Multifly API v2.0 - routes loaded!" });
});

// Debug: list all routes
app.get("/api/debug/routes", (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({ path: middleware.route.path, methods: Object.keys(middleware.route.methods) });
    } else if (middleware.name === "router") {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({ path: handler.route.path, methods: Object.keys(handler.route.methods) });
        }
      });
    }
  });
  res.json({ routeCount: routes.length, routes });
});

// Load routes IMMEDIATELY (they just won't work without DB until DB connects)
app.use("/api/auth", require("./routes/auth"));
app.use("/api/packages", require("./routes/packages"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/inquiries", require("./routes/inquiries"));
app.use("/api/careers", require("./routes/careers"));
app.use("/api/testimonials", require("./routes/testimonials"));
app.use("/api/blog", require("./routes/blog"));
app.use("/api/gallery", require("./routes/gallery"));
app.use("/api/users", require("./routes/users"));

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Not found" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
  
  // Connect to DB in background
  (async () => {
    try {
      const mongoose = require("mongoose");
      if (process.env.MONGODB_URI) {
        const conn = await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 30000 });
        console.log("MongoDB connected:", conn.connection.host);
        
        // Seed
        try { await require("./utils/seedData")(); console.log("Seeded"); } catch(e) { console.log("Seed:", e.message); }
      }
    } catch(e) {
      console.error("DB error:", e.message);
    }
  })();
});
