// const path = require('path');

const express = require("express");

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");
const createOrderValidator = require("../middleware/validators/createOrderSchema");

const router = express.Router();

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/products/:productId", shopController.getDetailProduct);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);
router.get("/checkout", isAuth, shopController.checkout);
router.post(
  "/create-order",
  [createOrderValidator],
  isAuth,
  shopController.postOrder
);
router.get("/orders", isAuth, shopController.getOrders);

router.get("/order/:orderId", isAuth, shopController.getInvoice);

module.exports = router;
