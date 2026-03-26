import { WebSocketServer, WebSocket } from 'ws';
import { SimulatorStateData } from '../types';

export class SimulatorWebSocketServer {
  private wss: WebSocketServer;
  private commandHandlers: Map<string, (data: any, ws: WebSocket) => void> = new Map();
  private connectionHandlers: Array<(ws: WebSocket) => void> = [];

  constructor(port: number) {
    this.wss = new WebSocketServer({ port });
    console.log(`[WS] WebSocket server listening on port ${port}`);

    this.wss.on('connection', (ws, req) => {
      console.log(`[WS] Client connected from ${req.socket.remoteAddress}`);
      for (const handler of this.connectionHandlers) {
        handler(ws);
      }

      ws.on('message', (data) => {
        try {
          const msg = JSON.parse(data.toString());
          // Route by instrumentCode:command or just command
          const key = msg.instrumentCode
            ? `${msg.instrumentCode}:${msg.command}`
            : msg.command;
          const handler = this.commandHandlers.get(key) ?? this.commandHandlers.get(msg.command ?? '');
          if (handler) {
            handler(msg.data || {}, ws);
          }
        } catch (e) {
          console.error('[WS] Invalid message:', e);
        }
      });

      ws.on('close', () => {
        console.log('[WS] Client disconnected');
      });
    });
  }

  /** Register a callback for each new client connection (for sending initial state). */
  onNewConnection(handler: (ws: WebSocket) => void): void {
    this.connectionHandlers.push(handler);
  }

  /** Register command handler, optionally scoped to an instrumentCode. */
  onCommand(
    command: string,
    instrumentCodeOrHandler: string | ((data: any, ws: WebSocket) => void),
    handler?: (data: any, ws: WebSocket) => void,
  ): void {
    if (typeof instrumentCodeOrHandler === 'function') {
      this.commandHandlers.set(command, instrumentCodeOrHandler);
    } else {
      this.commandHandlers.set(`${instrumentCodeOrHandler}:${command}`, handler!);
    }
  }

  /** Send to all clients, tagged with optional instrumentCode. */
  broadcast(event: string, data: unknown, instrumentCode?: string): void {
    const msg = JSON.stringify({
      event,
      instrumentCode: instrumentCode ?? null,
      data,
      timestamp: new Date().toISOString(),
    });
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) client.send(msg);
    });
  }

  /** Send state-update event to all clients. */
  broadcastStateUpdate(state: SimulatorStateData, instrumentCode?: string): void {
    this.broadcast('ANALYZER_STATE_UPDATE', { state }, instrumentCode);
  }

  /** Send to a specific client. */
  sendToClient(ws: WebSocket, event: string, data: unknown, instrumentCode?: string): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        event,
        instrumentCode: instrumentCode ?? null,
        data,
        timestamp: new Date().toISOString(),
      }));
    }
  }

  close(): void {
    this.wss.close();
  }
}
