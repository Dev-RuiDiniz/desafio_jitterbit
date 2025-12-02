const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error("❌ ERRO CRÍTICO: MONGODB_URI não está definida no arquivo .env.");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        // console.log('✅ Conexão com o MongoDB estabelecida com sucesso!'); // Movido para server.js
    } catch (error) {
        console.error('❌ ERRO AO CONECTAR COM O MONGODB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;