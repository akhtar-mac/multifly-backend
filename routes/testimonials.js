const express = require("express");
const router = express.Router();
const { getVisibleTestimonials, createTestimonial, updateTestimonial } = require("../controllers/testimonialController");
const { auth, admin } = require("../middleware/admin");

router.get("/", getVisibleTestimonials);
router.post("/", auth, admin, createTestimonial);
router.put("/:id", auth, admin, updateTestimonial);

module.exports = router;
