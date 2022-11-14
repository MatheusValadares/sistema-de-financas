
let token = localStorage.getItem("token");
if (!token) { window.location = "./index.html" };

let meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
let periodo = {
  mes: new Date().getMonth(),
  ano: new Date().getFullYear(),
};
let receitaTotal = 0;
let despesaTotal = 0;
let saldo = 0;
let dados = "";

iniciar();

function iniciar() {

  definirPeriodo();

}

function deslogar() {

  localStorage.removeItem('token');
  window.location = "./index.html";

}


function definirPeriodo() {
  document.getElementById("periodo").innerHTML = "";
  document.getElementById("periodo").innerHTML = `${meses[periodo.mes]}/${periodo.ano}`;
  buscarDados(periodo);
}

function adiantarPeriodo() {

  if (periodo.mes == 11) {
    periodo.mes = 0;
    periodo.ano++;
  } else {
    periodo.mes++;
  }

  definirPeriodo();
}

function voltarPeriodo() {

  if (periodo.mes == 0) {
    periodo.mes = 11;
    periodo.ano--;
  } else {
    periodo.mes--;
  }

  definirPeriodo();
}


function buscarDados() {

  let options = {
    method: "GET",
    headers: new Headers({
      'content-type': 'application/json',
      'token': token
    }),
  }

  fetch(`http://localhost:3000/inicio/${periodo.mes + 1}/${periodo.ano}`, options).then(res => {
    return res.json();
  }).then(json => {
    dados = json;
    calcularReceitas();
    calcularDespesas();
    calcularSaldo();
    criarValores();
    calcularDespesaPorCategoria();
    criarTabela()
  }).catch((error) => {
    reportarErro(`Problema ao carregar dados! ${error}`, 8000);
  })
}


function calcularReceitas() {
  receitaTotal = 0;

  dados.receitas.forEach((receitas) => {
    receitaTotal += receitas.valor;
  })

}

function calcularDespesas() {
  despesaTotal = 0;

  dados.despesas.forEach((despesa) => {
    despesaTotal += despesa.valor;
  })

}

function calcularSaldo() {
  saldo = receitaTotal - despesaTotal;
}

function criarValores() {

  let divReceita = `<div class="m-1 text-center text-success">Receitas: <div>R$ ${formatarValor(receitaTotal)}<div></div>`;
  let divDespesa = `<div class="m-1 text-center text-danger">Despesas: <div>R$ ${formatarValor(despesaTotal)}</div></div>`;
  let divSaldo = `<div class="m-1 text-center">Saldo: <div>R$ ${formatarValor(saldo)}<div></div>`;

  document.getElementById('valoresTotais').innerHTML = divReceita;
  document.getElementById('valoresTotais').innerHTML += divDespesa;
  document.getElementById('valoresTotais').innerHTML += divSaldo;

}

function criarGrafico(array) {

  google.charts.load('current', { 'packages': ['corechart'] });

  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Categoria');
    data.addColumn('number', 'Valor');
    data.addRows(array);

    var options = {
      'title': 'Gastos por Categorias',
      'width': 280,
      'height': 300,
      backgroundColor: 'transparent',
      fontSize: 16,
      legend: { textStyle: { color: 'white' } },
      chartArea: { left: 0, top: 0, width: '100%', height: '100%' },
      colors: ["#8B0000", "#B22222", "#A52A2A", "#FA8072", "#E9967A", "#FFA07A", "#FF7F50", "#FF6347", "#FF0000", "#FFDAB9", "#FF4500",]
    };


    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }

}


function calcularDespesaPorCategoria() {

  let arrayGrafico = [];

  let categorias = [
    {
      categoria: 'Moradia',
      valor: 0
    },
    {
      categoria: 'Educação',
      valor: 0
    },
    {
      categoria: 'Transporte',
      valor: 0
    },
    {
      categoria: 'Saúde',
      valor: 0
    },
    {
      categoria: 'Lazer',
      valor: 0
    },
    {
      categoria: 'Alimentação',
      valor: 0
    },
    {
      categoria: 'Vestuário',
      valor: 0
    },
    {
      categoria: 'Lanches',
      valor: 0
    },
    {
      categoria: 'Presentes',
      valor: 0
    },
    {
      categoria: 'Cartão',
      valor: 0
    },
    {
      categoria: 'Outros',
      valor: 0
    }
  ]

  dados.despesas.forEach((despesa) => {

    categorias.map((obj) => {
      if (obj.categoria == despesa.categoria) {
        obj.valor += despesa.valor;
      }
    })

  })

  for (let i = 0; i < categorias.length; i++) {
    let array = [categorias[i].categoria, categorias[i].valor];
    arrayGrafico.push(array);
  }

  criarGrafico(arrayGrafico);

}


