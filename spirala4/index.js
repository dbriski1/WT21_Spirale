//
const db = require("./db.js");
//
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const path = require("path");
const { get } = require("express/lib/response");

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(express.static(path.join(__dirname + "/public/html/")));
app.use(express.static(path.join(__dirname + "/public/css/")));
app.use(express.static(path.join(__dirname + "/public/js/")));
app.use(express.static(path.join(__dirname + "/public/images/")));
//app.use(express.static(path.join(__dirname + "/db")));

app.use(bodyParser.urlencoded({ extended: true }));
/////////////////////////////

app.put("/student/:index", function (req, res) {
  // console.log(req.url.substring(9, req.url.length));
  let index = req.url.substring(9, req.url.length);
  const tijelo = req.body;
  //let brVjezbi = parseInt(tijelo["brojVjezbi"]);
  let nazivGrupePoslani = tijelo["grupa"];
  let z = 0;
  let pronadjen = false;
  db.student.findAll({}).then(function (studentii) {
    if (studentii.length == 0)
      return res.json({
        status: "Student sa indexom " + index + " ne postoji",
      });
    let size = studentii.length;
    studentii.forEach((student) => {
      z++;
      if (student.index.localeCompare(index) == 0) {
        pronadjen = true;
        db.grupa.findAll({}).then(function (grupee) {
          let velicinaGrupee = grupee.length;
          let brojac = 0;
          let uslo = false;
          grupee.forEach((grupe) => {
            brojac++;
            if (
              grupe.naziv.localeCompare(nazivGrupePoslani) == 0 &&
              uslo == false
            ) {
              uslo = true;
              grupe.addStudentiGrupe(student);
              // student.setGrupa("4");
              db.student
                .update(
                  { grupa: nazivGrupePoslani },
                  { where: { index: student.index } }
                )
                .then(
                  res.json({
                    status: "Promjenjena grupa studentu " + index,
                  })
                );
            }
            if (brojac == velicinaGrupee && uslo == false) {
              ////////////////////////////////////
              db.grupa.create({ naziv: nazivGrupePoslani }).then(function (b) {
                b.setStudentiGrupe([student]); //.then(function () {
                db.student
                  .update(
                    { grupa: nazivGrupePoslani },
                    { where: { index: student.index } }
                  )
                  .then(
                    res.json({
                      status: "Promjenjena grupa studentu " + index,
                    })
                  );
                // });
              });
            }
          });
        });
      }
      if (z == size) {
        if (pronadjen == false)
          return res.json({
            status: "Student sa indexom " + index + " ne postoji",
          });
      }
    });
  });
});
/////////////////////////////////
app.get("/vjezbe/", function (req, res) {
  let i = 0;
  let j = 0;
  let objekatPovratni = {
    brojVjezbi: 0,
    brojZadataka: [],
  };

  let z = 0;
  let size;
  let Niz = new Array();
  db.vjezba.findAll({}).then(function (vjezbee) {
    size = vjezbee.length; //
    for (let i = 0; i < size; i++) {
      Niz[i] = 0;
    }
    vjezbee.forEach((vjezbe) => {
      i++;

      vjezbe.getZadaciVjezbe().then(function (resSet) {
        //  console.log(vjezbe.broj());
        z++;
        resSet.forEach((zadaci) => {
          Niz[vjezbe.broj - 1] = Niz[vjezbe.broj - 1] + 1;
          let a = vjezbe.broj - 1;
          // console.log(Niz);
          // console.log(zadaci.broj);
          j++;
        });
        //objekatPovratni.brojZadataka.push(j);
        j = 0;
        if (size == z) {
          objekatPovratni.brojZadataka = Niz;
          objekatPovratni.brojVjezbi = i;
          return res.json(objekatPovratni);
        }
      });
    });
  });
});

