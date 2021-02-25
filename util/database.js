const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri =
  "mongodb+srv://akbar:akbar2001@bae2001.7m1a3.mongodb.net/phoenix-shop?retryWrites=true&w=majority";

let _db;

const mongoConnect = () => {
  return new Promise((resolve, reject) => {
    return MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      .then(client => {
        console.log("Connected!");
        _db = client.db();
        return resolve(client);
      })
      .catch(err => reject(err));
  });
};

const getDb = () => {
  if (_db) {
    return _db;
  }

  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
