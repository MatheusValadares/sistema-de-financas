const mongoose = require('mongoose');

const despesaSchema = mongoose.Schema({
  valor: { type: Number, required: true },
  categoria: { type: String, required: true },
  local: { type: String, required: true },
  dia: { type: Number, required: true },
  mes: { type: Number, required: true },
  ano: { type: Number, required: true },
  usuario: { type: String, required: true },
})

module.exports = mongoose.model('Despesa', despesaSchema);