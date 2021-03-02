const path = require("path");

const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");
const UserModel = require("./models/userModel");

const MONGODB_URI = process.env.URL;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "phoenix secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  UserModel.find({
    email: req.session?.user?.email,
  })
    .then(user => {
      console.log(user);
      req.user = user[0];
      next();
    })
    .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000;

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(PORT, () => {
      console.log("listening... PORT " + PORT);
    });
  })
  .catch(err => {
    console.log(err);
  });
