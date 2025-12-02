// src/models/Order.js (ATUALIZADO)

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Sub-Schema para Itens Embutidos
const ItemSchema = new Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 }
}, { _id: false });

// Schema Principal para Pedidos
const OrderSchema = new Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        index: true // ✅ GARANTIDO: Índice para busca rápida por ID (GET /orders/:orderId)
    },
    customerName: { type: String, required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, required: true, default: 'Pendente' },
    items: {
        type: [ItemSchema],
        required: true,
        validate: {
            validator: (arr) => arr.length > 0,
            message: 'Um pedido deve conter pelo menos um item.'
        }
    },
}, { 
    timestamps: true // Adiciona createdAt e updatedAt
}); 

// ✅ Otimização: Adiciona índice para ordenação por data (listagem/relatórios)
OrderSchema.index({ createdAt: -1 }); 

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;