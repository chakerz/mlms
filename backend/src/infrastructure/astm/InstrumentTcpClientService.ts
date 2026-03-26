import * as net from 'net';
import { Injectable, Logger } from '@nestjs/common';
import { ENQ_BUF, EOT_BUF, ACK_BUF } from './AstmFrameBuilder';

const ACK = 0x06;
const ENQ = 0x05;
const EOT = 0x04;
const ETX = 0x03;

export interface TcpSendResult {
  success: boolean;
  rawResponse: string;
  error?: string;
}

@Injectable()
export class InstrumentTcpClientService {
  private readonly logger = new Logger(InstrumentTcpClientService.name);

  async sendAndReceive(
    host: string,
    port: number,
    frames: Buffer[],
    timeoutMs = 30000,
  ): Promise<TcpSendResult> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      let rawResponse = '';
      let frameIndex = 0;
      let phase: 'WAIT_ACK' | 'SENDING' | 'RECEIVING' | 'DONE' = 'WAIT_ACK';
      let resolved = false;
      let timer: ReturnType<typeof setTimeout>;

      const finish = (success: boolean, error?: string) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);
        if (!socket.destroyed) socket.destroy();
        resolve({ success, rawResponse, error });
      };

      timer = setTimeout(() => {
        this.logger.warn(`[ASTM] Timeout connecting to ${host}:${port}`);
        finish(false, 'Timeout');
      }, timeoutMs);

      const sendNextFrame = () => {
        if (frameIndex < frames.length) {
          socket.write(frames[frameIndex]);
        }
      };

      socket.connect(port, host, () => {
        this.logger.log(`[ASTM] Connected to ${host}:${port}, sending ENQ`);
        socket.write(ENQ_BUF);
      });

      socket.on('data', (data: Buffer) => {
        rawResponse += data.toString('latin1');

        for (let i = 0; i < data.length; i++) {
          const b = data[i];

          if (phase === 'WAIT_ACK' && b === ACK) {
            phase = 'SENDING';
            sendNextFrame();

          } else if (phase === 'SENDING' && b === ACK) {
            frameIndex++;
            if (frameIndex < frames.length) {
              sendNextFrame();
            } else {
              phase = 'RECEIVING';
              socket.write(EOT_BUF);
            }

          } else if (phase === 'RECEIVING') {
            if (b === ENQ) socket.write(ACK_BUF);   // ACK start of result transmission
            if (b === ETX) socket.write(ACK_BUF);   // ACK each result frame
            if (b === EOT) {                         // End of result transmission
              phase = 'DONE';
              finish(true);
              return;
            }
          }
        }
      });

      socket.on('error', (err) => {
        this.logger.error(`[ASTM] Socket error: ${err.message}`);
        finish(false, err.message);
      });

      socket.on('close', () => finish(true));
    });
  }
}
