const fs = require("fs");
const path = require("path");

const PDFdocument = require("pdfkit");

const ProductModel = require("../models/productModel");
const OrderModel = require("../models/orderModel");
const IncNumbersModel = require("../models/incNumbers");

const formatRupiah = require("../util/formatRupiah");
const { validationResult } = require("express-validator");
const errMsgValidator = require("../util/errMsgValidator");

const PRODUCT_PER_PAGE = 8;

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
    .catch(err => res.redirect("/500"));
};

exports.getIndex = (req, res, next) => {
  let page = +req.query.page || 1;

  let currentPage;
  let totalItems;

  currentPage = page;

  ProductModel.find()
    .countDocuments()
    .then(productsCount => {
      totalItems = productsCount;
      return ProductModel.find()
        .skip((currentPage - 1) * PRODUCT_PER_PAGE)
        .limit(PRODUCT_PER_PAGE);
    })
    .then(products => {
      res.render("shop/index", {
        prods: products,
        currentPage: currentPage,
        totalProducts: totalItems,
        hasNextPage: PRODUCT_PER_PAGE * +currentPage < totalItems,
        hasPreviousPage: currentPage > 1,
        lastPage: Math.ceil(totalItems / PRODUCT_PER_PAGE),
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
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

exports.checkout = async (req, res, next) => {
  const shippingMethod = req.query.method;

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

  const flashData = req.flash("flashData")[0];

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
        num: getTotalPrice + +shippingMothodPrice,
        rupiah: formatRupiah(getTotalPrice + +shippingMothodPrice),
      };

      const totalItems = cart.items.reduce((sum, i) => {
        return sum + +i.quantity;
      }, 0);

      res.render("shop/checkout", {
        pageTitle: "Checkout | phoenix.com",
        path: "/checkout",
        products: products,
        items: totalItems,
        shippingMethod: shippingMethod,
        shippingPrice: formatRupiah(shippingMothodPrice),
        totalPrice: totalPrice,
        errors: flashData?.errors,
        inputsValue: flashData?.inputs,
        // inputsValue: reqBody,
      });
    })
    .catch(err => console.log(err));
};

exports.postOrder = async (req, res, next) => {
  const {
    shippingMethod,
    name,
    address,
    city,
    nameOnCard,
    cardNumber,
    expired,
    cvc,
  } = req.body;

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

  const errors = validationResult(req);

  const errMsg = errMsgValidator(errors.array());
  if (!errors.isEmpty()) {
    req.flash("flashData", {
      errors: errMsg,
      inputs: req.body,
    });
    res.redirect("checkout?method=" + shippingMethod);
    return;
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
          email: req.user.email,
          name: name,
          userId: req.user,
        },
        products: products,
        shipping: {
          method: shippingMethod,
          address: {
            street: address,
            city: city,
            zip: "12345",
          },
        },
        payments: {
          nameOnCard: nameOnCard,
          cardNumber: cardNumber,
          expired: expired,
          cvc: cvc,
        },
        status: "process",
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
        orders: orders,
      });
    })
    .catch(err => console.log(err));
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  OrderModel.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error("No order found!"));
      }

      if (order.user.userId.toString() !== req.user._id.toString()) {
        req.flash("flashdata", {
          type: "error",
          message: "Unauthorized",
        });
        return res.redirect("/login");
      }
      const invoiceName = `Invoice-${orderId}.pdf`;
      const invoicePath = path.join("data", "invoices", invoiceName);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );
      const pdfDoc = new PDFdocument();
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      pdfDoc.fontSize(26).text("Invoince");

      order.products.forEach(prod => {
        pdfDoc
          .fontSize(16)
          .text(prod.product.title + " - " + prod.quantity, {});
      });

      pdfDoc.end();
    })
    .catch(err => next(err));
};
