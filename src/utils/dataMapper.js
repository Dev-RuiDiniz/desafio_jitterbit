/**
 * @function mapItem
 * @description Mapeia o objeto de item de entrada para o formato do nosso Schema Mongoose.
 * @param {object} inputItem - Item conforme enviado pelo cliente.
 * @returns {object} Objeto de item no formato Mongoose.
 */
const mapItem = (inputItem) => {
    // Calculamos o subtotal aqui para garantir que a lógica de negócio esteja centralizada
    const subtotal = inputItem.quant * inputItem.precoUnitario;

    return {
        // Mapeamento: idItem -> productId
        productId: inputItem.idItem,
        name: inputItem.nomeProduto || 'Produto não especificado',
        // Mapeamento: quant -> quantity
        quantity: inputItem.quant,
        price: inputItem.precoUnitario,
        subtotal: subtotal 
    };
};

/**
 * @function mapOrder
 * @description Mapeia o JSON completo do pedido de entrada para o formato Order do nosso Schema Mongoose.
 * @param {object} inputOrder - Pedido conforme enviado pelo cliente.
 * @returns {object} Objeto de pedido no formato Mongoose (pronto para validação ou salvamento).
 */
const mapOrder = (inputOrder) => {
    // Mapeia e calcula o subtotal para cada item
    const mappedItems = inputOrder.itensComprados.map(mapItem);

    // Calcula o valor total do pedido a partir dos subtotais dos itens mapeados (BOA PRÁTICA!)
    const totalAmount = mappedItems.reduce((sum, item) => sum + item.subtotal, 0);

    return {
        // Mapeamento: numeroPedido -> orderId
        orderId: inputOrder.numeroPedido,
        // Mapeamento: nomeCliente -> customerName
        customerName: inputOrder.nomeCliente,
        
        items: mappedItems,
        totalAmount: totalAmount,
        
        // Define um status inicial padrão para pedidos recém-criados
        status: 'Pendente', 
        
        // O Mongoose adicionará automaticamente 'createdAt' e 'updatedAt' se usarmos timestamps no schema.
    };
};

module.exports = {
    mapOrder,
    mapItem
};