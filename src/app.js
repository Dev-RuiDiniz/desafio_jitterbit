const express = require('express');
const app = express();
const orderRoutes = require('./routes/orderRoutes'); // Importa as rotas de pedido

app.use(express.json());

// Rota de Teste/Health Check
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Integração das Rotas da API (usando um prefixo /api/v1 para boas práticas)
app.use('/api/v1', orderRoutes);

module.exports = app;