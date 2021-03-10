const path = require("path");

const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const Csurf = require("csurf");
const flash = require("connect-flash");

const errorController = require("./controllers/error");
const UserModel = require("./models/userModel");

const MONGODB_URI = process.env.URL;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrufProtection = Csurf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
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
  multer({
    storage: fileStorage,
  }).single("image")
);

app.use(
  session({
    cookie: {
      expires: 24 * 60 * 60 * 7,
      maxAge: 24 * 60 * 60 * 365 * 1000,
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    unset: "destroy",
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrufProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  UserModel.findOne({
    email: req.session.user?.email,
  })
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
      throw new Error(err);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();

  if (req.user) {
    res.locals.user = req.user;
  } else {
    res.locals.user = null;
  }
  next();
});

app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);

app.use("/500", errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render("500", { pageTitle: "Something Error", path: "/500" });
});

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
