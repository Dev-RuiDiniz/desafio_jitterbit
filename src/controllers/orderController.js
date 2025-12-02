// src/controllers/orderController.js

const Order = require('../models/Order');
const { mapOrder, AppError } = require('../utils/dataMapper');

const createOrder = async (req, res) => {
    try {
        const orderData = mapOrder(req.body);
        const newOrder = new Order(orderData);
        await newOrder.save();

        res.status(201).json({ message: 'Pedido criado com sucesso!', order: newOrder.toObject() });

    } catch (error) {
        // ... (Lógica de tratamento de erros AppError, MongoServerError e ValidationError) ...
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        if (error.name === 'MongoServerError' && error.code === 11000) {
            return res.status(400).json({ message: `O número de pedido '${req.body.numeroPedido}' já existe.` });
        }
        // ... (outros erros e 500) ...
        res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
};

const getOrderByID = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findOne({ orderId: orderId });

        if (!order) {
            return res.status(404).json({ message: `Pedido com o ID '${orderId}' não encontrado.` });
        }

        res.status(200).json({ message: 'Pedido encontrado com sucesso.', order: order.toObject() });

    } catch (error) {
        console.error(`Erro ao buscar pedido com ID ${orderId}:`, error);
        res.status(500).json({ message: 'Ocorreu um erro interno no servidor ao buscar o pedido.' });
    }
};

/**
 * @function listOrders
 * @description Busca e retorna uma lista paginada de todos os pedidos no MongoDB.
 * @param {object} req - Objeto de requisição do Express (usado para req.query)
 * @param {object} res - Objeto de resposta do Express
 */
const listOrders = async (req, res) => {
    try {
        // --- Paginação Básica ---
        // 1. Recebe os parâmetros de paginação da query string (Ex: ?page=2&limit=10)
        const page = parseInt(req.query.page) || 1; // Página atual (padrão: 1)
        const limit = parseInt(req.query.limit) || 10; // Itens por página (padrão: 10)
        const skip = (page - 1) * limit; // Quantidade de documentos para pular

        // 2. Consulta o MongoDB:
        //    .find({}) -> Busca todos os documentos
        //    .skip(skip) -> Pula os documentos das páginas anteriores
        //    .limit(limit) -> Limita a quantidade de documentos retornados
        const orders = await Order.find({})
            .skip(skip)
            .limit(limit)
            // Opcional: ordenar por data de criação para consistência
            .sort({ createdAt: -1 }); 

        // 3. Opcional: Busca o total de documentos para metadados (para o frontend)
        const totalOrders = await Order.countDocuments();
        const totalPages = Math.ceil(totalOrders / limit);

        // 4. Retorno: 200 OK
        res.status(200).json({
            status: 'success',
            results: orders.length,
            pageInfo: {
                currentPage: page,
                totalPages: totalPages,
                totalResults: totalOrders,
                limit: limit
            },
            orders: orders.map(order => order.toObject())
        });

    } catch (error) {
        console.error('❌ Erro ao listar todos os pedidos:', error);
        res.status(500).json({
            message: 'Ocorreu um erro interno no servidor ao tentar listar os pedidos.'
        });
    }
};

module.exports = {
    createOrder,
    getOrderByID,
    listOrders // <-- Exporta a nova função
};