function criarTabela() {
  let tabela = document.getElementById('tabela');
  let cabecalho = document.getElementById("cabecalhoTabela");
  tabela.innerHTML = "";


  if (dados.despesas == 0 && dados.receitas == 0) {
    cabecalho.innerHTML = "";
  } else {
    cabecalho.innerHTML = `<tr><th>Data</th><th>Tipo</th> <th>Local</th><th>Categoria</th><th>Valor</th></tr>`
  }

  for (var i = 31; i > 0; --i) {
    dados.despesas.forEach((despesa) => {
      if (despesa.dia == i) {
        let data = despesa.dia + "/" + despesa.mes + "/" + despesa.ano;
        let elementoDespesa = `<tr id="${despesa._id}"class="text-danger" data-toggle="modal" data-target="#modalEditar" onclick="preencherModal(this)">
        <td>${data}</td>
        <td>Despesa</td>
        <td>${despesa.local}</td>
        <td>${despesa.categoria}</td>
        <td class="teste" style="white-space:nowrap">R$ ${formatarValor(despesa.valor)}</td>
        </tr>`;
        tabela.innerHTML += elementoDespesa;
      }
    })

    dados.receitas.forEach((receita) => {
      if (receita.dia == i) {
        let data = receita.dia + "/" + receita.mes + "/" + receita.ano;
        let elementoReceita = `<tr id="${receita._id}" class="text-success" data-toggle="modal" data-target="#modalEditar"  onclick="preencherModal(this)">
        <td>${data}</td>
        <td>Receita</td>
        <td>${receita.local}</td>
        <td>${receita.categoria}</td>
        <td style="white-space: nowrap">R$ ${formatarValor(receita.valor)}</td>
        </tr>`;
        tabela.innerHTML += elementoReceita;
      }
    })

  }
}

function adicionarReceita() {

  let data = formatarData(document.getElementById('dataReceita').value);
  let valor = parseFloat(document.getElementById('valorReceita').value);
  let categoria = document.getElementById('categoriaReceita').value;
  let local = document.getElementById('localReceita').value;
  let dia = data.dia;
  let mes = data.mes;
  let ano = data.ano;

  if (valor && categoria && local && dia && mes && ano) {
    let receita = { valor, categoria, local, dia, mes, ano };

    let options = {
      method: "POST",
      headers: new Headers({
        'content-type': 'application/json',
        'token': token
      }),
      body: JSON.stringify(receita)
    }

    fetch("http://localhost:3000/add/receita", options).then(res => {

      $('#modalReceita').modal('hide');
      document.getElementById("formReceita").reset();
      iniciar();
      reportarSucesso("Adicionado com sucesso!", 2000);

    }).catch(() => {
      reportarErro("Não foi possível adicionar receita, tente novamente!", 5000);
    })

  } else {
    reportarErro("Todos os campos devem ser preenchidos!", 4000);
  }
}


function adicionarDespesa() {

  let data = formatarData(document.getElementById('dataDespesa').value);
  let valor = parseFloat(document.getElementById('valorDespesa').value);
  let categoria = document.getElementById('categoriaDespesa').value;
  let local = document.getElementById('localDespesa').value;
  let dia = data.dia;
  let mes = data.mes;
  let ano = data.ano;

  if (valor && categoria && local && dia && mes && ano) {
    let despesa = { valor, categoria, local, dia, mes, ano };

    let options = {
      method: "POST",
      headers: new Headers({
        'content-type': 'application/json',
        'token': token
      }),
      body: JSON.stringify(despesa)
    }

    fetch("http://localhost:3000/add/despesa", options).then(() => {

      $('#modalDespesa').modal('hide');
      document.getElementById("formDespesa").reset();
      iniciar();
      reportarSucesso("Adicionado com sucesso!", 2000);

    }).catch(() => {
      reportarErro("Não foi possível adicionar receita, tente novamente!", 5000);
    })

  } else {
    reportarErro("Todos os campos devem ser preenchidos!", 4000);
  }

}


function preencherModal(elemento) {

  let categoriasDespesas = ["Moradia", "Educação", "Alimentação", "Transporte", "Saúde", "Lazer", "Vestuário", "Lanches", "Presentes", "Cartão", "Outros"]

  let categoriasReceitas = ["Salário", "Extra"];

  let id = elemento.id;
  let valor = document.getElementById("valorEditar");
  let categoria = document.getElementById("categoriaEditar");
  let local = document.getElementById("localEditar");
  let data = document.getElementById("dataEditar");
  let botoes = document.getElementById("btnContainer");
  botoes.innerHTML = "";

  categoria.innerHTML = "";

  dados.receitas.forEach((doc) => {
    if (doc._id == id) {

      categoriasReceitas.forEach((cat) => {
        if (cat != doc.cat) {
          categoria.innerHTML += `<option value=${cat}>${cat}</option>`
        } else {
          categoria.innerHTML += `<option select value=${cat}>${cat}</option>`
        }
      })

      obj = doc;
      valor.value = doc.valor;
      categoria.value = doc.categoria;
      local.value = doc.local;
      data.value = doc.ano + "-" + adicionarZero(doc.mes) + "-" + adicionarZero(doc.dia);
      botoes.innerHTML = `              <button type="button" onclick="excluir('${id}', 'receita')" class="btn btn-light text-danger mr-2">Excluir</button>
      <button type="button" onclick="editar('${id}', 'receita')" class="btn btn-light text-dark">Editar</button>`
    }
  });

  dados.despesas.forEach((doc) => {

    if (doc._id == id) {

      categoriasDespesas.forEach((cat) => {
        if (cat != doc.cat) {
          categoria.innerHTML += `<option value=${cat}>${cat}</option>`
        } else {
          categoria.innerHTML += `<option select value=${cat}>${cat}</option>`
        }
      })

      obj = doc;
      valor.value = doc.valor;
      categoria.value = doc.categoria;
      local.value = doc.local;
      data.value = doc.ano + "-" + adicionarZero(doc.mes) + "-" + adicionarZero(doc.dia);
      botoes.innerHTML = `<button type="button" onclick="excluir('${id}', 'despesa')" class="btn btn-light text-danger mr-2">Excluir</button>
      <button type="button" onclick="editar('${id}', 'despesa')" class="btn btn-light text-dark">Editar</button>`
    }
  });

}

