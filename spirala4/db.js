//
const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt21index", "root", "password", {
  host: "127.0.0.1",
  dialect: "mysql",
  logging: false,
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//import modela
db.vjezba = require("./Vjezba.js")(sequelize, Sequelize);
db.zadatak = require("./Zadatak.js")(sequelize, Sequelize);
db.student = require("./Student.js")(sequelize, Sequelize);
db.grupa = require("./Grupa.js")(sequelize, Sequelize);
//db.biblioteka = sequelize.import(__dirname + "/biblioteka.js");

//relacije
// Veza 1-n vise knjiga se moze nalaziti u biblioteci
db.vjezba.hasMany(db.zadatak, { as: "zadaciVjezbe" }, { onDelete: "CASCADE" });
db.grupa.hasMany(db.student, { as: "studentiGrupe" });

// Veza n-m autor moze imati vise knjiga, a knjiga vise autora
/*db.autorKnjiga = db.knjiga.belongsToMany(db.autor, {
  as: "autori",
  through: "autor_knjiga",
  foreignKey: "knjigaId",
});
db.autor.belongsToMany(db.knjiga, {
  as: "knjige",
  through: "autor_knjiga",
  foreignKey: "autorId",
});
*/
module.exports = db;
//
