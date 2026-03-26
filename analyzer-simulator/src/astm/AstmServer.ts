import * as net from 'net';
import { buildAck, buildNak, buildEot, buildEnq } from './AstmBuilder';
import { ENQ, EOT, ACK, NAK, STX, ETX, ENQ_BUF, EOT_BUF } from './AstmConstants';

export type AstmMessageHandler = (raw: string, socket: net.Socket) => void;
export type AstmConnectionHandler = (socket: net.Socket, connected: boolean) => void;

export class AstmServer {
  private server: net.Server;
  private onMessage: AstmMessageHandler;
  private onConnectionChange: AstmConnectionHandler;
  private clients: Set<net.Socket> = new Set();

  constructor(
    private port: number,
    onMessage: AstmMessageHandler,
    onConnectionChange: AstmConnectionHandler,
  ) {
    this.onMessage = onMessage;
    this.onConnectionChange = onConnectionChange;
    this.server = net.createServer(socket => this.handleClient(socket));
  }

  private handleClient(socket: net.Socket): void {
    this.clients.add(socket);
    this.onConnectionChange(socket, true);
    console.log(`[ASTM] Client connected: ${socket.remoteAddress}:${socket.remotePort}`);

    let buffer = '';
    let inFrame = false;

    socket.on('data', (data: Buffer) => {
      for (let i = 0; i < data.length; i++) {
        const byte = data[i];

        if (byte === ENQ) {
          buffer = '';
          inFrame = false;
          socket.write(buildAck());
          console.log('[ASTM] <- ENQ | -> ACK');
        } else if (byte === EOT) {
          if (buffer.length > 0) {
            this.onMessage(buffer, socket);
            buffer = '';
          }
          console.log('[ASTM] <- EOT');
          inFrame = false;
        } else if (byte === STX) {
          inFrame = true;
        } else if (byte === ETX) {
          inFrame = false;
          socket.write(buildAck()); // ACK each received frame
        } else if (byte === ACK) {
          console.log('[ASTM] <- ACK');
        } else if (byte === NAK) {
          console.log('[ASTM] <- NAK');
        } else if (inFrame || byte === 0x0d || byte === 0x0a) {
          if (byte !== 0x0d && byte !== 0x0a) {
            buffer += String.fromCharCode(byte);
          } else {
            buffer += String.fromCharCode(byte);
          }
        }
      }
    });

    socket.on('close', () => {
      this.clients.delete(socket);
      this.onConnectionChange(socket, false);
      console.log('[ASTM] Client disconnected');
    });

    socket.on('error', (err) => {
      console.error('[ASTM] Socket error:', err.message);
      this.clients.delete(socket);
    });
  }

  sendToAll(buffers: Buffer[]): void {
    this.clients.forEach(socket => {
      if (!socket.destroyed) {
        socket.write(ENQ_BUF);          // Announce result transmission
        for (const buf of buffers) socket.write(buf);
        socket.write(EOT_BUF);          // Signal end of transmission
      }
    });
  }

  sendAck(socket: net.Socket): void {
    if (!socket.destroyed) socket.write(buildAck());
  }

  start(): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(this.port, '0.0.0.0', () => {
        console.log(`[ASTM] TCP server listening on port ${this.port}`);
        resolve();
      });
    });
  }

  stop(): void {
    this.server.close();
  }
}
