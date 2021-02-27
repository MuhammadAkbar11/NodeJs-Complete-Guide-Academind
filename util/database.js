const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri =
  "mongodb+srv://akbar:akbar2001@bae2001.7m1a3.mongodb.net/phoenix-shop?retryWrites=true&w=majority&ssl=true";

const url2 =
  "mongodb://phoenix:phoenix2001@bae2001-shard-00-00.7m1a3.mongodb.net:27017,bae2001-shard-00-01.7m1a3.mongodb.net:27017,bae2001-shard-00-02.7m1a3.mongodb.net:27017/phoenix-shop?ssl=true&replicaSet=atlas-kyz0lz-shard-0&authSource=admin&retryWrites=true&w=majority";

let _db;

const mongoConnect = () => {
  return new Promise((resolve, reject) => {
    return MongoClient.connect(url2, {
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
