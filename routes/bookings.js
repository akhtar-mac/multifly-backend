const express = require("express");
const router = express.Router();
const { getUserBookings, createBooking, getBookingById, updateBookingStatus, deleteBooking } = require("../controllers/bookingController");
const { auth, admin } = require("../middleware/admin");

router.get("/", auth, getUserBookings);
router.post("/", auth, createBooking);
router.get("/:id", auth, getBookingById);
router.put("/:id", auth, admin, updateBookingStatus);
router.delete("/:id", auth, deleteBooking);

module.exports = router;
