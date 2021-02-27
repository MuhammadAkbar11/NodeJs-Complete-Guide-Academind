const mongodb = require("mongodb");
const { getDb } = require("../util/database");

class Product {
  constructor(id, title, price, description, imgUrl) {
    this.id = id;
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
      .then(res => res)
      .catch(err => console.log(err));
  }

  update() {
    const updated = {
      title: this.title,
      price: this.price,
      description: this.description,
      imgUrl: this.imgUrl,
    };

    const db = getDb();

    return db
      .collection("products")
      .updateOne(
        {
          _id: new mongodb.ObjectID(this.id),
        },
        {
          $set: {
            ...updated,
          },
        }
      )
      .then(result => result)
      .catch(err => err);
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

  static deleteById(prodId) {
    const db = getDb();

    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectID(prodId) })
      .then(result => result)
      .catch(err => err);
  }
}

module.exports = Product;
