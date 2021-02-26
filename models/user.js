const MongoDb = require("mongodb");
const { getDb } = require("../util/database");

const ObjectId = MongoDb.ObjectID;
class UserModel {
  constructor(username, email, id, cart) {
    this.username = username;
    this.email = email;
    this._id = id;
    this.cart = cart;
  }

  save() {
    const _db = getDb();

    return _db
      .collection("users")
      .insertOne({
        username: this.username,
        email: this.email,
      })
      .then(res => res)
      .catch(err => err);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new MongoDb.ObjectID(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    const _db = getDb();

    return _db
      .collection("users")
      .updateOne(
        { _id: new MongoDb.ObjectID(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  static findById(userId) {
    const _db = getDb();

    return _db
      .collection("users")
      .find({ _id: new ObjectId(userId) })
      .next()
      .then(result => result)
      .catch(error => error);
  }
}

module.exports = UserModel;
