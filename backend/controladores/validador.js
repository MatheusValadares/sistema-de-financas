const Joi = require('@hapi/joi');

const validacaoConectar = (dados) => {

  const schema = Joi.object({
    email: Joi.string().required().min(5).max(50),
    senha: Joi.string().required().min(6).max(100),
  })

  return schema.validate(dados);

}

const validacaoRegistrar = (dados) => {

  const schema = Joi.object({
    nome: Joi.string().required().min(2).max(50),
    email: Joi.string().required().min(5).max(50),
    senha: Joi.string().required().min(6).max(100),
  })

  return schema.validate(dados);

}

module.exports.validacaoConectar = validacaoConectar;
module.exports.validacaoRegistrar = validacaoRegistrar;