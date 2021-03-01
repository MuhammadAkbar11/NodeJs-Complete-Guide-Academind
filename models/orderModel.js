const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderNumber: {
    type: String,
    required: true,
  },
  user: {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "UserModel",
    },
  },
  products: [
    {
      product: {
        type: Object,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      subtotal: {
        num: {
          type: Number,
          required: true,
        },
        rupiah: {
          type: String,
          required: true,
        },
      },
    },
  ],
  shipping: {
    method: {
      type: String,
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      zip: {
        type: String,
        required: true,
      },
    },
  },
  createdAt: {
    type: Date,
    required: true,
  },
  total: {
    num: {
      type: Number,
      required: true,
    },
    rupiah: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model("OrderModel", orderSchema, "orders");
