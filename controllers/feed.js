const { validationResult } = require("express-validator");
const errMessageValidation = require("../utils/errMessageValidation");

const PostModel = require("../models/postModel");

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await PostModel.find();
    return res.status(200).json({
      message: "Fetched posts successfully ",
      posts: posts,
    });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong";
    }
    next(err);
  }
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db

  const errors = validationResult(req);

  const errMessage = errMessageValidation(errors.array());
  if (!errors.isEmpty()) {
    const error = new Error();
    error.message = "Validation failed , entered data is incorrect";
    error.statusCode = 422;
    error.validationMessage = errMessage;
    throw error;
  }

  const postModel = new PostModel({
    title: title,
    content: content,
    imageUrl: "posts/empty.png",
    creator: {
      name: "Akbar",
    },
  });

  postModel
    .save()
    .then(result => {
      return res.status(201).json({
        status: "success",
        message: "Post created successfully!",
        post: {
          ...result,
        },
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "Something went wrong";
      }
      next(err);
    });
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await PostModel.findById(postId);
    const imageUrl = `${req.protocol}://${req.get("host")}/${post.imageUrl}`;

    post.imageUrl = imageUrl;

    return res.status(200).json({
      post: post,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong";
    }

    next(err);
  }
};
