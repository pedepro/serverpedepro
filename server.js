const express = require('express');
const WebSocket = require('ws');

// Configuração do servidor HTTP
const app = express();
const PORT = 6040;

// Middleware para processar JSON nas requisições
app.use(express.json());

// Rota de exemplo
app.get('/', (req, res) => {
    res.send('Servidor HTTP e WebSocket funcionando!');
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
