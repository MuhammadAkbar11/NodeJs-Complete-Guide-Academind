const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const errorController = require("./controllers/error");
const { mongoConnect } = require("./util/database");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
// const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
// eslint-disable-nMongoDBConnect
app.use((req, res, next) => {
  // UserModel.findByPk(1)
  //   .then(user => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
// app.use(shopRoutes);

app.use(errorController.get404);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5050;

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
