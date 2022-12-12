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
  .getElementById("posaljiStudenta")
  .addEventListener("click", function () {
    let string = "";
    let objekat = {
      ime: string,
      prezime: string,
      index: string,
      grupa: string,
    };
    let popunjeno = true;
    objekat.ime = String(document.getElementById("ime").value);
    if (objekat.ime == "") popunjeno = false;
    objekat.prezime = String(document.getElementById("prezime").value);
    if (objekat.prezime == "") popunjeno = false;
    objekat.index = String(document.getElementById("index").value);
    if (objekat.index == "") popunjeno = false;
    objekat.grupa = String(document.getElementById("grupa").value);
    if (objekat.grupa == "") popunjeno = false;
    //console.log(objekat);
    if (popunjeno == true) {
      // console.log("poslano");
      VjezbeAjax.dodajStudenta(objekat, funkcija);
    }
  });
