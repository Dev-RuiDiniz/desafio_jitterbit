// src/config/db.config.js

const mongoose = require('mongoose');

/**
 * @function connectDB
 * @description Tenta conectar ao MongoDB utilizando a URI do ambiente (.env).
 */
const connectDB = async () => {
    const uri = process.env.MONGODB_URI;

    // Verificação de segurança: A URI é crítica para o funcionamento da aplicação.
    if (!uri) {
        console.error("❌ ERRO CRÍTICO: MONGODB_URI não está definida no arquivo .env.");
        process.exit(1); // Encerra o processo se a variável crucial estiver faltando.
    }

    try {
        await mongoose.connect(uri);
        
        console.log('✅ Conexão com o MongoDB estabelecida com sucesso!');
    } catch (error) {
        console.error('❌ ERRO AO CONECTAR COM O MONGODB:', error.message);
        // O erro de conexão é fatal, então encerramos a aplicação.
        process.exit(1);
    }
};

module.exports = connectDB;