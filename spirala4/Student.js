const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const Student = sequelize.define("Student", {
    ime: Sequelize.STRING,
    prezime: Sequelize.STRING,
    index: Sequelize.STRING,
    grupa: Sequelize.STRING,
    //broj: Sequelize.INTEGER,
  });
  return Student;
};
