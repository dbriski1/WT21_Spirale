let broj_vjezbi;
document.getElementById("posaljiBrojZadataka").style.visibility = "hidden";
document
  .getElementById("posaljiBrojVjezbi")
  .addEventListener("click", function () {
    VjezbeAjax.dodajInputpolja(
      document.getElementById("zadaci"),
      parseInt(document.getElementById("Broj_vjezbi").value)
    );

    broj_vjezbi = document.getElementById("Broj_vjezbi").value;
    //prikazi dugme za slanje zadataka
    if (
      document.getElementById("Broj_vjezbi").value > 0 &&
      document.getElementById("Broj_vjezbi").value < 16 &&
      isNaN(document.getElementById("Broj_vjezbi").value) == false
    ) {
      document.getElementById("posaljiBrojZadataka").style.visibility =
        "visible";
    } else {
      document.getElementById("posaljiBrojZadataka").style.visibility =
        "hidden";
    }
  });

//   const input = document.getElementById("Broj_vjezbi");
//   input.addEventListener("input", dodajInputpolja);
//};

function funkcija(error, data) {
  if (error != null) console.log(error);
  else console.log(data);
}

document
  .getElementById("posaljiBrojZadataka")
  .addEventListener("click", function () {
    let objekat = {
      brojVjezbi: broj_vjezbi,
      brojZadataka: [],
    };
    for (let i = 0; i < broj_vjezbi; i++) {
      let broj = document.getElementById("z" + i).value;
      objekat.brojZadataka.push(broj);
    }
    VjezbeAjax.posaljiPodatke(objekat, funkcija);
    // console.log(objekat);
  });
