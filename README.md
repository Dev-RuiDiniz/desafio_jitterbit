# 🚀 Desafio Jitterbit: API de Gerenciamento de Pedidos

## 📄 Descrição do Projeto

Esta é uma API RESTful desenvolvida em Node.js para o desafio de programação da Jitterbit. O objetivo principal é gerenciar o ciclo de vida completo de Pedidos (Orders), incluindo a criação com validação de dados de entrada, cálculo automático de valores e as operações CRUD (Create, Read, Update, Delete).

A arquitetura do projeto segue um padrão MVC (Model-View-Controller, adaptado para APIs), utilizando um **Middleware Global de Erros** para tratamento robusto de exceções e **indexação Mongoose** para otimização de consultas.

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
| :--- | :--- | :--- |
| **Node.js** | 22.x | Ambiente de execução JavaScript. |
| **Express** | 5.x | Framework web para roteamento e middlewares. |
| **Mongoose** | 8.x | ODM (Object Data Modeling) para interação com o MongoDB. |
| **MongoDB** | 6.x / 7.x | Banco de dados NoSQL utilizado para persistência dos dados. |
| **dotenv** | 17.x | Gerenciamento de variáveis de ambiente. |

## ⚙️ Setup e Como Rodar Localmente

Siga os passos abaixo para clonar o repositório, instalar as dependências e iniciar a API localmente.

### Pré-requisitos

* Node.js (v18+) e npm instalados.
* Serviço MongoDB ativo (padrão na porta `27017`).

### 1. Clonar o Repositório

```bash
git clone [https://github.com/Dev-RuiDiniz/desafio_jitterbit](https://github.com/Dev-RuiDiniz/desafio_jitterbit)
cd desafio_jitterbit
```

### 2. Instalar as Dependências

```Bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo chamado .env na raiz do projeto e adicione as seguintes variáveis.

```Snippet de código
# Variável de Ambiente
NODE_ENV=development

# Porta do Servidor
PORT=4000

# URI de Conexão com o MongoDB
# Certifique-se de que o serviço do MongoDB esteja rodando!
MONGODB_URI=mongodb://localhost:27017/desafio_jitterbit
```

### 4. Iniciar o Servidor

```bash
node server.js
```

Se a conexão com o banco de dados for bem-sucedida, você verá:

```
✅ Conexão com o MongoDB estabelecida com sucesso!
🚀 Servidor rodando em http://localhost:4000
```

## 📝 Instruções de Uso da API (Endpoints)

A API está acessível através da rota base: http://localhost:4000/api/v1.

## 🔗 Coleção Postman

Para testar todos os endpoints de forma eficiente, utilize a coleção Postman que inclui exemplos de payloads e validação de status codes:
[Link para a Coleção Postman](https://.postman.co/workspace/My-Workspace~a5d27ff0-f9d9-4880-8446-7a69fc32d761/collection/46553391-7437a606-abc1-42a6-9b54-f6f10608f6ca?action=share&creator=46553391)

### Endpoints CRUD

Todos os endpoints utilizam o header Content-Type: application/json.

| Método | Rota | Descrição | Status de Retorno |
| :--- | :--- | :--- | :--- |
| **POST** | /orders | Cria um novo pedido. | 201 Created, 400 Bad Request |
| **GET** | /orders | Lista pedidos (suporta ?page= e &limit= para paginação) | .200 OK |
| **GET** | /orders/:orderId | Busca um pedido específico por ID. | 200 OK, 404 Not Found |
| **PUT** | /orders/:orderId | Atualiza um pedido existente. | 200 OK, 404 Not Found |
| **DELETE** | /orders/:orderId | Exclui um pedido permanentemente. | 204 No Content, 404 Not Found |

### 🔗 Link do Repositório

Você pode acessar o código-fonte completo deste projeto em: (https://github.com/Dev-RuiDiniz/desafio_jitterbit)