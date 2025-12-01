// src/utils/AppError.js

/**
 * @class AppError
 * @description Classe de erro customizada para lidar com erros de aplicação
 * e garantir que eles tenham um código de status HTTP associado.
 */
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        // Permite que o nome do erro seja o nome da classe
        this.name = this.constructor.name; 
        
        // Captura o stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;