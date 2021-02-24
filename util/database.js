const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("nodejs-complete-repeat", "root", "1234", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
