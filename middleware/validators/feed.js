const { checkSchema } = require("express-validator");

const postValidation = checkSchema({
  title: {
    trim: true,
    isLength: {
      errorMessage: "Title should be at least 10 characters long",
      options: {
        min: 10,
      },
    },
  },
  content: {
    trim: true,
    isLength: {
      errorMessage: "Content should be at least 10 characters long",
      options: {
        min: 5,
      },
    },
  },
});

module.exports = postValidation;
