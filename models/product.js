const { getDb } = require("../util/database");

class Product {
  constructor(title, price, description, imgUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imgUrl = imgUrl;
  }

  save() {}
}

const Product = sequelize.define("product", {
  id_product: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title_product: Sequelize.STRING,
  price_product: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imgUrl_product: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  desc_product: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Product;
