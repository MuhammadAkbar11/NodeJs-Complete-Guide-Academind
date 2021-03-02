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
  // const isLoggendIn = req.get("Cookie").split(";")[1].split("=")[1];
  UserModel.findById("603ba9308b492851e444517b")
    .then(user => {
      req.user = user;
      // req.isLoggendIn = isLoggendIn;
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
    UserModel.findOne().then(user => {
      if (!user) {
        const user = new UserModel({
          name: "D U B U",
          email: "dubu@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(PORT, () => {
      console.log("listening... PORT " + PORT);
    });
  })
  .catch(err => {
    console.log(err);
  });
