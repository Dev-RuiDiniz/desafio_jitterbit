// server.js

require('dotenv').config(); 
const app = require('./src/app'); 
const connectDB = require('./src/config/db.config'); // Conexão DB da Task 3

// Define a porta (REQUISITO DA TASK 5)
const PORT = process.env.PORT || 4000;

// Conecta ao DB e Inicia o servidor
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
        console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
}).catch(err => {
    console.error('Falha crítica ao iniciar a aplicação:', err);
    process.exit(1);
});