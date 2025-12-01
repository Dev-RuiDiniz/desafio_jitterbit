const AppError = require('./AppError'); // Importa a classe de erro customizada

/**
 * @function mapItem
 * @description Mapeia e valida o objeto de item de entrada.
 * @param {object} inputItem - Item conforme enviado pelo cliente.
 * @returns {object} Objeto de item no formato Mongoose.
 */
const mapItem = (inputItem, index) => {
    // Validação de Campos OBRIGATÓRIOS do Item
    if (!inputItem.idItem || !inputItem.quant || !inputItem.precoUnitario) {
        throw new AppError(
            `Item [${index + 1}]: Campos 'idItem', 'quant' e 'precoUnitario' são obrigatórios.`, 
            400 // Código HTTP Bad Request
        );
    }
    
    if (inputItem.quant <= 0 || inputItem.precoUnitario < 0) {
        throw new AppError(
            `Item [${index + 1}]: Quantidade deve ser positiva e Preço Unitário não pode ser negativo.`, 
            400
        );
    }

    const subtotal = inputItem.quant * inputItem.precoUnitario;

    return {
        productId: inputItem.idItem,
        name: inputItem.nomeProduto || 'Produto sem nome', // Um valor padrão se ausente
        quantity: inputItem.quant,
        price: inputItem.precoUnitario,
        subtotal: subtotal 
    };
};

/**
 * @function mapOrder
 * @description Mapeia e valida o JSON completo do pedido de entrada.
 * @param {object} inputOrder - Pedido conforme enviado pelo cliente.
 * @returns {object} Objeto de pedido no formato Mongoose.
 */
const mapOrder = (inputOrder) => {
    // Validação de Campos OBRIGATÓRIOS do Pedido
    if (!inputOrder.numeroPedido || !inputOrder.nomeCliente || !inputOrder.itensComprados || inputOrder.itensComprados.length === 0) {
        throw new AppError(
            "Os campos 'numeroPedido', 'nomeCliente' e 'itensComprados' (com pelo menos um item) são obrigatórios.", 
            400 // Código HTTP 400 (Bad Request)
        );
    }
    
    // Mapeia e valida o subtotal para cada item
    const mappedItems = inputOrder.itensComprados.map(mapItem);

    // O valor total ('totalAmount' no nosso schema) será calculado aqui, então não precisamos dele na entrada.
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
    AppError // Exportamos o erro para ser usado no Controller
};