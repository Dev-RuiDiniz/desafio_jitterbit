const express = require('express');
const app = express();
const orderRoutes = require('./routes/orderRoutes'); 

// Middleware: Processamento de JSON para requisições
app.use(express.json());

// Rota de Teste/Health Check
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Integração das Rotas da API
app.use('/api/v1', orderRoutes);

module.exports = app;