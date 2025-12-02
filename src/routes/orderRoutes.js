const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Rota para a Criação de um Novo Pedido
router.post('/orders', orderController.createOrder);

// Rota para a Busca de Pedido por ID (GET /api/v1/orders/:orderId)
router.get('/orders/:orderId', orderController.getOrderByID);

module.exports = router;