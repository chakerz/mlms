import { SimulatorState } from './SimulatorState';
import { ResultGenerator } from './ResultGenerator';
import { SimulatorWebSocketServer } from '../websocket/SimulatorWebSocketServer';
import { AstmServer } from '../astm/AstmServer';
import { buildResultMessage } from '../astm/AstmBuilder';
import { ProcessedResult } from '../types';
import { buildEnq, buildEot } from '../astm/AstmBuilder';
import { ENQ_BUF, EOT_BUF } from '../astm/AstmConstants';
import * as net from 'net';

export class SampleProcessor {
  private processingTimeMin: number;
  private processingTimeMax: number;
  private resultSendDelay: number;
  private speedMultiplier: number = 1;
  private activeProcessing: Set<string> = new Set();
  private instrumentCode: string;

  constructor(
    private state: SimulatorState,
    private generator: ResultGenerator,
    private ws: SimulatorWebSocketServer,
    private astm: AstmServer,
    private analyzerId: string,
    config: { processingTimeMin: number; processingTimeMax: number; resultSendDelay: number; instrumentCode?: string },
  ) {
    this.processingTimeMin = config.processingTimeMin;
    this.processingTimeMax = config.processingTimeMax;
    this.resultSendDelay = config.resultSendDelay;
    this.instrumentCode = config.instrumentCode ?? analyzerId;
  }

  setSpeedMultiplier(mult: number): void {
    this.speedMultiplier = Math.max(0.1, Math.min(20, mult));
  }

  updateTiming(processingTimeMin: number, processingTimeMax: number): void {
    this.processingTimeMin = processingTimeMin;
    this.processingTimeMax = processingTimeMax;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms / this.speedMultiplier));
  }

  async processSample(rackId: string, slotNumber: number): Promise<void> {
    const key = `${rackId}:${slotNumber}`;
    if (this.activeProcessing.has(key)) return;
    this.activeProcessing.add(key);

    try {
      const slot = this.state.getSlot(rackId, slotNumber);
      if (!slot || slot.status !== 'LOADED') return;

      const { sampleId, barcode, tests } = slot;
      if (!sampleId || !barcode) return;

      // 1. Scanning
      this.state.updateSlot(rackId, slotNumber, { status: 'SCANNING' });
      this.ws.broadcast('SAMPLE_SCANNING', { rackId, slotNumber, barcode }, this.instrumentCode);
      await this.delay(800);

      // 2. Waiting for worklist
      this.state.updateSlot(rackId, slotNumber, { status: 'WAITING' });
      this.ws.broadcast('WORKLIST_REQUESTED', { rackId, slotNumber, sampleId }, this.instrumentCode);
      await this.delay(500);

      // Simulate worklist received (in real mode, would wait for LIS response)
      this.ws.broadcast('WORKLIST_RECEIVED', { sampleId, tests, priority: 'ROUTINE' }, this.instrumentCode);

      // 3. Processing
      this.state.setAnalyzerStatus('PROCESSING');
      this.state.updateSlot(rackId, slotNumber, { status: 'PROCESSING', progress: 0 });

      const totalTime = (this.processingTimeMin + Math.random() * (this.processingTimeMax - this.processingTimeMin));
      const steps = 20;
      const stepTime = totalTime / steps;

      for (let step = 0; step <= steps; step++) {
        let progress: number;
        const pct = step / steps;
        if (pct < 0.2) progress = pct * 50; // slow start: 0-10%
        else if (pct < 0.8) progress = 10 + (pct - 0.2) * 100; // fast middle: 10-70%
        else progress = 70 + (pct - 0.8) * 150; // medium end: 70-100%
        progress = Math.min(100, Math.round(progress));

        const currentTest = tests[Math.floor(step / steps * tests.length)] || tests[0];
        this.state.updateSlot(rackId, slotNumber, { progress });
        this.ws.broadcast('SAMPLE_PROCESSING', { rackId, slotNumber, sampleId, progress, currentTest }, this.instrumentCode);
        await this.delay(stepTime);
      }

      // 4. Generate results
      const results: ProcessedResult[] = tests.map(tc => this.generator.generateResult(tc));
      this.state.updateSlot(rackId, slotNumber, { status: 'DONE', progress: 100, result: results[0] || null });

      const resultSummary = results.map(r => ({
        testCode: r.testCode,
        value: r.value,
        unit: r.unit,
        flag: r.flag,
      }));

      this.ws.broadcast('SAMPLE_DONE', { rackId, slotNumber, sampleId, results: resultSummary }, this.instrumentCode);
      await this.delay(this.resultSendDelay);

      // 5. Send results via ASTM
      this.state.updateSlot(rackId, slotNumber, { status: 'SENDING' });
      this.state.setAnalyzerStatus('SENDING_RESULTS');

      const astmResults = results.map(r => ({
        testCode: r.testCode,
        value: r.value,
        unit: r.unit,
        refRange: this.generator.generateRefRange(r.testCode),
        flag: r.flag,
      }));

      const frames = buildResultMessage(this.analyzerId, sampleId, sampleId, astmResults);
      this.astm.sendToAll(frames);
      this.state.incrementAstmSent();

      this.ws.broadcast('RESULTS_SENT', {
        sampleId,
        resultCount: results.length,
        sentAt: new Date().toISOString(),
      }, this.instrumentCode);
      this.ws.broadcast('RAW_ASTM_SENT', {
        raw: `H...O|${sampleId}|...R records (${results.length})`,
        timestamp: new Date().toISOString(),
      }, this.instrumentCode);

      // 6. Complete and clear slot after delay
      this.state.completeSample(rackId, slotNumber);
      await this.delay(2000);
      this.state.ejectSample(rackId, slotNumber);

      if (this.state.getState().analyzer.processingCount === 0) {
        this.state.setAnalyzerStatus('IDLE');
      }

    } catch (err) {
      console.error('[SampleProcessor] Error:', err);
      this.state.markError(rackId, slotNumber);
      this.ws.broadcast('SAMPLE_ERROR', {
        rackId,
        slotNumber,
        sampleId: this.state.getSlot(rackId, slotNumber)?.sampleId,
        errorCode: 'PROCESSING_ERROR',
        errorMessage: String(err),
      }, this.instrumentCode);
    } finally {
      this.activeProcessing.delete(key);
    }
  }
}
