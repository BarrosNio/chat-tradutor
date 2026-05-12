const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  maxHttpBufferSize: 1e8 // Permitir arquivos de áudio de até 100MB
});

// Servir os arquivos estáticos (o index.html)
app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    console.log('Um usuário conectou:', socket.id);

    // Receber mensagem de um usuário e enviar para os outros
    socket.on('chatMessage', (msgData) => {
        // msgData contém o texto, a tradução e a linguagem
        socket.broadcast.emit('chatMessage', msgData);
    });

    // Receber wink de um usuário e enviar para os outros
    socket.on('wink', (type) => {
        socket.broadcast.emit('wink', type);
    });

    // Receber arquivo de áudio
    socket.on('audioFile', (fileData) => {
        socket.broadcast.emit('audioFile', fileData);
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectou:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse http://localhost:${PORT} no seu navegador para testar.`);
});
