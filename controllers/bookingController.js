const Booking = require("../models/Booking");

// GET / — user gets own, admin gets all
const getUserBookings = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== "admin") {
      filter.user = req.user._id;
    }
    const bookings = await Booking.find(filter)
      .populate("package", "title slug thumbnail price duration")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: { bookings } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST / — create booking
const createBooking = async (req, res) => {
  try {
    const { package: packageId, travelDate, numberOfTravelers, totalAmount, contactInfo, specialRequests } = req.body;

    const booking = await Booking.create({
      user: req.user._id,
      package: packageId,
      travelDate,
      numberOfTravelers,
      totalAmount,
      contactInfo,
      specialRequests,
    });

    const populated = await booking.populate("package", "title slug thumbnail");
    res.status(201).json({ success: true, data: { booking: populated } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /:id — protected
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("package", "title slug thumbnail price duration description")
      .populate("user", "name email phone");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    // Non-admin users can only view their own bookings
    if (req.user.role !== "admin" && booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    res.json({ success: true, data: { booking } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /:id — admin update status
const updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const booking = await Booking.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
      .populate("package", "title slug")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    res.json({ success: true, data: { booking } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /:id — protected (user can cancel own, admin can delete any)
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    if (req.user.role !== "admin" && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Booking cancelled successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUserBookings, createBooking, getBookingById, updateBookingStatus, deleteBooking };
