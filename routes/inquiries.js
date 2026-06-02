const express = require("express");
const router = express.Router();
const { createInquiry, getAllInquiries, updateInquiryStatus } = require("../controllers/inquiryController");
const { auth, admin } = require("../middleware/admin");

router.post("/", createInquiry);
router.get("/", auth, admin, getAllInquiries);
router.put("/:id", auth, admin, updateInquiryStatus);

module.exports = router;
