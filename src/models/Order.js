// src/models/Order.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- 1. Sub-Schema para Itens Embutidos ---
// Este schema define a estrutura de cada item dentro do array 'items'.
const ItemSchema = new Schema({
    // Mapeado do JSON de entrada (idItem)
    productId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false }); // Não precisamos de um _id separado para o sub-documento (melhor performance)


// --- 2. Schema Principal para Pedidos ---
const OrderSchema = new Schema({
    // Mapeado do JSON de entrada (numeroPedido)
    orderId: {
        type: String,
        required: true,
        unique: true, // Garante que não haja pedidos duplicados com o mesmo ID
        index: true   // Cria um índice no MongoDB para buscas rápidas
    },
    customerName: {
        type: String,
        required: true,
    },
    // Campo 'totalAmount' que reflete o 'totalAmount' do nosso Data Mapper
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        default: 'Pendente'
    },
    // O campo 'items' usa o Sub-Schema definido acima.
    items: {
        type: [ItemSchema], // Array do nosso Sub-Schema
        required: true,
        validate: {
            validator: (arr) => arr.length > 0,
            message: 'Um pedido deve conter pelo menos um item.'
        }
    },
    // O Mongoose gerencia 'createdAt' e 'updatedAt' automaticamente
}, { 
    timestamps: true 
}); 

// Cria o Model 'Order' usando o Schema, que irá interagir com a collection 'orders' no MongoDB.
const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;