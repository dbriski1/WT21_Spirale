let TestoviParser = (function () {
  const dajTacnost = function (string) {
    var obj;
    try {
      obj = JSON.parse(string);
    } catch (er) {
      var error = {
        tacnost: "0%",
        greske: ["Testovi se ne mogu izvršiti"],
      };
      // console.log(JSON.stringify(error));
      return error;
    }
    if (
      !obj.hasOwnProperty("failures") ||
      !obj.hasOwnProperty("passes") ||
      !obj.hasOwnProperty("stats")
    ) {
      var error = {
        tacnost: "0%",
        greske: ["Testovi se ne mogu izvršiti"],
      };
      // console.log(JSON.stringify(error));
      return error;
    }
    var tacni = obj.stats.passes;
    var brojTestova = obj.stats.tests;
    var n = (tacni / parseFloat(brojTestova)) * 100;
    if (n - parseInt(n) > 0) {
      n = n.toFixed(1);
    } else {
      n = n.toFixed(0);
    }
    var procenat = n.toString();
    procenat = procenat.concat("%");
    const greske = [];
    for (let i in obj.failures) {
      greske.push(obj.failures[i].fullTitle);
    }
    const rezultat = {
      tacnost: procenat,
      greske: greske,
    };
    // console.log(JSON.stringify(rezultat));

    return rezultat;
  };

  const porediRezultate = function (rezultat1, rezultat2) {
    var obj1;
    var obj2;
    try {
      obj1 = JSON.parse(rezultat1);
      obj2 = JSON.parse(rezultat2);
    } catch (er) {
      var error = {
        //ispravi ako skontas bolje
        promjena: "0%",
        greske: ["Testovi se ne mogu izvršiti"],
      };
      // console.log(JSON.stringify(error));
      return error;
    }
    if (
      !obj1.hasOwnProperty("failures") ||
      !obj1.hasOwnProperty("passes") ||
      !obj1.hasOwnProperty("stats") ||
      !obj2.hasOwnProperty("failures") ||
      !obj2.hasOwnProperty("passes") ||
      !obj2.hasOwnProperty("stats")
    ) {
      var error = {
        //ispravi ako skontas bolje
        promjena: "0%",
        greske: ["Testovi se ne mogu izvršiti"],
      };
      return error;
    }

    if (obj1.stats.tests == obj2.stats.tests) {
      const greske1 = [];
      for (let i in obj1.tests) {
        greske1.push(obj1.tests[i].fullTitle);
      }
      const greske2 = [];
      for (let i in obj2.tests) {
        greske2.push(obj2.tests[i].fullTitle);
      }
      var pom = 0;
      for (let i = 0; i < greske1.length; i++) {
        if (!greske2.includes(greske1[i])) {
          pom = 1;
        }
      }
      // console.log(pom);
      if (pom == 0) {
        var tacnosti = dajTacnost(rezultat2);
        var objekat = {
          //ispravi ako skontas bolje
          promjena: tacnosti.tacnost,
          greske: [],
        };
        for (let i in obj2.failures) {
          objekat.greske.push(obj2.failures[i].fullTitle);
        }
        objekat.greske = objekat.greske.sort((a, b) => a.localeCompare(b));
        // console.log(objekat);
        return objekat;
      }
    }
    var brojGresaka = 0;
    const testovi2 = [];
    for (let i in obj2.tests) {
      testovi2.push(obj2.tests[i].fullTitle);
    }
    const greske1 = [];
    for (let i in obj1.failures) {
      greske1.push(obj1.failures[i].fullTitle);
    }
    const greske2 = [];
    for (let i in obj2.failures) {
      greske2.push(obj2.failures[i].fullTitle);
    }
    for (let i in greske1) {
      if (!testovi2.includes(greske1[i])) {
        brojGresaka++;
      }
    }
    var brGreske =
      ((brojGresaka + greske2.length) / (brojGresaka + testovi2.length)) * 100;

    if (brGreske - parseInt(brGreske) > 0) {
      brGreske = brGreske.toFixed(1);
    } else {
      brGreske = brGreske.toFixed(0);
    }

    var procenat = brGreske.toString();
    procenat = procenat.concat("%");
    var objekat = {
      promjena: procenat,
      greske: [],
    };
    // console.log(objekat);
    const testovi22 = [];
    for (let i in obj2.tests) {
      testovi22.push(obj2.tests[i].fullTitle);
    }
    var greske11 = [];
    for (let i in obj1.failures) {
      if (!testovi22.includes(obj1.failures[i].fullTitle)) {
        greske11.push(obj1.failures[i].fullTitle);
      }
    }
    var greske22 = [];
    for (let i in obj2.failures) {
      greske22.push(obj2.failures[i].fullTitle);
    }
    greske22 = greske22.sort((a, b) => a.localeCompare(b));
    greske11 = greske11.sort((a, b) => a.localeCompare(b));
    for (let i in greske11) {
      objekat.greske.push(greske11[i]);
    }
    for (let i in greske22) {
      objekat.greske.push(greske22[i]);
    }
    // console.log(JSON.stringify(objekat));
    return objekat;
  };

  return {
    dajTacnost: dajTacnost,
    porediRezultate: porediRezultate,
  };
})();
