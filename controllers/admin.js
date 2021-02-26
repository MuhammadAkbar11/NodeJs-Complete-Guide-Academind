const Product = require("../models/product");

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
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, price, description, imageUrl);
  product
    .save()
    .then(result => {
      res.redirect("/admin/products");
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
//   req.user
//     .getProducts({
//       where: {
//         id_product: prodId,
//       },
//     })
//     // Product.findByPk(prodId)
//     .then(products => {
//       const product = products[0];
//       if (!product) {
//         return res.redirect("/");
//       }
//       res.render("admin/admin-form-product", {
//         pageTitle: "Admin - Edit Product | phoenix.com ",
//         path: "/admin/edit-product",
//         editing: editMode,
//         product: product,
//       });
//     });
// };

// exports.postEditProducts = (req, res, next) => {
//   const prodId = req.body.productId;
//   const updatedTitle = req.body.title;
//   const updatedPrice = req.body.price;
//   const updatedImageUrl = req.body.imageUrl;
//   const updatedDescription = req.body.description;
//   Product.findByPk(prodId)
//     .then(product => {
//       product.title_product = updatedTitle;
//       product.price_product = updatedPrice;
//       product.desc_product = updatedDescription;
//       product.imgUrl_product = updatedImageUrl;
//       return product.save();
//     })
//     .then(result => {
//       console.log("Updated Product");
//       res.redirect("/admin/products");
//     })
//     .catch(err => console.log(err));
// };

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render("admin/admin-products", {
        prods: products,
        pageTitle: "Admin - Products | phoenix.com  💌  ",
        path: "/admin/products",
      });
    })
    .catch(err => console.log(err));
};
// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findByPk(prodId)
//     .then(product => {
//       // console.log(product);
//       return product.destroy();
//     })
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
