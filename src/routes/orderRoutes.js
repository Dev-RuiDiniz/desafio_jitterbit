// src/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Rota de Criação: POST /api/v1/orders
router.post('/orders', orderController.createOrder);

// Rota de Listagem: GET /api/v1/orders (Padrão RESTful para listar todos)
// Esta rota deve vir antes da rota de busca por ID
router.get('/orders', orderController.listOrders); 

// Rota de Listagem Alternativa: GET /api/v1/orders/list (Para aderência ao desafio)
router.get('/orders/list', orderController.listOrders); 

// Rota de Consulta por ID: GET /api/v1/orders/:orderId
router.get('/orders/:orderId', orderController.getOrderByID);

module.exports = router;