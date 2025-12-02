const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// 1. Importa o novo middleware de autenticação
const protect = require('../middlewares/authMiddleware');

// Rotas:
// Rota de criação de pedidos (PROTEGIDA)
// O middleware 'protect' é executado antes de orderController.createOrder
router.post('/orders', protect, orderController.createOrder); 

// Rotas Públicas (Sem autenticação):
router.get('/orders/list', orderController.listOrders);
router.get('/orders/:orderId', orderController.getOrderById);
router.put('/orders/:orderId', orderController.updateOrder);
router.delete('/orders/:orderId', orderController.deleteOrder);

module.exports = router;