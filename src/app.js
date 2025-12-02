// src/app.js (ATUALIZADO)

const express = require('express');
const app = express();
const orderRoutes = require('./routes/orderRoutes');
// 1. Importa o novo middleware de erros
const errorHandler = require('./middlewares/errorHandler'); 

// Middleware para processamento de JSON
app.use(express.json());

// Rota de Teste/Health Check
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Integração das Rotas da API (Rotas de Negócio)
app.use('/api/v1', orderRoutes);

// ----------------------------------------------------
// 2. Middleware Global de Erros (DEVE VIR POR ÚLTIMO)
// ----------------------------------------------------
app.use(errorHandler); 

module.exports = app;