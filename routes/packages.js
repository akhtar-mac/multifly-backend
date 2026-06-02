const express = require("express");
const router = express.Router();
const { getAllPackages, getFeaturedPackages, getPackageBySlug, createPackage, updatePackage, deletePackage } = require("../controllers/packageController");
const { auth, admin } = require("../middleware/admin");

router.get("/", getAllPackages);
router.get("/featured", getFeaturedPackages);
router.get("/:slug", getPackageBySlug);
router.post("/", auth, admin, createPackage);
router.put("/:id", auth, admin, updatePackage);
router.delete("/:id", auth, admin, deletePackage);

module.exports = router;
