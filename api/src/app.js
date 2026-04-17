const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const path = require('path');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend (pasta raiz do projeto)
app.use(express.static(path.join(__dirname, '../../')));

// Rotas da API
app.use('/api', routes);

// Error handler (deve ser o último middleware)
app.use(errorHandler);

module.exports = app;
