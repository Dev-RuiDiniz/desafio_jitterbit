// Importa o dotenv para carregar as variáveis de ambiente primeiro
require('dotenv').config(); 

// Importa a aplicação Express configurada
const app = require('./src/app'); 
// IMPORTAÇÃO NOVA: Módulo de conexão com o DB
const connectDB = require('./src/config/db.config');

// Define a porta
const PORT = process.env.PORT || 4000;

// Conectar ao banco de dados e só depois iniciar o servidor
connectDB().then(() => {
    // Inicia o servidor APÓS a conexão bem-sucedida (melhor prática de inicialização)
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
        console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
}).catch(err => {
    // Tratamento de erro caso connectDB() falhe antes de iniciar a escuta
    console.error('Falha crítica ao iniciar a aplicação:', err);
    process.exit(1);
});