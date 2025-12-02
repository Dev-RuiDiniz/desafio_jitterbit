// src/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Rota POST /api/v1/orders
// Mapeia a URL para a função createOrder do Controller
router.post('/orders', orderController.createOrder);

module.exports = router;