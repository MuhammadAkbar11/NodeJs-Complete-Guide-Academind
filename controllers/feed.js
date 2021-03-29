const { validationResult } = require("express-validator");
const errMessageValidation = require("../utils/errMessageValidation");

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
  console.log(errMessage);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: "Validation failed",
      errors: errMessage,
    });
  }

  return res.status(201).json({
    message: "Post created successfully!",
    post: {
      _id: new Date().toISOString(),
      title: title,
      content: content,
      imageUrl: "images/empty.png",
      creator: {
        name: "Akbar",
      },
      createdAt: new Date(),
    },
  });
};
