const mongodb = require("mongodb");
const { getDb } = require("../util/database");

class Product {
  constructor(title, price, description, imgUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imgUrl = imgUrl;
  }

  save() {
    const db = getDb();
    return db
      .collection("products")
      .insertOne({
        title: this.title,
        price: this.price,
        description: this.description,
        imgUrl: this.imgUrl,
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));
  }

  static findById(id) {
    const db = getDb();

    return db
      .collection("products")
      .find({ _id: mongodb.ObjectID(id) })
      .next()
      .then(result => {
        return result;
      })
      .catch(err => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then(res => {
        return res;
      })
      .catch(err => console.log(err));
  }
}

module.exports = Product;
