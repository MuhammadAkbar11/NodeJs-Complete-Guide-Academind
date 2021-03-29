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
    return res.status(422).json({
      status: false,
      message: "Validation failed",
      errors: errMessage,
    });
  }

  const postModel = new PostModel({
    title: title,
    content: content,
    imageUrl: "images/empty.png",
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
    .catch(err => console.log(err));
};
