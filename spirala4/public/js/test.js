chai.should();

describe("VjezbeAjax", function () {
  beforeEach(function () {
    this.xhr = sinon.useFakeXMLHttpRequest();

    this.requests = [];
    this.xhr.onCreate = function (xhr) {
      this.requests.push(xhr);
    }.bind(this);
  });

  afterEach(function () {
    this.xhr.restore();
    document.getElementById("testni").innerHTML = "";
  });

  //Tests etc. go here
  it("Testira dohvati podatke uspješno", function (done) {
    var data = { brojVjezbi: 2, brojZadataka: [5, 3] };
    var dataJson = JSON.stringify(data);

    VjezbeAjax.dohvatiPodatke(function (err, result) {
      result = JSON.parse(result);
      result.should.deep.equal(data);
      done();
    });
    this.requests[0].respond(200, { "Content-Type": "text/json" }, dataJson);
  });
  it("Testira neuspješno dohvaćanje podataka", function (done) {
    VjezbeAjax.dohvatiPodatke(function (err, result) {
      err.should.exist;
      done();
    });

    this.requests[0].respond(500);
  });

  it("Testira posalji podatke" /*"should post the given response data as JSON body"*/, function () {
    var data = { brojVjezbi: 2, brojZadataka: [5, 3] };
    var dataJson = JSON.stringify(data);

    VjezbeAjax.posaljiPodatke(data, function (err, data) {});

    this.requests[0].requestBody.should.equal(dataJson);
  });

  it("Testira dodaj input polja", function () {
    VjezbeAjax.dodajInputpolja(document.getElementById("testni"), 1);
    document
      .getElementById("testni")
      .innerHTML.should.equal(
        `<label for="zadatak0">&nbsp;&nbsp;z0:</label><input type="number" name="zadatak0" id="z0" value="4"><br>`
      );
  });

  it("Testira iscrtaj vjezbe", function () {
    let objekat = {
      brojVjezbi: 1,
      brojZadataka: [1],
    };
    VjezbeAjax.iscrtajVjezbe(document.getElementById("testni"), objekat);
    document
      .getElementById("testni")
      .innerHTML.should.equal(
        `<div class="box" id="0" onclick="VjezbeAjax.iscrtajZadatke(this,1)"><p>VJEŽBA 1</p></div>`
      );
  });

  it("Testira iscrtaj zadatke", function () {
    VjezbeAjax.iscrtajZadatke(document.getElementById("testni"), 2);
    document
      .getElementById("container-malitestni")
      .innerHTML.should.equal(
        `<div class="box2">ZADATAK 1</div><div class="box2">ZADATAK 2</div>`
      );
  });
});
