const Product = require("../models/product");
// const Cart = require("../models/cart");
// const Order = require("../models/order");

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
      const { cartItems, totalPrice } = result;

      res.render("shop/shop-cart", {
        pageTitle: "Your Cart | phoenix.com",
        path: "/cart",
        products: cartItems,
        items: cartItems.length,
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

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     pageTitle: "Checkout | phoenix.com",
//     path: "/checkout",
//   });
// };

// exports.postOrder = (req, res, next) => {
//   const address = req.body.address;
//   let fetchCart;
//   req.user
//     .getCart()
//     .then(cart => {
//       fetchCart = cart;
//       return cart.getProducts();
//     })
//     .then(products => {
//       return req.user
//         .createOrder({ address: address })
//         .then(order => {
//           return order.addProduct(
//             products.map(product => {
//               product.orderItem = {
//                 quantity: product.cartItem.quantity,
//               };
//               return product;
//             })
//           );
//         })
//         .catch(err => console.log(err));
//     })
//     .then(err => fetchCart.setProducts(null))
//     .then(result => {
//       res.redirect("/orders");
//     })
//     .catch(err => console.log(err));
// };

// exports.getOrders = (req, res, next) => {
//   req.user
//     .getOrders({ include: ["products"] })
//     .then(orders => {
//       res.render("shop/shop-orders", {
//         pageTitle: "My Orders | phoenix.com",
//         path: "/orders",
//         orders: orders,
//       });
//     })
//     .catch(err => console.log(err));
// };
