const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const path = require("path");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + "/public/html/")));
app.use(express.static(path.join(__dirname + "/public/css/")));
app.use(express.static(path.join(__dirname + "/public/js/")));
app.use(express.static(path.join(__dirname + "/public/images/")));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/vjezbe/", function (req, res) {
  fs.readFile("./vjezbe.csv", function (err, csv) {
    if (err) throw err;
    var niz2 = csv.toString();
    niz2 = niz2.substring(0, niz2.indexOf("\r"));
    niz = niz2.split(",").map(Number);
    let br = parseInt(niz[0]);
    let objekatPovratni = {
      brojVjezbi: br,
      brojZadataka: [],
    };
    for (let i = 1; i < niz.length; i++) {
      let broj = parseInt(niz[i]);
      objekatPovratni.brojZadataka.push(broj);
    }
    res.json(objekatPovratni);
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
    fs.writeFile("vjezbe.csv", brVjezbi.toString() + ",", function (err) {
      if (err) {
        throw err;
      }
      for (let i = 0; i < brVjezbi; i++) {
        let string = brZadataka[i].toString();
        if (i != brVjezbi - 1) {
          string = string + ",";
        } else {
          string = string + "\r";
        }
        fs.appendFileSync("vjezbe.csv", string);
      }
      objekat.brojVjezbi = brVjezbi;
      objekat.brojZadataka = brZadataka;
      res.json(objekat);
    });
  }
});
app.listen(3000);
