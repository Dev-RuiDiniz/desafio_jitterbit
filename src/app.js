// src/app.js (ATUALIZADO)

const express = require('express');
const app = express();
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middlewares/errorHandler'); // Importa o novo middleware

app.use(express.json());

// Rota de Teste/Health Check
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Integração das Rotas da API
app.use('/api/v1', orderRoutes);

// --- Middleware Global de Erros (DEVE VIR POR ÚLTIMO) ---
app.use(errorHandler);

module.exports = app;