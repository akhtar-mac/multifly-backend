const express = require("express");
const router = express.Router();
const { getPublishedPosts, getPostBySlug, createPost, updatePost } = require("../controllers/blogController");
const { auth, admin } = require("../middleware/admin");

router.get("/", getPublishedPosts);
router.get("/:slug", getPostBySlug);
router.post("/", auth, admin, createPost);
router.put("/:id", auth, admin, updatePost);

module.exports = router;
