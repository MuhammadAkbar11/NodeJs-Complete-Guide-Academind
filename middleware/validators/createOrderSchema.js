const { checkSchema } = require("express-validator");

const createOrderValidator = checkSchema({
  name: {
    notEmpty: {
      errorMessage: "Required Field",
    },
    trim: true,
  },
  address: {
    notEmpty: {
      errorMessage: "Required Field",
    },
    trim: true,
  },
  city: {
    notEmpty: {
      errorMessage: "Required Field",
    },
    trim: true,
  },
  nameOnCard: {
    notEmpty: {
      errorMessage: "Required Field",
    },
    trim: true,
  },
  cardNumber: {
    notEmpty: {
      errorMessage: "Required Field",
    },
    isNumeric: {
      errorMessage: "Must be numbers",
    },
    trim: true,
  },
  expired: {
    notEmpty: {
      errorMessage: "Required Field",
    },

    isLength: {
      errorMessage: "must be a maximum of 5 characters",
      options: {
        max: 5,
      },
    },
    custom: {
      options: (value, { req }) => {
        const pattern = /^\d{2}\/\d{2}$/g;
        const isValid = pattern.test(value);
        if (!isValid) {
          throw new Error("Invalid ");
        }
        return true;
      },
    },
  },
  cvc: {
    notEmpty: {
      errorMessage: "Required Field",
    },
    isNumeric: {
      errorMessage: "Must be numbers",
    },
    isLength: {
      errorMessage: "must be a maximum of 3 characters",
      options: {
        max: 3,
      },
    },
    trim: true,
  },
});

module.exports = createOrderValidator;
