const express = require('express');
const router = express.Router();
const controlador = require('../controladores/controlador');

router.get('/:mes/:ano', controlador.geral);

router.post('/receita', controlador.addReceita);

router.post('/despesa', controlador.addDespesa);

router.put('/', controlador.editar);

router.delete('/', controlador.excluir);

module.exports = router;