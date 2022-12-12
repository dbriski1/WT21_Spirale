let VjezbeAjax = (function () {
  let otvoreniTab = null;
  const dodajInputpolja = function (DOMelementDIVauFormi, brojVjezbi) {
    DOMelementDIVauFormi.innerHTML = "";

    if (brojVjezbi > 0 && brojVjezbi < 16 && isNaN(brojVjezbi) == false)
      for (let i = 0; i < brojVjezbi; i++) {
        broj = i;
        //let mali =  "\xa0\xa0"+broj;
        if (i < 9) {
          DOMelementDIVauFormi.innerHTML +=
            "<label for='zadatak" +
            broj +
            "'>" +
            "\xa0\xa0" +
            "z" +
            broj +
            ":</label>";
        } else {
          DOMelementDIVauFormi.innerHTML +=
            "<label for='zadatak" + broj + "'>z" + broj + ":</label>";
        }
        DOMelementDIVauFormi.innerHTML +=
          "<input type='number' name='zadatak" +
          broj +
          "' id='z" +
          broj +
          "'value='4'>";
        DOMelementDIVauFormi.innerHTML += "<br>";
      }
  };

  const posaljiPodatke = function (vjezbeObjekat, callbackFja) {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
      // Anonimna funkcija
      if (ajax.readyState == 4 && ajax.status == 200) {
        var jsonRez = JSON.parse(ajax.responseText);
        callbackFja(null, jsonRez);
      } else if (ajax.readyState == 4) callbackFja("greska", null);
    };
    ajax.open("POST", "http://localhost:3000/vjezbe", true);
    ajax.setRequestHeader("Content-Type", "application/json");

    // console.log(JSON.stringify(vjezbeObjekat));
    ajax.send(JSON.stringify(vjezbeObjekat));
  };

  const dohvatiPodatke = function (callbackFja) {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
      if (ajax.readyState == 4 && ajax.status == 200) {
        var jsonRez = ajax.response;
        callbackFja(null, jsonRez);
      } else if (ajax.readyState == 4) callbackFja(ajax.statusText, null);
    };
    ajax.open("GET", "http://localhost:3000/vjezbe", true);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.send();
  };
  let iscrtajVjezbe = function (divDOMelement, objekat) {
    //console.log("iscrtajVjezbe");
    divDOMelement.innerHTML = "";
    for (let i = 0; i < objekat.brojVjezbi; i++) {
      //console.log(objekat.brojZadataka[i]);
      let broj = i + 1;
      divDOMelement.innerHTML +=
        "<div class='box' id='" +
        i +
        "' onclick='VjezbeAjax.iscrtajZadatke(this," +
        objekat.brojZadataka[i] +
        ")'><p>VJEŽBA " +
        broj +
        "</p></div>";
    }
  };
  const iscrtajZadatke = function (vjezbaDOMelement, brojZadataka) {
    let b = vjezbaDOMelement.id;
    //console.log(otvoreniTab);
    if (otvoreniTab != null) {
      let c = otvoreniTab.id;
      otvoreniTab.querySelector("#container-mali" + c).style.display = "none";
    }
    otvoreniTab = vjezbaDOMelement;
    //console.log(vjezbaDOMelement.querySelector("#container-mali" + b));
    if (vjezbaDOMelement.querySelector("#container-mali" + b) === null) {
      // console.log("NEW");
      vjezbaDOMelement.innerHTML +=
        "<div class='container-mali' id='container-mali" + b + "'>";
      for (let i = 0; i < brojZadataka; i++) {
        let broj = i + 1;
        vjezbaDOMelement.querySelector("#container-mali" + b).innerHTML +=
          "<div class='box2'>ZADATAK " + broj + "</div>";
      }
    } else {
      // console.log("OK");
      vjezbaDOMelement.querySelector("#container-mali" + b).style.display =
        "grid";
    }
  };

  return {
    dodajInputpolja: dodajInputpolja,
    posaljiPodatke: posaljiPodatke,
    iscrtajZadatke: iscrtajZadatke,
    iscrtajVjezbe: iscrtajVjezbe,
    dohvatiPodatke: dohvatiPodatke,
  };
})();