function editar(id, tipo) {


  let valor = document.getElementById("valorEditar").value;
  let categoria = document.getElementById("categoriaEditar").value;
  let local = document.getElementById("localEditar").value;
  let data = document.getElementById("dataEditar").value;

  if (valor && categoria && local && data) {

    let objData = formatarData(data);

    let doc = {
      id,
      tipo,
      valor,
      categoria,
      local,
      dia: objData.dia,
      mes: objData.mes,
      ano: objData.ano,
    }

    let options = {
      method: "PUT",
      headers: new Headers({
        'content-type': 'application/json',
        'token': token,
      }),
      body: JSON.stringify(doc)
    }

    fetch("http://localhost:3000/editar", options).then(res => {

      $('#modalEditar').modal('hide');
      iniciar();
      reportarSucesso("Atualizado com sucesso!", 2000);

    }).catch((error) => {
      reportarErro(`Problema ao atualizar dados! ${error}`, 8000);
    })

  } else {
    reportarErro("Todos os campos devem ser preenchidos!", 4000);
  }


}

function excluir(id, tipo) {

  let options = {
    method: "DELETE",
    headers: new Headers({
      'content-type': 'application/json',
      'token': token,
    }),
    body: JSON.stringify({ id, tipo })
  }

  console.log({ id, tipo })

  fetch("http://localhost:3000/excluir", options).then(res => {

    $('#modalEditar').modal('hide');
    iniciar();
    reportarSucesso("Excluido com sucesso!", 2000);

  }).catch((error) => {
    reportarErro(`Problema ao excluir dados! ${error}`, 8000);
  })

}


let click = false;

function reportarSucesso(mensagem, tempo) {

  if (click == false) {
    click = true;
    $("#btnPrincipal").remove();
    $("body").append(`<div id="alertaSucesso" class="alert alert-success alertas ">
  ${mensagem}
  </div>`)

    setTimeout(() => {
      $("#alertaSucesso").remove();
      $("body").append(`  <section id="btnPrincipal" class="d-flex justify-content-between fixed-bottom mb-2">
    <button class="btn btn-success p-1 ml-2" data-toggle="modal" data-target="#modalReceita">
      Adicionar Receita
    </button>
    <button class="btn p-1 btn-danger mr-2" data-toggle="modal" data-target="#modalDespesa">
      Adicionar Despesa
    </button>
    </section>`);
      click = false;
    }, tempo);

  }

}


function reportarErro(mensagem, tempo) {

  if (click == false) {
    click = true;
    $("#btnPrincipal").remove();

    $("#containerErros").append(` <div id="alertaErro" class="alert alert-danger alertas">
  <strong>Erro:</strong> ${mensagem}
  </div>`)

    setTimeout(() => {
      $("#alertaErro").remove();
      $("#containerErros").append(`  <section id="btnPrincipal" class="d-flex justify-content-between fixed-bottom mb-2">
    <button class="btn btn-success p-1 ml-2" data-toggle="modal" data-target="#modalReceita">
      Adicionar Receita
    </button>
    <button class="btn p-1 btn-danger mr-2" data-toggle="modal" data-target="#modalDespesa">
      Adicionar Despesa
    </button>
  </section>`);
      click = false;
    }, tempo);
  }

}


function formatarData(data) {

  let dataSeparada = data.split("-", 3);
  let objData = {
    dia: parseInt(dataSeparada[2]),
    mes: parseInt(dataSeparada[1]),
    ano: parseInt(dataSeparada[0])
  }

  return objData;
}


function formatarValor(valorEntrada) {

  let resultado = "";
  let valor = valorEntrada.toString();

  if (valor.includes(".") == true) {

    let array = valor.split(".");
    let inteiro = array[0];
    let resto = array[1];

    if (resto.length >= 2) {
      resultado = inteiro + "," + resto[0] + resto[1];
    } else {
      resultado = inteiro + "," + resto[0] + "0";
    }

  } else {
    resultado = valor;
  }

  return resultado;
}



function adicionarZero(numero) {
  if (numero <= 9)
    return "0" + numero;
  else
    return numero;
}








