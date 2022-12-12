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

document.getElementById("promjeniGrupu").addEventListener("click", function () {
  let index = "";
  let grupa = "";
  let popunjeno = true;
  index = String(document.getElementById("index").value);
  if (index == "") popunjeno = false;
  grupa = String(document.getElementById("grupa").value);
  if (grupa == "") popunjeno = false;
  //console.log(objekat);
  if (popunjeno == true) {
    // console.log("poslano");
    VjezbeAjax.postaviGrupu(index, grupa, funkcija);
  }
});
