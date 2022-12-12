function callback(error, data) {
  if (error == null)
    VjezbeAjax.iscrtajVjezbe(
      document.getElementById("odabirVjezbe"),
      JSON.parse(data)
    );
}
window.onload = function () {
  VjezbeAjax.dohvatiPodatke(callback);
};
