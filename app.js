const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const errorController = require("./controllers/error");
const sequelize = require("./util/database");

// models
const ProductModel = require("./models/product");
const UserModel = require("./models/user");
const CartModel = require("./models/cart");
const CartItemModel = require("./models/cartItem");
const OrderModel = require("./models/order");
const OrderItemModel = require("./models/orderItem");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const Order = require("./models/order");

app.use(bodyParser.urlencoded({ extended: false }));
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  UserModel.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5050;

// relasi antara tabel2
ProductModel.belongsTo(UserModel, { constraints: true, onDelete: "CASCADE" }); // satu produk mempunyai satu user
UserModel.hasMany(ProductModel); // user dapat memiliki banyak produk
UserModel.hasOne(CartModel); // seorang user mempunyai 1 cart
CartModel.belongsTo(UserModel); // cart dapat dimiliki oleh bbrap user
CartModel.belongsToMany(ProductModel, { through: CartItemModel }); // 1 cart dapt menampung banyak produk
ProductModel.belongsToMany(CartModel, { through: CartItemModel }); // 1 produk dapat mmpunyai banyak cart
OrderModel.belongsTo(UserModel);
UserModel.hasMany(Order);
Order.belongsToMany(ProductModel, { through: OrderItemModel });

sequelize
  // .sync({ force: true })
  .sync()
  .then(res => {
    return UserModel.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return UserModel.create({
        name: "Tzuyu",
        email: "Tzuyu@gmail.com",
      });
    }
    return user;
  })
  // .then(user => {
  //   user.createCart();
  // })
  .then(cart => {
    app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
  })
  .catch(err => {
    console.log(err);
  });
