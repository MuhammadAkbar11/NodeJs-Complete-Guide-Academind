const express = require("express");

const feedController = require("../controllers/feed");
const isAuth = require("../middleware/is-auth");
const postValidation = require("../middleware/validators/feed");

const router = express.Router();

// GET /feed/posts
router.get("/posts", isAuth, feedController.getPosts);

// POST /feed/post
router.post("/post", isAuth, [postValidation], feedController.createPost);

router.get("/post/:postId", feedController.getPost);

router.put("/post/:postId", feedController.updatePost);

router.delete("/post/:postId", feedController.deletePost);

module.exports = router;
