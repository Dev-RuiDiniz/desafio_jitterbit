// src/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Rota de Criação: POST /api/v1/orders
router.post('/orders', orderController.createOrder);

// Rota de Listagem: GET /api/v1/orders
router.get('/orders', orderController.listOrders); 

// Rota de Listagem Alternativa: GET /api/v1/orders/list
router.get('/orders/list', orderController.listOrders); 

// Rota de Atualização: PUT /api/v1/orders/:orderId
router.put('/orders/:orderId', orderController.updateOrder);

// Rota de Exclusão: DELETE /api/v1/orders/:orderId (NOVA ROTA)
router.delete('/orders/:orderId', orderController.deleteOrder);

// Rota de Consulta por ID: GET /api/v1/orders/:orderId (Deve ser a última para evitar conflitos)
router.get('/orders/:orderId', orderController.getOrderByID);

module.exports = router;