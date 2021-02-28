const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    num: {
      type: Number,
      required: true,
    },
    rupiah: String,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
  },
  updateAt: {
    type: Date,
  },
});

module.exports = mongoose.model("ProductModel", productSchema, "products");
