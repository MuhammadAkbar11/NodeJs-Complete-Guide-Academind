const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const incNumbersSchema = new Schema({
  orderNumber: {
    type: Number,
    required: true,
  },
});

incNumbersSchema.methods.getOrderNumber = function () {
  console.log(this.orderNumber);
};

module.exports = mongoose.model(
  "IncNumbersModel",
  incNumbersSchema,
  "incNumbers"
);
