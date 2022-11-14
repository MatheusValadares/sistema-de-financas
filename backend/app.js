require('dotenv').config();
const express = require('express');
const app = express();
const rota = require('./rotas/rota');
const rotaLogin = require('./rotas/rotaLogin');
const mongoose = require('mongoose');
const auth = require('./controladores/controladorAuth');
const cors = require('cors');

mongoose.connect(process.env.MONGO_CONNECTION_URL, (error) => {
  if (error)
    console.log(error);
  else
    console.log("db conectado!");
})

app.use(cors());
app.use('/login', express.json(), rotaLogin);
app.use('/inicio', express.json(), auth, rota);
app.use('/add', express.json(), rota);
app.use('/editar', express.json(), rota);
app.use('/excluir', express.json(), rota);



app.listen(process.env.PORT, () => { console.log('Servidor rodando...') });