// 1. Carrega as variáveis de ambiente
require('dotenv').config(); 

// 2. Importa a aplicação Express e a função de conexão DB
const app = require('./src/app'); 
const connectDB = require('./src/config/db.config');

// 3. Define a porta
const PORT = process.env.PORT || 4000;

// 4. Conecta ao DB e só então inicia o servidor
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Conexão com o MongoDB estabelecida com sucesso!`);
        console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Falha crítica ao iniciar a aplicação:', err);
    process.exit(1);
});