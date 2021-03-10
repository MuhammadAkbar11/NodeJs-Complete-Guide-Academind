const express = require("express");

const adminController = require("../controllers/admin");
const router = express.Router();

const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");
const formProductValidator = require("../middleware/validators/formProductShema");

// router.get("/basic-page", adminController.getBasicPage);

//=> /admin/products => GET
router.get("/products", isAuth, isAdmin, adminController.getProducts);

//=> /admin/add-product => GET
router.get("/add-product", isAuth, isAdmin, adminController.getAddProduct);
router.post(
  "/generate-productss",
  isAuth,
  isAdmin,
  adminController.generateProducts
);
//=> /admin/add-product => POST
router.post(
  "/add-product",
  [formProductValidator],
  isAuth,
  isAdmin,
  adminController.postAddProducts
);

router.get(
  "/edit-product/:productId",
  isAuth,
  isAdmin,
  adminController.getEditProduct
);

router.post(
  "/edit-product/",
  [formProductValidator],
  isAuth,
  isAdmin,
  adminController.postEditProducts
);

router.post(
  "/delete-product/",
  isAuth,
  isAdmin,
  adminController.postDeleteProduct
);

module.exports = router;
