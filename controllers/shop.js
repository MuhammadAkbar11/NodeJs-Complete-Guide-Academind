const ProductModel = require("../models/productModel");
const OrderModel = require("../models/orderModel");
const IncNumbersModel = require("../models/incNumbers");

const formatRupiah = require("../util/formatRupiah");

exports.getProducts = (req, res, next) => {
  ProductModel.find()
    .then(products => {
      res.render("shop/shop-products-list", {
        prods: products,
        pageTitle: "All Products | phoenix.com",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
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
        isAuthenticated: req.session.isLoggedIn,
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
        isAuthenticated: req.session.isLoggedIn,
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

      res.render("shop/shop-cart", {
        pageTitle: "Your Cart | phoenix.com",
        path: "/cart",
        isAuthenticated: req.session.isLoggedIn,
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

  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

exports.postOrder = async (req, res, next) => {
  const shippingMethod = req.body.method.trim();

  const getOrderNumber = await IncNumbersModel.findOne();

  let shippingMothodPrice = 7000;

  switch (shippingMethod) {
    case "fast":
      shippingMothodPrice = 15000;
      break;
    case "express":
      shippingMothodPrice = 25000;
      break;
    default:
      shippingMothodPrice = 7000;
      break;
  }

  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const { cart } = user;
      const products = cart.items.map(item => {
        return {
          product: { ...item.productId._doc },
          quantity: item.quantity,
          subtotal: {
            num: item.total,
            rupiah: formatRupiah(item.total),
          },
        };
      });
      const getTotalPrice = cart.items.reduce((sum, i) => {
        return sum + +i.productId.price.num * +i.quantity;
      }, 0);

      const totalPrice = {
        num: getTotalPrice + +shippingMothodPrice,
        rupiah: formatRupiah(getTotalPrice + +shippingMothodPrice),
      };

      const orderModel = new OrderModel({
        orderNumber: `ORDER-${getOrderNumber.orderNumber}`,
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: products,
        shipping: {
          method: shippingMethod,
          address: {
            street: "jln Sudirman, No 45",
            city: "Jakarta",
            zip: "254546",
          },
        },
        createdAt: new Date(),
        total: totalPrice,
      });

      return orderModel.save();
    })
    .then(() => {
      return IncNumbersModel.updateOne(
        {},
        {
          $inc: {
            orderNumber: 1,
          },
        }
      );
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  OrderModel.find({
    "user.userId": req.user._id,
  })
    .then(orders => {
      return res.render("shop/shop-orders", {
        pageTitle: "My Orders | phoenix.com",
        path: "/orders",
        isAuthenticated: req.session.isLoggedIn,
        orders: orders,
      });
    })
    .catch(err => console.log(err));
};
