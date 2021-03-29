const express = require("express");

const feedController = require("../controllers/feed");

const postValidation = require("../middleware/validators/feed");

const router = express.Router();

// GET /feed/posts
router.get("/posts", feedController.getPosts);

// POST /feed/post
router.post("/post", [postValidation], feedController.createPost);

module.exports = router;
