// src/app.js (Atualizado)

const express = require('express');
const app = express();
const orderRoutes = require('./routes/orderRoutes'); // Importa as rotas de pedido

// Middleware: Processamento de JSON para requisições
app.use(express.json());

// Rota de Teste/Health Check
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Integração das Rotas da API (usando o prefixo /api/v1)
// Todos os endpoints em orderRoutes.js serão acessíveis via /api/v1/orders
app.use('/api/v1', orderRoutes);

module.exports = app;