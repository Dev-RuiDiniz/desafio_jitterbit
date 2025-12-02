// src/middlewares/errorHandler.js

const { AppError } = require('../utils/dataMapper'); // Importa AppError para identificá-lo

/**
 * @function errorHandler
 * @description Middleware global para capturar erros.
 * - Trata AppError (erros conhecidos com status code).
 * - Trata erros genéricos (500 Internal Server Error).
 * @param {Error} err - O objeto de erro capturado
 * @param {object} req - Objeto de requisição
 * @param {object} res - Objeto de resposta
 * @param {function} next - Próximo middleware
 */
const errorHandler = (err, req, res, next) => {
    // 1. Logs do Erro
    // Imprime o erro completo no console (útil para debug no ambiente de dev)
    console.error('❌ ERRO GLOBAL CAPTURADO:', err); 

    // 2. Define o status padrão e a mensagem de erro
    let statusCode = 500;
    let message = 'Ocorreu um erro interno no servidor.';
    let details = undefined;

    // 3. Verifica se é um Erro de Aplicação Conhecido (AppError)
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        // Se houver detalhes no AppError, eles são repassados
        details = err.details; 
    } 
    
    // 4. Trata Erros do Mongoose (Validação)
    // Embora já tratemos alguns no Controller, centralizar aqui é mais seguro.
    else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Erro de validação no formato dos dados.';
        // Mapeia mensagens de erro de validação do Mongoose
        details = Object.values(err.errors).map(val => val.message);
    }
    
    // 5. Trata Erros de Chave Única do MongoDB
    else if (err.name === 'MongoServerError' && err.code === 11000) {
        statusCode = 400;
        message = 'Conflito de dados: um registro com este ID ou campo único já existe.';
        // Opcional: Adicionar detalhes sobre o campo duplicado
        details = err.keyValue ? [`O campo ${Object.keys(err.keyValue)[0]} com valor ${Object.values(err.keyValue)[0]} já existe.`] : undefined;
    }

    // 6. Envia a resposta HTTP padronizada
    res.status(statusCode).json({
        status: 'error',
        message: message,
        details: details // Inclui detalhes apenas se existirem
    });
};

module.exports = errorHandler;