app.post("/vjezbe/", function (req, res) {
  const tijelo = req.body;
  let brVjezbi = parseInt(tijelo["brojVjezbi"]);
  let objekat = {
    brojVjezbi: brVjezbi,
    brojZadataka: [],
  };
  let greska = {
    status: "error",
    data: "Pogrešan parametar ",
  };
  let brZadataka = tijelo["brojZadataka"];
  let porukaZadaci = "";

  for (let i = 0; i < brZadataka.length; i++) {
    if (brZadataka[i] > 10 || brZadataka[i] < 0) {
      if (porukaZadaci.localeCompare("") != 0) {
        porukaZadaci += ",";
      }
      porukaZadaci += "z" + i;
    }
  }
  if (
    brVjezbi < 1 ||
    brVjezbi > 15 ||
    porukaZadaci.localeCompare("") != 0 ||
    brVjezbi != brZadataka.length
  ) {
    let prvi = false;
    let drugi = false;
    let poruka = "";
    if (brVjezbi < 1 || brVjezbi > 15) {
      poruka += "brojVjezbi";
      prvi = true;
    }
    if (prvi != true && brZadataka.length != brVjezbi) {
      poruka += "brojZadataka";
      drugi = true;
    }
    if (porukaZadaci.localeCompare("") != 0) {
      if (prvi == true || drugi == true) {
        poruka += ",";
      }
      poruka += porukaZadaci;
    }
    greska.data += poruka;
    res.json(greska);
  } else {
    //db.zadatak.truncate().then(function () {
    // db.zadatak.sequelize.sync({ force: true }).then(function () {
    // db.sequelize.sync({ force: true }).then(function () {
    db.sequelize.sync().then(function () {
      db.zadatak.destroy({ truncate: { cascade: true } }).then(function () {
        db.vjezba.destroy({ truncate: { cascade: true } }).then(function () {
          for (let i = 1; i < brVjezbi + 2; i++) {
            if (i == brVjezbi + 1) {
              //console.log("kraj");

              return res.json(objekat);
              //process.exit();
            } else {
              inicializacija(i).then(function () {
                console.log(
                  "Gotovo kreiranje tabela i ubacivanje pocetnih podataka!"
                );
                //process.exit();
              });
            }
          }
        });
      });
    });
    function inicializacija(parametar) {
      var zadaciListaPromisea = [];
      var vjezbeListaPromisea = [];
      var Lista = [];
      return new Promise(function (resolve, reject) {
        for (let j = 0; j < brZadataka[parametar - 1]; j++) {
          let brojj = j + 1;
          zadaciListaPromisea.push(db.zadatak.create({ broj: brojj }));
          //zadaciListaPromisea.push(db.zadatak.create({ broj: 2 }));
        }
        Promise.all(zadaciListaPromisea)
          .then(function (zadaci) {
            for (let j = 0; j < brZadataka[parametar - 1]; j++) {
              let brojj = j + 1;
              Lista.push(
                zadaci.filter(function (a) {
                  return a.broj === brojj;
                })[0]
              );
            }
            vjezbeListaPromisea.push(
              db.vjezba.create({ broj: parametar }).then(function (b) {
                return b
                  .setZadaciVjezbe(/*[zadatak1, zadatak2]*/ Lista)
                  .then(function () {
                    return new Promise(function (resolve, reject) {
                      resolve(b);
                    });
                  });
              })
            );
            Promise.all(vjezbeListaPromisea)
              .then(function (b) {
                resolve(b);
              })
              .catch(function (err) {
                console.log("Vjezbe greska " + err);
              });
          })
          .catch(function (err) {
            console.log("Zadaci greska " + err);
          });
      });
    }
  }
});
///////////////////// PRVI POST
app.post("/student", function (req, res) {
  const tijelo = req.body;
  let ime = tijelo["ime"];
  let prezime = tijelo["prezime"];
  let index = tijelo["index"];
  let grupa = tijelo["grupa"];
  let postojiUBazi = false;
  let z = 0;
  let size = 1;
  db.sequelize.sync().then(function () {
    db.student.findAll({}).then(function (studentii) {
      size = studentii.length; //
      ///////
      granica = studentii.length;
      if (granica == 0) granica = 1;
      for (let f = 0; f < granica; f++) {
        ////////
        //studentii.forEach((student) => {
        z++;
        if (size != 0) {
          if (studentii[f].index === index) {
            postojiUBazi = true;
          }
        }
        if (z == size || size == 0) {
          if (postojiUBazi == true) {
            return res.json({
              status: "Student sa indexom " + index + " već postoji!",
            });
          } else {
            let studentiLista = [];
            studentiLista.push(
              db.student.create({
                ime: ime,
                prezime: prezime,
                index: index,
                grupa: grupa,
              })
            );
            let nazivGrupe = grupa;

            Promise.all(studentiLista).then(function (studentii) {
              var student1 = studentii.filter(function (a) {
                return a.index === a.index;
              })[0];
              db.grupa.findAll({}).then(function (grupee) {
                let velicinaGrupe = grupee.length;
                let x = 0;
                granica2 = grupee.length;
                if (granica2 == 0) granica2 = 1;
                for (let f = 0; f < granica2; f++) {
                  //////////////////////////////////////////////////////////////////////////
                  //grupee.forEach((vjezbe) => {
                  x++;
                  //console.log("x:", x);
                  //console.log("y:", velicinaGrupe);
                  //console.log(x);
                  if (grupee.length != 0) {
                    if (grupee[f].naziv === grupa) {
                      grupee[f].addStudentiGrupe(student1);
                      return res.json({
                        status: "Kreiran student!",
                      });
                    }
                  }
                  if (x == velicinaGrupe || grupee.length == 0) {
                    //console.log("uslo");
                    let grupeListaPromisea = [];
                    grupeListaPromisea.push(
                      db.grupa.create({ naziv: nazivGrupe }).then(function (b) {
                        //console.log("slo");
                        return b.setStudentiGrupe([student1]).then(function () {
                          return res.json({
                            status: "Kreiran student!",
                          });
                        });
                      })
                    );
                  }
                  // });
                }
              });
            });
          }
        }
        // });
      }
    });
  });
});

