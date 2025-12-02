// src/controllers/orderController.js

const Order = require('../models/Order');
const { mapOrder, AppError } = require('../utils/dataMapper');

const createOrder = async (req, res, next) => {
    try {
        const orderData = mapOrder(req.body); 
        const newOrder = new Order(orderData);
        await newOrder.save();

        res.status(201).json({
            message: 'Pedido criado com sucesso!',
            order: newOrder.toObject()
        });
    } catch (error) {
        // Agora, qualquer erro (AppError, ValidationError, 500) é repassado
        // ao middleware global de erro.
        next(error); 
    }
};

const getOrderByID = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findOne({ orderId: orderId });

        if (!order) {
            return res.status(404).json({ message: `Pedido com o ID '${orderId}' não encontrado.` });
        }

        res.status(200).json({ message: 'Pedido encontrado com sucesso.', order: order.toObject() });

    } catch (error) {
        console.error(`Erro ao buscar pedido com ID ${orderId}:`, error);
        res.status(500).json({ message: 'Ocorreu um erro interno no servidor ao buscar o pedido.' });
    }
};

/**
 * @function listOrders
 * @description Busca e retorna uma lista paginada de todos os pedidos no MongoDB.
 * @param {object} req - Objeto de requisição do Express (usado para req.query)
 * @param {object} res - Objeto de resposta do Express
 */
const listOrders = async (req, res) => {
    try {
        // --- Paginação Básica ---
        // 1. Recebe os parâmetros de paginação da query string (Ex: ?page=2&limit=10)
        const page = parseInt(req.query.page) || 1; // Página atual (padrão: 1)
        const limit = parseInt(req.query.limit) || 10; // Itens por página (padrão: 10)
        const skip = (page - 1) * limit; // Quantidade de documentos para pular

        // 2. Consulta o MongoDB:
        //    .find({}) -> Busca todos os documentos
        //    .skip(skip) -> Pula os documentos das páginas anteriores
        //    .limit(limit) -> Limita a quantidade de documentos retornados
        const orders = await Order.find({})
            .skip(skip)
            .limit(limit)
            // Opcional: ordenar por data de criação para consistência
            .sort({ createdAt: -1 }); 

        // 3. Opcional: Busca o total de documentos para metadados (para o frontend)
        const totalOrders = await Order.countDocuments();
        const totalPages = Math.ceil(totalOrders / limit);

        // 4. Retorno: 200 OK
        res.status(200).json({
            status: 'success',
            results: orders.length,
            pageInfo: {
                currentPage: page,
                totalPages: totalPages,
                totalResults: totalOrders,
                limit: limit
            },
            orders: orders.map(order => order.toObject())
        });

    } catch (error) {
        console.error('❌ Erro ao listar todos os pedidos:', error);
        res.status(500).json({
            message: 'Ocorreu um erro interno no servidor ao tentar listar os pedidos.'
        });
    }
};

/**
 * @function updateOrder
 * @description Atualiza um pedido existente. Permite atualização parcial (PATCH/PUT).
 * @param {object} req - Objeto de requisição do Express
 * @param {object} res - Objeto de resposta do Express
 */
const updateOrder = async (req, res) => {
    const { orderId } = req.params;
    const updateFields = {};

    try {
        // --- 1. Mapeamento e Validação de Campos ---
        
        // Mapeia e inclui apenas os campos permitidos para atualização no objeto 'updateFields'.
        if (req.body.nomeCliente) {
            updateFields.customerName = req.body.nomeCliente;
        }
        if (req.body.status) {
            updateFields.status = req.body.status;
        }

        // --- 2. Lógica de Atualização de Itens e Recálculo do Total ---
        // Se a lista de itens for fornecida, revalidamos e recalculamos o totalAmount.
        if (req.body.itensComprados && Array.isArray(req.body.itensComprados)) {
            
            // Reutilizamos a lógica de validação de itens do mapOrder.
            // Simula o objeto necessário para que o mapOrder valide os itens e calcule o total.
            const validationOrder = {
                numeroPedido: orderId, // Necessário para a validação do mapOrder
                nomeCliente: updateFields.customerName || "Placeholder", 
                itensComprados: req.body.itensComprados 
            };
            
            const mappedData = mapOrder(validationOrder);

            updateFields.items = mappedData.items;
            updateFields.totalAmount = mappedData.totalAmount;
        }
        
        // Verifica se há algo para atualizar
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                message: 'Nenhum campo válido fornecido para atualização. Campos aceitos: nomeCliente, status, itensComprados.'
            });
        }


        // --- 3. Mongoose Update ---
        // Busca o pedido pelo orderId e aplica as atualizações.
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderId },
            { $set: updateFields },
            { 
                new: true, // Retorna o documento modificado (o documento novo)
                runValidators: true // Garante que as validações do Schema (ex: min: 0) sejam executadas
            }
        );

        // --- 4. Tratamento 404 ---
        if (!updatedOrder) {
            return res.status(404).json({
                message: `Pedido com o ID '${orderId}' não encontrado para atualização.`
            });
        }

        // --- 5. Retorno 200 OK ---
        res.status(200).json({
            message: 'Pedido atualizado com sucesso!',
            order: updatedOrder.toObject()
        });

    } catch (error) {
        // --- 6. Tratamento de Erros ---
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        
        // Tratamento para erros de validação do Mongoose (ex: status faltando ou regra de item quebrada)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                message: 'Erro de validação do banco de dados ao atualizar.',
                details: messages
            });
        }
        
        console.error(`❌ Erro ao atualizar pedido com ID ${orderId}:`, error);
        res.status(500).json({
            message: 'Ocorreu um erro interno no servidor durante a atualização.'
        });
    }
};

/**
 * @function deleteOrder
 * @description Exclui um pedido existente no MongoDB pelo orderId.
 * @param {object} req - Objeto de requisição do Express
 * @param {object} res - Objeto de resposta do Express
 */
const deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        // Usa findOneAndDelete para buscar e remover o documento
        // Retorna o documento removido ou null se não for encontrado.
        const deletedOrder = await Order.findOneAndDelete({ orderId: orderId });

        // 1. Tratamento 404 (Pedido não encontrado)
        if (!deletedOrder) {
            return res.status(404).json({
                message: `Pedido com o ID '${orderId}' não encontrado para exclusão.`
            });
        }

        // 2. Retorno 204 No Content (Sucesso na exclusão)
        // O status 204 indica sucesso, mas não há corpo de resposta (body).
        res.status(204).send();

    } catch (error) {
        // 3. Tratamento de Erro: 500 Internal Server Error
        console.error(`❌ Erro ao excluir pedido com ID ${orderId}:`, error);
        res.status(500).json({
            message: 'Ocorreu um erro interno no servidor durante a exclusão.'
        });
    }
};

module.exports = {
    createOrder,
    getOrderByID,
    listOrders,
    updateOrder,
    deleteOrder // <-- Exporta a nova função
};