const { validationResult } = require("express-validator");
const errMessageValidation = require("../utils/errMessageValidation");

const PostModel = require("../models/postModel");

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: 1,
        title: "First Post",
        content: "This is the first post!",
        imageUrl: "images/empty.png",
        creator: {
          name: "Akbar",
        },
        createdAt: new Date(),
      },
    ],
  });
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
        post: result,
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
