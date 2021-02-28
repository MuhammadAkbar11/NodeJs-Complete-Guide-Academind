const ProductModel = require("../models/productModel");
const formatRupiah = require("../util/formatRupiah");

exports.getProducts = (req, res, next) => {
  ProductModel.find()
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

  ProductModel.findById(prodId)
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
  ProductModel.find()
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
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const { cart } = user;
      const products = cart.items.map(item => {
        return { ...item._doc, total: formatRupiah(item.total) };
      });
      const getTotalPrice = cart.items.reduce((sum, i) => {
        return sum + +i.productId.price.num * +i.quantity;
      }, 0);

      const totalPrice = {
        num: getTotalPrice,
        rupiah: formatRupiah(getTotalPrice),
      };

      const totalItems = cart.items.reduce((sum, i) => {
        return sum + +i.quantity;
      }, 0);
      // const { cartItems, totalPrice, totalItems } = result;

      console.log(products);
      res.render("shop/shop-cart", {
        pageTitle: "Your Cart | phoenix.com",
        path: "/cart",
        products: products,
        items: totalItems,
        totalPrice: totalPrice,
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  ProductModel.findById(prodId)
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

  console.log(prodId);

  req.user
    .removeFromCart(prodId)
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
