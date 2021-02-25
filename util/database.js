const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri =
  "mongodb+srv://akbar:akbar2001@bae2001.7m1a3.mongodb.net/phoenix-shop?retryWrites=true&w=majority";

const mongoConnect = () => {
  return new Promise((resolve, reject) => {
    return MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      .then(client => {
        return resolve(client);
      })
      .catch(err => reject(err));
  });
};

module.exports = mongoConnect;
