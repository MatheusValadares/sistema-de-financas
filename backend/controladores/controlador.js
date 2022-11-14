const Despesa = require('../modelos/Despesa');
const Receita = require('../modelos/Receita');
const jwt = require('jsonwebtoken')

const controlador = {


  addReceita: async function (req, res) {

    const token = req.header('token');
    const usuarioLogado = jwt.verify(token, process.env.TOKEN_SECRET);

    const receita = new Receita({
      valor: req.body.valor,
      categoria: req.body.categoria,
      local: req.body.local,
      dia: req.body.dia,
      mes: req.body.mes,
      ano: req.body.ano,
      usuario: usuarioLogado._id,
    })

    try {
      const receitaSalva = await receita.save();
      res.send(receitaSalva);
    } catch (error) {
      res.status(400).send(error.message);
    }

  },

  addDespesa: async function (req, res) {

    const token = req.header('token')
    const usuarioLogado = jwt.verify(token, process.env.TOKEN_SECRET);

    const despesa = new Despesa({
      valor: req.body.valor,
      categoria: req.body.categoria,
      local: req.body.local,
      dia: req.body.dia,
      mes: req.body.mes,
      ano: req.body.ano,
      usuario: usuarioLogado._id,
    })

    try {
      const despesaSalva = await despesa.save();
      res.send(despesaSalva);
    } catch (error) {
      res.status(400).send(error.message);
    }

  },

  editar: async function (req, res) {

    const token = req.header('token')
    const usuarioLogado = jwt.verify(token, process.env.TOKEN_SECRET);

    const doc = {
      valor: req.body.valor,
      categoria: req.body.categoria,
      local: req.body.local,
      dia: req.body.dia,
      mes: req.body.mes,
      ano: req.body.ano,
      usuario: usuarioLogado._id,
    };

    const idDoc = req.body.id;
    const tipo = req.body.tipo;

    try {

      if (tipo == "despesa") {
        const atualizacao = await Despesa.updateOne({ _id: idDoc }, doc);
        res.send(atualizacao);
      } else {
        const atualizacao = await Receita.updateOne({ _id: idDoc }, doc);
        res.send(atualizacao);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }

  },

  excluir: async function (req, res) {

    const token = req.header('token')
    const usuarioLogado = jwt.verify(token, process.env.TOKEN_SECRET);

    const idDoc = req.body.id;
    const tipo = req.body.tipo;

    try {

      if (tipo == "despesa") {
        const resultado = await Despesa.deleteOne({ _id: idDoc });
        res.send(resultado);
      } else {
        const resultado = await Receita.deleteOne({ _id: idDoc });
        res.send(resultado);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }

  },

  geral: async function (req, res) {

    const usuario = req.usuario;
    const mes = req.params.mes;
    const ano = req.params.ano;
    const despesas = await Despesa.find({ "usuario": usuario._id, mes, ano });
    const receitas = await Receita.find({ "usuario": usuario._id, mes, ano });

    res.send({ despesas, receitas });
  },

}

module.exports = controlador;