const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
  nome: { type: String, required: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, minlength: 5, maxlength: 50 },
  senha: { type: String, required: true, minlength: 6, maxlength: 100 },
  dataCriacao: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Usuario', usuarioSchema);