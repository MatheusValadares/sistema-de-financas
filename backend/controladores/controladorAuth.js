const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

  const token = req.header('token');
  if (!token) return res.send('Acesso negado 1!');

  try {
    const usuarioVerificado = jwt.verify(token, process.env.TOKEN_SECRET);
    req.usuario = usuarioVerificado;
    next();
  } catch (error) {
    res.status(401).send('Acesso negado 2!')
  }


}