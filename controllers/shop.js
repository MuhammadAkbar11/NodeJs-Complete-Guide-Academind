const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render("shop/shop-products-list", {
        prods: products,
        pageTitle: "All Products | phoenix.com",
        path: "/products",
      });
    })
    .catch(err => console.log(err));
};

exports.getDetailProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then(product => {
      res.render("shop/shop-detail", {
        product: product,
        pageTitle: product.title + " | phoenix.com",
        path: "/products",
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Home | phoenix.com",
        path: "/",
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(result => {
      const { cartItems, totalPrice, totalItems } = result;

      res.render("shop/shop-cart", {
        pageTitle: "Your Cart | phoenix.com",
        path: "/cart",
        products: cartItems,
        items: totalItems,
        totalPrice: totalPrice,
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .deleteItemsFromCart(prodId)
    .then(result => {
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let address = req.body.address;

  if (address === "") {
    address = "Bekasi";
  }

  req.user
    .addOrder(address)
    .then(result => {
      res.redirect("/orders");
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      return res.render("shop/shop-orders", {
        pageTitle: "My Orders | phoenix.com",
        path: "/orders",
        orders: orders,
      });
    })
    .catch(err => console.log(err));
};
