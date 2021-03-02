const MongoDb = require("mongodb");
const { getDb } = require("../util/database");
const formatRupiah = require("../util/formatRupiah");

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

  getCart() {
    const _db = getDb();
    const productIds = this.cart.items.map(i => i.productId);
    return _db
      .collection("products")
      .find({
        _id: {
          $in: productIds,
        },
      })
      .toArray()
      .then(products => {
        const cartItems = products.map(product => {
          const qty = this.cart.items.find(item => {
            return item.productId.toString() === product._id.toString();
          }).quantity;
          return {
            ...product,
            price: {
              unRupiah: +product.price,
              rupiah: formatRupiah(+product.price),
            },
            quantity: qty,
            total: formatRupiah(+product.price * qty),
          };
        });

        const totalPrice = cartItems.reduce((sum, i) => {
          return sum + +i.price.unRupiah * +i.quantity;
        }, 0);

        const totalItems = cartItems.reduce((sum, i) => {
          return sum + +i.quantity;
        }, 0);

        return {
          cartItems: cartItems,
          totalItems: totalItems,
          totalPrice: {
            num: +totalPrice,
            rupiah: formatRupiah(+totalPrice),
          },
        };
      })
      .catch(err => err);
  }

  deleteItemsFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });

    const _db = getDb();
    return _db
      .collection("users")
      .updateOne(
        { _id: new MongoDb.ObjectID(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder(address) {
    const _db = getDb();

    return this.getCart().then(cart => {
      const order = {
        user: {
          userId: MongoDb.ObjectID(this._id),
          name: this.username,
        },
        cart: cart,
        shipping: {
          address: address,
          zip: "27859",
        },
        creatAt: new Date(),
        total: cart.totalPrice?.rupiah,
      };

      return _db
        .collection("orders")
        .insertOne(order)
        .then(result => {
          this.cart = { items: [] };
          return _db
            .collection("users")
            .updateOne(
              { _id: new MongoDb.ObjectID(this._id) },
              { $set: { cart: { items: [] } } }
            );
        });
    });
  }

  getOrders() {
    const _db = getDb();
    return _db
      .collection("orders")
      .find({ "user.userId": new MongoDb.ObjectID(this._id) })
      .toArray()
      .then(result => {
        return result;
      })
      .catch(err => err);
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