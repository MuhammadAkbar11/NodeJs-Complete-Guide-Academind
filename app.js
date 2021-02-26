const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const mongoConnect = require("./util/database").mongoConnect;

const UserModel = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));
// eslint-disable-nMongoDBConnect
app.use((req, res, next) => {
  UserModel.findById("6038aa625ed7c15820af6a2d")
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
const PORT = process.env.PORT || 1996;

mongoConnect()
  .then(result => {
    // console.log("connected to mongodb", result);
    app.listen(PORT, () => {
      console.log("listening... PORT " + PORT);
    });
  })
  .catch(err => {
    console.log(err, "errors");
  });