///////////////////////////////////////////////////////////////////////////////////////////// cita csv
app.post("/batch/student", function (req, res) {
  let NizStringova = [];
  let ListaStudenataNaCekanju = [];
  let NaziviGrupa = [];
  let NizIstih = [];
  let NizIndexa = [];
  let NizGrupa = [];
  const tijelo = req.body;
  let niz2 = tijelo;
  /////////////////////////////////////////////////////////////////////////////////////////////citanje csv
  for (;;) {
    let niz1 = "";
    if (niz1.includes("\n")) niz1 = niz2.substring(0, niz2.indexOf("\n"));
    else niz1 = niz2.substring(0, niz2.length);
    if (niz1.includes("\n")) niz1 = niz1.substring(0, niz2.indexOf("\n"));
    if (niz1.includes("\r")) niz1 = niz1.substring(0, niz2.indexOf("\r"));
    NizStringova.push(niz1);
    niz2 = niz2.substring(niz1.length, niz2.length);
    if (niz2.includes("\n"))
      niz2 = niz2.substring(niz2.indexOf("\n") + 1, niz2.length);
    //console.log(niz1);
    if (niz2.length == 0 || niz1.includes(",") == false) break;
  }
  //////////////////////////////////////////////////////////////////////////////////////////
  let postojiUBazi = false;
  let z = 0;
  let size = 1;
  db.sequelize.sync().then(function () {
    db.student.findAll({}).then(function (studentii) {
      size = studentii.length; //
      ///////
      granica = studentii.length;
      if (granica == 0) granica = 1;
      z++;
      /////////////////////////////////////////////////////////////////////////// provjerava iste studente
      //db.student.findAll({}).then(function (studentij) {
      let NizStringova2 = NizStringova;
      let brojStudenata = NizStringova2.length;
      NizStringova2.forEach((stringg) => {
        stringg = stringg.substring(stringg.indexOf(",") + 1, stringg.length);
        stringg = stringg.substring(stringg.indexOf(",") + 1, stringg.length);
        NizIndexa.push(stringg.substring(0, stringg.indexOf(",")));
        stringg = stringg.substring(stringg.indexOf(",") + 1, stringg.length);
        NizGrupa.push(stringg.substring(0, stringg.length));
      });
      // console.log("NizIndexa");
      // console.log(NizIndexa);
      for (let j = 0; j < NizIndexa.length; j++) {
        let pronadjen = false;
        for (let i = 0; i < studentii.length; i++) {
          if (String(studentii[i].index) == NizIndexa[j]) {
            pronadjen = true;
            NizIstih.push(NizIndexa[j]);
          }
        }
        if (pronadjen == false) {
          for (let k = 0; k < j; k++) {
            if (NizIndexa[j] == NizIndexa[k]) {
              NizIstih.push(NizIndexa[j]);
            }
          }
        }
      }
      // console.log("Niz Grupa:");
      // console.log(NizGrupa);

      //});
      ///////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////// upisuje studente u bazu
      let studentiLista = [];
      NizStringova.forEach((stringg) => {
        let dupli = false;
        let imee = stringg.substring(0, stringg.indexOf(","));
        stringg = stringg.substring(stringg.indexOf(",") + 1, stringg.length);
        let prezimee = stringg.substring(0, stringg.indexOf(","));
        stringg = stringg.substring(stringg.indexOf(",") + 1, stringg.length);
        let indexx = stringg.substring(0, stringg.indexOf(","));
        stringg = stringg.substring(stringg.indexOf(",") + 1, stringg.length);
        let grupaa = stringg;
        for (let i = 0; i < NizIstih.length; i++) {
          if (indexx == NizIstih[i]) dupli = true;
        }
        if (dupli == false) {
          studentiLista.push(
            db.student.create({
              ime: imee,
              prezime: prezimee,
              index: indexx,
              grupa: grupaa,
            })
          );
        }
      });
      ///////////////////////////////////////////////////////////////////////////////////////

      // let nazivGrupe = grupa;
      ///////////////////////////////////////////////////////////////////////////////////////////// pojedinacni studenti
      let Listaa = [];
      Promise.all(studentiLista).then(function (studentii) {
        //for (let i = 0; i < studentiLista.size; i++) {
        studentii.forEach((studentiii) => {
          Listaa.push(
            studentii.filter(function (a) {
              return a.index === studentiii.index;
            })[0]
          );
          //}
        });
        // console.log(Listaa);
        /////////////////////////////////////////////////////////////////////////////////////////////
        let brojacLista = 0;
        let brojacc = 0;
        Listaa.forEach((studentiiii) => {
          db.grupa.findAll({}).then(function (grupee) {
            brojacc++;
            brojacLista++;
            let velicinaGrupe = grupee.length;
            let x = 0;
            granica2 = grupee.length;
            if (granica2 == 0) granica2 = 1;
            let nadjen = false;
            for (let f = 0; f < granica2; f++) {
              //////////////////////////////////////////////////////////////////////////
              //grupee.forEach((vjezbe) => {
              x++;
              /*if (grupee.length != 0) {*/
              if (grupee.length != 0) {
                if (grupee[f].naziv == studentiiii.grupa) {
                  nadjen = true;
                  grupee[f].addStudentiGrupe(studentiiii);
                  // console.log("JeniBardo");
                  if (brojacLista == Listaa.length) {
                    let uniqueChars = [];
                    NaziviGrupa.forEach((c) => {
                      if (!uniqueChars.includes(c)) {
                        uniqueChars.push(c);
                      }
                    });
                    //////////////////////////
                    if (ListaStudenataNaCekanju.length != 0) {
                      for (let i = 0; i < uniqueChars.length; i++) {
                        let PomocniKontejner = [];
                        for (
                          let j = 0;
                          j < ListaStudenataNaCekanju.length;
                          j++
                        ) {
                          if (
                            ListaStudenataNaCekanju[j].grupa == uniqueChars[i]
                          )
                            PomocniKontejner.push(ListaStudenataNaCekanju[j]);
                        }
                        db.grupa
                          .create({ naziv: uniqueChars[i] })
                          .then(function (b) {
                            // console.log("pomocni1");
                            return b.setStudentiGrupe(PomocniKontejner);
                          });
                      }
                    }
                    if (NizIstih.length == 0)
                      return res.json({
                        status: "Dodano " + brojStudenata + " studenata!",
                      });
                    else {
                      let brojic = brojStudenata - NizIstih.length;

                      let stringPomocni = "";
                      for (let i = 0; i < NizIstih.length; i++) {
                        if (i == 0) stringPomocni = String(NizIstih[i]);
                        else stringPomocni += "," + String(NizIstih[i]);
                      }
                      let string =
                        "Dodano " +
                        brojic +
                        " studenata, a studenti " +
                        stringPomocni +
                        " već postoje!";
                      //{status:”Dodano {M} studenata, a studenti {INDEX1,INDEX2,INDEX3,...} već postoje!”}
                      return res.json({ status: string });
                    }
                  }
                  break;
                }
              }
              if (
                (x == velicinaGrupe && nadjen == false) ||
                grupee.length == 0
              ) {
                // console.log("usloooooooo");
                ListaStudenataNaCekanju.push(studentiiii);
                NaziviGrupa.push(studentiiii.grupa);
                if (brojacLista == Listaa.length) {
                  let uniqueChars = [];
                  NaziviGrupa.forEach((c) => {
                    if (!uniqueChars.includes(c)) {
                      uniqueChars.push(c);
                    }
                  });
                  //////////////////////////
                  for (let i = 0; i < uniqueChars.length; i++) {
                    let PomocniKontejner = [];
                    for (let j = 0; j < ListaStudenataNaCekanju.length; j++) {
                      if (ListaStudenataNaCekanju[j].grupa == uniqueChars[i])
                        PomocniKontejner.push(ListaStudenataNaCekanju[j]);
                    }
                    db.grupa
                      .create({ naziv: uniqueChars[i] })
                      .then(function (b) {
                        // console.log("pomocni1");
                        return b.setStudentiGrupe(PomocniKontejner);
                      });
                  }
                  ///////////////////////////////////////
                  if (NizIstih.length == 0)
                    return res.json({
                      status: "Dodano " + brojStudenata + " studenata!",
                    });
                  else {
                    let brojic = brojStudenata - NizIstih.length;

                    let stringPomocni = "";
                    for (let i = 0; i < NizIstih.length; i++) {
                      if (i == 0) stringPomocni = String(NizIstih[i]);
                      else stringPomocni += "," + String(NizIstih[i]);
                    }
                    let string =
                      "Dodano " +
                      brojic +
                      " studenata, a studenti " +
                      stringPomocni +
                      " već postoje!";
                    //{status:”Dodano {M} studenata, a studenti {INDEX1,INDEX2,INDEX3,...} već postoje!”}
                    return res.json({ status: string });
                  }
                  ///////////////////////////////////////
                  //{status:”Dodano {N} studenata!”} ili ako jedan ili više studenata već postoji {status:”Dodano {M} studenata, a studenti {INDEX1,INDEX2,INDEX3,...} već postoje!”}
                  ///////////////////////////////////////
                }
              }
            }
          });
        });
        if (NizIstih.length == 0)
          return res.json({
            status: "Dodano " + brojStudenata + " studenata!",
          });
        else {
          let brojic = brojStudenata - NizIstih.length;

          let stringPomocni = "";
          for (let i = 0; i < NizIstih.length; i++) {
            if (i == 0) stringPomocni = String(NizIstih[i]);
            else stringPomocni += "," + String(NizIstih[i]);
          }
          let string =
            "Dodano " +
            brojic +
            " studenata, a studenti " +
            stringPomocni +
            " već postoje!";
          //{status:”Dodano {M} studenata, a studenti {INDEX1,INDEX2,INDEX3,...} već postoje!”}
          return res.json({ status: string });
        }
      });
    });
  });
});
app.listen(3000);
//module.exports = app;
