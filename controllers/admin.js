const ProductModel = require("../models/productModel");
const formatRupiah = require("../util/formatRupiah");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/admin-form-product", {
    pageTitle: "Admin - Add Products | phoenix.com",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProducts = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = +req.body.price;
  const description = req.body.description;

  const insertData = {
    title: title,
    price: {
      num: price,
      rupiah: formatRupiah(price),
    },
    description: description,
    imageUrl: imageUrl,
    createdAt: new Date(),
  };
  const product = new ProductModel(insertData);

  product
    .save()
    .then(result => {
      res.redirect("/admin/add-product");
      console.log("new data has been created!!");
      console.log(result);
    })
    .catch(err => console.log(err));
};

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit;
//   if (!editMode) {
//     return res.redirect("/admin/admin-products");
//   }

//   const prodId = req.params.productId;
//   Product.findById(prodId).then(product => {
//     if (!product) {
//       return res.redirect("/admin/product");
//     }
//     res.render("admin/admin-form-product", {
//       pageTitle: "Admin - Edit Product | phoenix.com ",
//       path: "/admin/edit-product",
//       editing: editMode,
//       product: product,
//     });
//   });
// };

// exports.postEditProducts = (req, res, next) => {
//   const prodId = req.body.productId;
//   const updatedTitle = req.body.title;
//   const updatedPrice = req.body.price;
//   const updatedImageUrl = req.body.imageUrl;
//   const updatedDescription = req.body.description;

//   const ProductM = new Product(
//     prodId,
//     updatedTitle,
//     updatedPrice,
//     updatedDescription,
//     updatedImageUrl
//   );
//   ProductM.update(prodId)
//     .then(result => {
//       res.redirect("/admin/products");
//     })
//     .catch(err => console.log(err));
// };

// exports.getProducts = (req, res, next) => {
//   Product.fetchAll()
//     .then(products => {
//       res.render("admin/admin-products", {
//         prods: products,
//         pageTitle: "Admin - Products | phoenix.com  💌  ",
//         path: "/admin/products",
//       });
//     })
//     .catch(err => console.log(err));
// };

// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;

//   Product.deleteById(prodId)
//     .then(() => {
//       res.redirect("/admin/products");
//     })
//     .catch(err => console.log(err));
// };

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
