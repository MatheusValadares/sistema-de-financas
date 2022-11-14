const Usuario = require('../modelos/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validacaoConectar, validacaoRegistrar } = require('./validador');

const controlador = {

  registrar: async function (req, res) {

    const { error } = validacaoRegistrar(req.body);
    if (error) return res.status(400).send(error.message);

    const usuarioCadastrado = await Usuario.findOne({ email: req.body.email });
    if (usuarioCadastrado) return res.status(400).send('Esse email já foi cadastrado!');

    const usuario = new Usuario({
      nome: req.body.nome,
      email: req.body.email,
      senha: bcrypt.hashSync(req.body.senha),
    })

    try {
      const usuarioSalvo = await usuario.save();
      const token = jwt.sign({ _id: usuarioSalvo._id }, process.env.TOKEN_SECRET)
      res.header("Access-Control-Expose-Headers", "token");
      res.header('token', token);
      res.send("Token enviado");

    } catch (error) {
      res.status(400).send(error.message);
    }

  },

  conectar: async function (req, res) {

    const { error } = validacaoConectar(req.body);
    if (error) return res.status(400).send(error.message);

    const usuarioCadastrado = await Usuario.findOne({ email: req.body.email });
    if (!usuarioCadastrado) return res.status(400).send('Email ou senha incorreta!');

    const comparacao = bcrypt.compareSync(req.body.senha, usuarioCadastrado.senha);
    if (!comparacao) return res.status(400).send('Email ou senha incorreta!');

    const token = jwt.sign({ _id: usuarioCadastrado._id }, process.env.TOKEN_SECRET)

    res.header("Access-Control-Expose-Headers", "token");
    res.header('token', token);
    res.send("Token enviado");

  }

}

module.exports = controlador;