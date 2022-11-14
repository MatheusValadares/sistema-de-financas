const express = require('express');
const router = express.Router();
const controlador = require('../controladores/controladorLogin');

router.post('/registrar', controlador.registrar);
router.post('/conectar', controlador.conectar);

module.exports = router;
