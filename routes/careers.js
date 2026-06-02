const express = require("express");
const router = express.Router();
const { getOpenPositions, apply, getApplications } = require("../controllers/careerController");
const { auth, admin } = require("../middleware/admin");

router.get("/positions", getOpenPositions);
router.post("/apply", apply);
router.get("/applications", auth, admin, getApplications);

module.exports = router;
