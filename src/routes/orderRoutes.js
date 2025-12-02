// src/routes/orderRoutes.js (Adicionar a rota listOrders)

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Rota de Criação: POST /api/v1/orders
router.post('/orders', orderController.createOrder);

// Rota de Listagem: GET /api/v1/orders (Nova Rota)
router.get('/orders', orderController.listOrders); 

// Rota de Consulta por ID: GET /api/v1/orders/:orderId (Deve vir depois da rota de listagem)
router.get('/orders/:orderId', orderController.getOrderByID);

module.exports = router;