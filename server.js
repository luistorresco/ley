import http from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  res.end('Laboratorio de Faraday activo');
});

const wss = new WebSocketServer({
  server,
  path: '/ws'
});

wss.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('message', (data) => {
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data.toString());
      }
    }
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log('Servidor iniciado');
});