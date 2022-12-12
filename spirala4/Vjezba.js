const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const Vjezba = sequelize.define("Vjezba", {
    //naziv: Sequelize.STRING,
    broj: Sequelize.INTEGER,
  });
  return Vjezba;
};
