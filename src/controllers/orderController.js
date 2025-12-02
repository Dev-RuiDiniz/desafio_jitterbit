const Order = require('../models/Order'); // Importa o Model Mongoose
const { mapOrder, AppError } = require('../utils/dataMapper'); // Importa o Mapper e o Erro Customizado

/**
 * @function createOrder
 * @description Recebe uma requisição POST, mapeia os dados, valida e cria um novo pedido.
 * @param {object} req - Objeto de requisição do Express
 * @param {object} res - Objeto de resposta do Express
 */
const createOrder = async (req, res) => {
    try {
        // 1. Recebe o body e Chama o dataMapper para transformar e validar os dados.
        // O dataMapper lançará um AppError (status 400) se os dados forem inválidos.
        const orderData = mapOrder(req.body);

        // 2. Cria uma nova instância do Model Order
        // O Mongoose garante que o Schema e as validações sejam respeitados.
        const newOrder = new Order(orderData);

        // 3. Salva o novo pedido no MongoDB
        // A função .save() executa a persistência.
        await newOrder.save();

        // Retorno: 201 Created (Sucesso)
        res.status(201).json({
            message: 'Pedido criado com sucesso!',
            order: newOrder.toObject() // Retorna o objeto persistido
        });

    } catch (error) {
        // 4. Tratamento de Erros
        
        // Se o erro foi lançado pelo nosso AppError (Validação de Input)
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }
        
        // Se o erro for do Mongoose (ex: orderId duplicado ou falha de validação de Schema)
        if (error.name === 'MongoServerError' && error.code === 11000) {
            // Código 11000 é para erro de chave única (orderId)
            return res.status(400).json({
                message: `O número de pedido '${req.body.numeroPedido}' já existe.`
            });
        }
        
        // Tratamento para outros erros de validação Mongoose (ex: campos required faltando)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                message: 'Erro de validação do banco de dados.',
                details: messages
            });
        }
        
        // Erro genérico (500 Internal Server Error)
        console.error('Erro interno no servidor ao criar pedido:', error);
        res.status(500).json({
            message: 'Ocorreu um erro interno no servidor.'
        });
    }
};

module.exports = {
    createOrder
};