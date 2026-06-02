const Package = require("../models/Package");

// GET / — public, with filters
const getAllPackages = async (req, res) => {
  try {
    const { category, region, minPrice, maxPrice, search, sort } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (region) filter.region = new RegExp(region, "i");
    if (minPrice || maxPrice) {
      filter["price.amount"] = {};
      if (minPrice) filter["price.amount"].$gte = Number(minPrice);
      if (maxPrice) filter["price.amount"].$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { region: new RegExp(search, "i") },
      ];
    }

    const sortOption = sort === "price" ? { "price.amount": 1 } : sort === "priceDesc" ? { "price.amount": -1 } : { createdAt: -1 };

    const packages = await Package.find(filter).sort(sortOption);
    res.json({ success: true, data: { packages, total: packages.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /featured — public
const getFeaturedPackages = async (req, res) => {
  try {
    const packages = await Package.find({ isFeatured: true, isActive: true }).limit(6);
    res.json({ success: true, data: { packages } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /:slug — public, increment viewCount
const getPackageBySlug = async (req, res) => {
  try {
    const pkg = await Package.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { viewCount: 1 } },
      { new: true }
    );
    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found." });
    }
    res.json({ success: true, data: { package: pkg } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST / — admin
const createPackage = async (req, res) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({ success: true, data: { package: pkg } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /:id — admin
const updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found." });
    }
    res.json({ success: true, data: { package: pkg } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /:id — admin
const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found." });
    }
    res.json({ success: true, message: "Package deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllPackages, getFeaturedPackages, getPackageBySlug, createPackage, updatePackage, deletePackage };
