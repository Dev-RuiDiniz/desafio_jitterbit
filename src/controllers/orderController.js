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

module.exports = {
    createOrder,
    getOrderByID
};