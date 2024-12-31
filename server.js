const express = require('express');
const WebSocket = require('ws');
const fetch = require('node-fetch'); // Pacote para fazer requisições HTTP

// Configuração do servidor HTTP
const app = express();
const PORT = process.env.PORT || 6040;

// Middleware para processar JSON nas requisições
app.use(express.json());

// Rota de exemplo
app.get('/', (req, res) => {
    res.send('Servidor HTTP e WebSocket funcionando!');
});

// Rota para criar pedidos
app.post('/create-order', async (req, res) => {
    try {
        const mutation = `
            mutation CreateOrder($input: order_insert_input!) {
                insert_order_one(object: $input) {
                    id
                }
            }
        `;

        const variables = {
            input: req.body.input,
        };

        const response = await fetch("https://backend.pedepro.com.br/v1/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-hasura-admin-secret": "dz9uee0D8fyyYzQsv2piE1MLcVZklkc7", // Coloque a chave secreta do Hasura
            },
            body: JSON.stringify({
                query: mutation,
                variables,
            }),
        });

        const result = await response.json();

        if (result.errors) {
            console.error("Erros retornados pela API:", result.errors);
            return res.status(500).json({ errors: result.errors });
        }

        res.status(200).json(result.data.insert_order_one);
    } catch (error) {
        console.error("Erro ao processar pedido:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
});

// Criar servidor HTTP
const server = app.listen(PORT, () => {
    console.log(`Servidor HTTP rodando na porta ${PORT}`);
});

// Configuração do servidor WebSocket
const wss = new WebSocket.Server({ server });

// Evento de conexão WebSocket
wss.on('connection', (ws) => {
    console.log('Novo cliente conectado via WebSocket!');

    // Mensagem recebida do cliente
    ws.on('message', (message) => {
        console.log(`Mensagem recebida: ${message}`);
        // Enviar uma resposta de volta ao cliente
        ws.send(`Servidor recebeu: ${message}`);
    });

    // Cliente desconectado
    ws.on('close', () => {
        console.log('Cliente desconectado.');
    });
});

process.on('uncaughtException', (err) => {
    console.error('Erro não capturado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Rejeição não tratada:', reason);
});
