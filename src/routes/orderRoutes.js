// src/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Rota de Criação: POST /api/v1/orders
router.post('/orders', orderController.createOrder);

// Rota de Consulta por ID: GET /api/v1/orders/:orderId
router.get('/orders/:orderId', orderController.getOrderByID);

module.exports = router;