import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

const app = express();
const server = createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', (socket) => {
  console.log('Nueva conexion WebSocket');

  socket.on('message', (data) => {
    // Reenviar datos a los otros clientes conectados
    for (const client of wss.clients) {
      if (
        client !== socket &&
        client.readyState === WebSocket.OPEN
      ) {
        client.send(data.toString());
      }
    }
  });

  socket.on('error', (error) => {
    console.error('Error WebSocket:', error.message);
  });

  socket.on('close', () => {
    console.log('Conexion cerrada');
  });
});

app.get('/', (req, res) => {
  res.status(200).send('Servidor WebSocket del laboratorio activo');
});

export default server;