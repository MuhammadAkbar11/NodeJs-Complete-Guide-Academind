const ProductModel = require("../models/productModel");
const formatRupiah = require("../util/formatRupiah");

exports.getProducts = (req, res, next) => {
  ProductModel.find()
    .then(products => {
      res.render("admin/admin-products", {
        prods: products,
        pageTitle: "Admin - Products | phoenix.com  💌  ",
        path: "/admin/products",
        isAuthenticated: req.isLoggendIn,
        csrfToken: req.csrfToken(),
      });
    })
    .catch(err => console.log(err));
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/admin-form-product", {
    pageTitle: "Admin - Add Products | phoenix.com",
    path: "/admin/add-product",
    isAuthenticated: req.isLoggendIn,
    editing: false,
    csrfToken: req.csrfToken(),
  });
};

exports.postAddProducts = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = +req.body.price;
  const description = req.body.description;
  const userId = req.user._id;

  const insertData = {
    title: title,
    price: {
      num: price,
      rupiah: formatRupiah(price),
    },
    description: description,
    imageUrl: imageUrl,
    createdAt: new Date(),
    userId: userId,
  };
  const product = new ProductModel(insertData);

  product
    .save()
    .then(result => {
      res.redirect("/admin/products");
      console.log("new data has been created!!");
    })
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/admin/admin-products");
  }

  const prodId = req.params.productId;
  ProductModel.findById(prodId).then(product => {
    if (!product) {
      return res.redirect("/admin/product");
    }
    res.render("admin/admin-form-product", {
      pageTitle: "Admin - Edit Product | phoenix.com ",
      path: "/admin/edit-product",
      editing: editMode,
      isAuthenticated: req.isLoggendIn,
      product: product,
      csrfToken: req.csrfToken(),
    });
  });
};

exports.postEditProducts = (req, res, next) => {
  const prodId = req.body.productId;
  const inputTitle = req.body.title;
  const inputPrice = +req.body.price;
  const inputImageUrl = req.body.imageUrl;
  const inputDescription = req.body.description;

  ProductModel.findById(prodId)
    .then(product => {
      const updatedData = {
        title: inputTitle,
        price: {
          num: inputPrice,
          rupiah: formatRupiah(inputPrice),
        },
        description: inputDescription,
        imageUrl: inputImageUrl,
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
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  ProductModel.findByIdAndRemove(prodId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

// // basic page

// exports.getBasicPage = (req, res, next) => {
//   req.user
//     .getProducts()
//     .then(products => {
//       res.render("admin/admin-basic-page", {
//         pageTitle: "Admin - Basic Page | phoenix.com  💌  ",
//         path: "/admin/basic-page",
//       });
//     })
//     .catch(err => console.log(err));
// };
