const multer = require("multer");
const ProductModel = require("../models/productModel");
const formatRupiah = require("../util/formatRupiah");
const { validationResult } = require("express-validator");
const errMsgValidator = require("../util/errMsgValidator");
const fileHelper = require("../util/file");

exports.getProducts = (req, res, next) => {
  const flashdata = req.flash("flashdata");

  ProductModel.find()
    .then(products => {
      res.render("admin/admin-products", {
        prods: products,
        pageTitle: "Admin - Products | phoenix.com  💌  ",
        path: "/admin/products",
        flashdata: flashdata,
      });
    })
    .catch(err => console.log(err));
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/admin-form-product", {
    pageTitle: "Admin - Add Products | phoenix.com",
    path: "/admin/add-product",
    editing: false,
    errors: {},
    inputsValue: {
      title: "",
      price: "",
      description: "",
    },
  });
};

exports.generateProducts = (req, res, next) => {
  const generate = req.body.value;
  let data = [];
  for (let prod = 1; prod < generate; prod++) {
    // const element = array[prod];
    const id = 29 + prod;
    data.push({
      title: "Product-" + id,
      price: {
        num: 2000000,
        rupiah: formatRupiah(2000000),
      },
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam obcaecati quibusdam facere dolorum animi molestiae dolores velit fugiat porro explicabo?",
      imageUrl: "/uploads/images/products/empty.png",
      createdAt: new Date(),
      userId: req.user._id,
    });
  }

  ProductModel.insertMany(data)
    .then(result => {
      console.log(result);
      req.flash("flashdata", {
        type: "success",
        message: "Success adding new product",
      });
      res.redirect("/admin/products");
    })
    .catch(err => next(err));
};

exports.postAddProducts = (req, res, next) => {
  const title = req.body.title;
  const image = req.fileimg;
  const price = +req.body.price;
  const description = req.body.description;
  const userId = req.user._id;

  const errors = validationResult(req);

  if (image.type === "error") {
    errors.errors.push({
      value: "",
      msg: image.message,
      param: "image",
      location: "file",
    });
  }
  const errMsg = errMsgValidator(errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/admin-form-product", {
      pageTitle: "Admin - Add Products | phoenix.com",
      path: "/admin/add-product",
      editing: false,
      inputsValue: {
        ...req.body,
      },
      errors: errMsg,
    });
  }

  const insertData = {
    title: title,
    price: {
      num: price,
      rupiah: formatRupiah(price),
    },
    description: description,
    imageUrl: `/${image.data?.path}`,
    createdAt: new Date(),
    userId: userId,
  };
  const product = new ProductModel(insertData);
  product
    .save()
    .then(result => {
      req.flash("flashdata", {
        type: "success",
        message: "Success adding new product",
      });
      res.redirect("/admin/products");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/admin/admin-products");
  }

  const flashdata = req.flash("flashdata");

  const prodId = req.params.productId;
  ProductModel.findById(prodId).then(product => {
    if (!product) {
      return res.redirect("/admin/product");
    }

    res.render("admin/admin-form-product", {
      pageTitle: "Admin - Edit Product | phoenix.com ",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
      errors: req.flash("errors")[0],
      flashdata: flashdata,
    });
  });
};

exports.postEditProducts = (req, res, next) => {
  const prodId = req.body.productId;
  const inputTitle = req.body.title;
  const inputPrice = +req.body.price;
  const image = req.fileimg;
  const inputDescription = req.body.description.trim();

  const errors = validationResult(req);
  const errMsg = errMsgValidator(errors.array());
  if (!errors.isEmpty()) {
    req.flash("errors", {
      ...errMsg,
    });
    return res.redirect(`edit-product/${prodId}?edit=true`);
  }

  ProductModel.findById(prodId)
    .then(product => {
      let imagePath = product.imageUrl;

      if (image.data !== null) {
        fileHelper.deleteFile(product.imageUrl.substring(1));
        imagePath = `/${image.data?.path}`;
      }
      const updatedData = {
        title: inputTitle,
        price: {
          num: inputPrice,
          rupiah: formatRupiah(inputPrice),
        },
        description: inputDescription,
        imageUrl: imagePath,
      };

      return product.updateOne(
        {
          $set: { ...updatedData },
          $currentDate: {
            updateAt: {
              $type: "date",
            },
          },
        },
        { upsert: true }
      );
    })
    .then(result => {
      req.flash("flashdata", {
        type: "success",
        message: "Success update product",
      });
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  if (prodId.trim() === "") {
    req.flash("flashdata", {
      type: "error",
      message: "Failed to delete data!",
    });
  }

  ProductModel.findById(prodId)
    .then(product => {
      if (!product) {
        req.flash("flashdata", {
          type: "success",
          message: "Success deleting product",
        });
        res.redirect("/admin/products");
        return;
      }
      fileHelper.deleteFile(product.imageUrl.substring(1));
      return ProductModel.findByIdAndRemove(prodId);
    })
    .then(() => {
      req.flash("flashdata", {
        type: "success",
        message: "Success deleting product",
      });
      res.redirect("/admin/products");
    })
    .catch(err => {
      req.flash("flashdata", {
        type: "error",
        message: "Failed to delete data!",
      });
    });
};
