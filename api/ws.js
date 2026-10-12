import http from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });

    res.end(JSON.stringify({
      status: 'ok',
      websocket: '/ws',
      clientes: wss.clients.size
    }));

    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8'
  });

  res.end('Laboratorio de Faraday activo');
});

const wss = new WebSocketServer({
  server,
  path: '/ws'
});

let totalMensajes = 0;

wss.on('connection', (socket, request) => {
  const ip = request.socket.remoteAddress;

  console.log('[WS] Cliente conectado:', ip);
  console.log('[WS] Clientes activos:', wss.clients.size);

  socket.on('message', (data, isBinary) => {
    totalMensajes++;

    const mensaje = data.toString();

    console.log(
      `[WS] Mensaje #${totalMensajes}: ${mensaje}`
    );

    let reenviados = 0;

    for (const client of wss.clients) {
      if (
        client !== socket &&
        client.readyState === WebSocket.OPEN
      ) {
        client.send(data, { binary: isBinary });
        reenviados++;
      }
    }

    console.log(
      `[WS] Mensaje recibido. Clientes destinatarios: ${reenviados}`
    );
  });

  socket.on('close', (code, reason) => {
    console.log(
      '[WS] Cliente desconectado:',
      code,
      reason.toString()
    );
  });

  socket.on('error', (error) => {
    console.error('[WS] Error:', error.message);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[HTTP] Servidor escuchando en puerto ${PORT}`);
  console.log('[WS] Ruta WebSocket: /ws');
});