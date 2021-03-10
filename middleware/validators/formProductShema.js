const { checkSchema } = require("express-validator");

const formProductValidator = checkSchema({
  title: {
    notEmpty: {
      errorMessage: "Required Field",
    },
    trim: true,
  },
  price: {
    notEmpty: {
      errorMessage: "Required Field",
    },
    isNumeric: {
      errorMessage: "Must be numbers",
    },
    trim: true,
  },
  // imageUrl: {
  //   notEmpty: {
  //     errorMessage: "Required Field",
  //   },
  //   isURL: {
  //     errorMessage: "Invalid Url",
  //   },
  //   trim: true,
  // },
  description: {
    notEmpty: {
      errorMessage: "Required Field",
    },

    isLength: {
      errorMessage: "Description should be at least 10 characters long",
      options: {
        min: 10,
      },
    },
    trim: true,
  },
});

module.exports = formProductValidator;
