// src/utils/dataMapper.js

const AppError = require('./AppError'); 

const mapItem = (inputItem, index) => {
    if (!inputItem.idItem || !inputItem.quant || !inputItem.precoUnitario) {
        throw new AppError(`Item [${index + 1}]: Campos 'idItem', 'quant' e 'precoUnitario' são obrigatórios.`, 400);
    }
    // ... lógica de validação de valores ...

    const subtotal = inputItem.quant * inputItem.precoUnitario;

    return {
        productId: inputItem.idItem,
        name: inputItem.nomeProduto || 'Produto sem nome',
        quantity: inputItem.quant,
        price: inputItem.precoUnitario,
        subtotal: subtotal 
    };
};

const mapOrder = (inputOrder) => {
    if (!inputOrder.numeroPedido || !inputOrder.nomeCliente || !inputOrder.itensComprados || inputOrder.itensComprados.length === 0) {
        throw new AppError("Os campos 'numeroPedido', 'nomeCliente' e 'itensComprados' (com pelo menos um item) são obrigatórios.", 400);
    }
    
    const mappedItems = inputOrder.itensComprados.map(mapItem);
    const totalAmount = mappedItems.reduce((sum, item) => sum + item.subtotal, 0);

    return {
        orderId: inputOrder.numeroPedido,
        customerName: inputOrder.nomeCliente,
        items: mappedItems,
        totalAmount: totalAmount,
        status: 'Pendente', 
    };
};

module.exports = {
    mapOrder,
    mapItem,
    AppError 
};