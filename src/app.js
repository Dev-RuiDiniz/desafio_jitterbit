// src/app.js

const express = require('express');
const app = express();

// Middleware: Processamento de JSON para requisições (REQUISITO DA TASK 5)
app.use(express.json());

// Rota de Teste/Health Check (REQUISITO DA TASK 5)
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: "Bem-vindo ao Copiloto Programação API!", 
        status: "Running" 
    });
});
// Podemos adicionar /health especificamente, se preferir:
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});


// Exporta o aplicativo Express
module.exports = app;