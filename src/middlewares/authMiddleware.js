const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

/**
 * Middleware para proteger rotas usando JWT.
 * O token deve ser enviado no cabeçalho Authorization no formato: "Bearer [token]".
 */
const protect = (req, res, next) => {
    let token;

    // 1. Checar se o cabeçalho Authorization existe e está no formato "Bearer token"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Extrai o token (o segundo item do array após o split)
        token = req.headers.authorization.split(' ')[1];
    }

    // 2. Se não houver token, retorna erro 401
    if (!token) {
        // Retorna AppError para ser capturado pelo errorHandler.js
        return next(new AppError('Acesso negado. Token de autenticação não fornecido.', 401));
    }

    try {
        // 3. Verificar e decodificar o token usando a chave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Opcional: Anexar a informação decodificada do usuário à requisição
        // Ex: { userId: '123' }
        req.user = decoded; 
        
        // 4. Se for válido, prossegue para o Controller
        next(); 
    } catch (error) {
        // Lida com tokens inválidos (expirado, chave errada, malformado)
        return next(new AppError('Token inválido ou expirado. Acesso não autorizado.', 403));
    }
};

module.exports = protect;