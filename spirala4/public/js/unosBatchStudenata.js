let broj_vjezbi;
document.getElementById("posaljiStudente").style.visibility = "hidden";
document
  .getElementById("posaljiBrojStudenata")
  .addEventListener("click", function () {
    broj_vjezbi = document.getElementById("Broj_studenata").value;
    //prikazi dugme za slanje zadataka
    if (
      document.getElementById("Broj_studenata").value > 0 &&
      isNaN(document.getElementById("Broj_studenata").value) == false
    ) {
      document.getElementById("posaljiStudente").style.visibility = "visible";
      VjezbeAjax.dodajStudentpolja(
        document.getElementById("zadaci"),
        parseInt(document.getElementById("Broj_studenata").value)
      );
      console.log("uslo");
    } else {
      document.getElementById("posaljiStudente").style.visibility = "hidden";
    }
  });

//   const input = document.getElementById("Broj_vjezbi");
//   input.addEventListener("input", dodajInputpolja);
//};

function funkcija(error, data) {
  if (error != null) {
    let stringg = JSON.stringify(error).substring(
      1,
      JSON.stringify(error).length - 1
    );
    document.getElementById("ajaxstatus").innerHTML = stringg;
  } else {
    let stringg = JSON.stringify(data.status).substring(
      1,
      JSON.stringify(data.status).length - 1
    );
    document.getElementById("ajaxstatus").innerHTML = stringg;
  }
}

document
  .getElementById("posaljiStudente")
  .addEventListener("click", function () {
    // VjezbeAjax.posaljistudente(document.getElementById("zadaci"), funkcija);
    // console.log(objekat);
    string = "";
    for (let i = 0; i < broj_vjezbi; i++) {
      string += String(document.getElementById("ime" + i).value);
      string += ",";
      string += String(document.getElementById("prezime" + i).value);
      string += ",";
      string += String(document.getElementById("index" + i).value);
      string += ",";
      string += String(document.getElementById("grupa" + i).value);
      string += "\r\n";
    }
    //console.log(string);
    VjezbeAjax.dodajBatch(string, funkcija);
  });
