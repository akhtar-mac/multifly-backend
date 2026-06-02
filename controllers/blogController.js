const BlogPost = require("../models/BlogPost");

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// GET / — public
const getPublishedPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find({ isPublished: true }).sort({ publishedAt: -1 }).populate("author", "name");
    res.json({ success: true, data: { posts } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /:slug — public
const getPostBySlug = async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, isPublished: true }).populate("author", "name");
    if (!post) {
      return res.status(404).json({ success: false, message: "Blog post not found." });
    }
    res.json({ success: true, data: { post } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST / — admin
const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, tags, isPublished } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required." });
    }

    const slug = slugify(title);
    const publishedAt = isPublished ? new Date() : null;

    const post = await BlogPost.create({
      title,
      slug,
      content,
      excerpt,
      coverImage,
      author: req.user._id,
      tags,
      isPublished,
      publishedAt,
    });

    res.status(201).json({ success: true, data: { post } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /:id — admin
const updatePost = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Regenerate slug if title changed
    if (updates.title) {
      updates.slug = slugify(updates.title);
    }

    // Set publishedAt if publishing for the first time
    if (updates.isPublished) {
      const existing = await BlogPost.findById(req.params.id);
      if (!existing.isPublished) {
        updates.publishedAt = new Date();
      }
    }

    const post = await BlogPost.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!post) {
      return res.status(404).json({ success: false, message: "Blog post not found." });
    }
    res.json({ success: true, data: { post } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPublishedPosts, getPostBySlug, createPost, updatePost };
