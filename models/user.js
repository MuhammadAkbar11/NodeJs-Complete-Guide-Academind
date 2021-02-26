const MongoDb = require("mongodb");
const { getDb } = require("../util/database");

const ObjectId = MongoDb.ObjectID;
class UserModel {
  constructor(username, email) {
    this.username = username;
    this.email = email;
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

  static findById(userId) {
    const _db = getDb();

    return _db
      .collection("users")
      .findOne({ id: new ObjectId(userId) })
      .next()
      .then(result => result)
      .catch(error => error);
  }
}

module.exports = UserModel;
