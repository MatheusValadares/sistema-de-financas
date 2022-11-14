
let token = localStorage.getItem('token');

if (token) { window.location = "./sistema.html" };

function conectar() {
  let email = document.getElementById("email").value;
  let senha = document.getElementById("senha").value;

  let options = {
    method: "POST",
    headers: new Headers({
      'content-type': 'application/json',
    }),
    body: JSON.stringify({ email, senha })
  }

  fetch("http://localhost:3000/login/conectar", options).then((res) => {

    token = res.headers.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.location = "./sistema.html";
    } else {
      res.text().then(msg => { reportarErro(msg, 3000) })
    }

  }).catch((error) => {

    reportarErro(error, 3000);

  })


}

let click = false;

function reportarErro(mensagem, tempo) {

  if (click == false) {
    click = true;

    $("#containerErros").append(` <div id="alertaErro" class="alert alert-danger alertas">
  <strong>Erro:</strong> ${mensagem}
  </div>`)

    setTimeout(() => {
      $("#alertaErro").remove();
      click = false;
    }, tempo);
  }

}