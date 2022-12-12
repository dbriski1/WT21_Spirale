const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const Zadatak = sequelize.define("Zadatak", {
    //naziv: Sequelize.STRING,
    broj: Sequelize.INTEGER,
  });
  return Zadatak;
};
