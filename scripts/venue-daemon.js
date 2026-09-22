const { WebSocketServer } = require('ws');

const PORT = 8081;

// Minimal Venue Daemon Implementation
// Provides a local WebSocket endpoint to simulate physical node connectivity
console.log(`[SYSTEM] Initializing Local Venue Node Simulator...`);

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', function connection(ws) {
  console.log('[WSS] Client connected to Venue Daemon.');
  
  ws.on('message', function message(data) {
    try {
        const payload = JSON.parse(data.toString());
        console.log('[WSS] Received action:', payload.action || 'UNKNOWN');
        if (payload.action === 'PING') {
            ws.send(JSON.stringify({ action: 'PONG', status: 'OK' }));
        } else {
            ws.send(JSON.stringify({ action: 'ERROR', status: 'UNSUPPORTED_ACTION' }));
        }
    } catch (e) {
        console.error('[WSS] Failed to parse message as JSON:', e.message);
        ws.send(JSON.stringify({ action: 'ERROR', status: 'INVALID_JSON' }));
    }
  });

  ws.on('close', () => {
      console.log('[WSS] Client disconnected.');
  });

  ws.send(JSON.stringify({ 
      action: 'CONNECTION_ESTABLISHED', 
      nodeId: 'DEV-NODE-LOCAL' 
  }));
});

console.log(`[WSS] Daemon listening on ws://localhost:${PORT}`);
