const Order = require('../models/Order');
const { mapOrder, AppError } = require('../utils/dataMapper');

/**
 * @function createOrder
 * @description ... (Função anterior, omitida por brevidade)
 */
const createOrder = async (req, res) => {
    // ... (Lógica de createOrder permanece a mesma)
    try {
        const orderData = mapOrder(req.body);
        const newOrder = new Order(orderData);
        await newOrder.save();

        res.status(201).json({
            message: 'Pedido criado com sucesso!',
            order: newOrder.toObject()
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        if (error.name === 'MongoServerError' && error.code === 11000) {
            return res.status(400).json({ message: `O número de pedido '${req.body.numeroPedido}' já existe.` });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: 'Erro de validação do banco de dados.', details: messages });
        }
        console.error('Erro interno no servidor ao criar pedido:', error);
        res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
};


/**
 * @function getOrderByID
 * @description Busca um pedido no MongoDB usando o orderId fornecido na URL.
 * @param {object} req - Objeto de requisição do Express
 * @param {object} res - Objeto de resposta do Express
 */
const getOrderByID = async (req, res) => {
    // 1. Recebe o orderId da URL (req.params)
    const { orderId } = req.params;

    try {
        // 2. Busca no MongoDB usando a chave orderId (que é única)
        // Usamos findOne para garantir que só um documento seja retornado.
        const order = await Order.findOne({ orderId: orderId });

        // 3. Tratamento de Erro: 404 Not Found
        if (!order) {
            return res.status(404).json({
                message: `Pedido com o ID '${orderId}' não encontrado.`
            });
        }

        // 4. Retorno: 200 OK (Encontrado)
        res.status(200).json({
            message: 'Pedido encontrado com sucesso.',
            order: order.toObject()
        });

    } catch (error) {
        // 5. Tratamento de Erro: 500 Internal Server Error
        console.error(`Erro ao buscar pedido com ID ${orderId}:`, error);
        res.status(500).json({
            message: 'Ocorreu um erro interno no servidor ao buscar o pedido.'
        });
    }
};

module.exports = {
    createOrder,
    getOrderByID // Exporta a nova função
};