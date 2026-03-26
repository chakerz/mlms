import { SimulatorState } from './SimulatorState';
import { ResultGenerator } from './ResultGenerator';
import { SampleProcessor } from './SampleProcessor';
import { SimulatorWebSocketServer } from '../websocket/SimulatorWebSocketServer';
import { AstmServer } from '../astm/AstmServer';
import { parseAstmMessage } from '../astm/AstmParser';
import { SimulatorConfig } from '../types';
import { AnalyzerConfig } from '../config/analyzer-config';
import { COBAS_E411_TEST_CODES } from './cobas-e411.tests';
import * as net from 'net';

function analyzerConfigToSimulatorConfig(
  cfg: AnalyzerConfig,
  wsPort: number,
): SimulatorConfig {
  return {
    analyzerId: cfg.simulation.analyzerId,
    analyzerName: cfg.simulation.name,
    analyzerModel: cfg.simulation.model,
    astmPort: cfg.protocol.connection.port,
    wsPort,
    rackCount: cfg.visualization.racks,
    slotsPerRack: cfg.visualization.slotsPerRack,
    statLaneSlots: cfg.visualization.supportsStatLane
      ? (cfg.visualization.statLaneSlots ?? 0)
      : 0,
    processingTimeMin: cfg.simulation.processingTimeMinMs,
    processingTimeMax: cfg.simulation.processingTimeMaxMs,
    abnormalRate: cfg.simulation.abnormalRate,
    errorRate: cfg.simulation.errorRate,
    resultSendDelay: 1000,
    calibrationInterval: cfg.simulation.calibrationIntervalMs,
    logLevel: process.env.LOG_LEVEL || 'info',
  };
}

export class AnalyzerSimulator {
  private state: SimulatorState;
  private generator: ResultGenerator;
  private processor: SampleProcessor;
  private ws: SimulatorWebSocketServer;
  private astm: AstmServer;
  private calibrationTimer: NodeJS.Timeout | null = null;
  private broadcastTimer: NodeJS.Timeout | null = null;
  private analyzerConfig: AnalyzerConfig | null = null;
  private availableTestCodes: string[];
  private instrumentCode: string;
  private ownsWs: boolean = true;

  constructor(
    configOrAnalyzerConfig: SimulatorConfig | AnalyzerConfig,
    sharedWs?: SimulatorWebSocketServer,
    instrumentCodeOverride?: string,
  ) {
    let simConfig: SimulatorConfig;
    if ('visualization' in configOrAnalyzerConfig) {
      this.analyzerConfig = configOrAnalyzerConfig as AnalyzerConfig;
      const wsPort = parseInt(process.env.WS_PORT || '5001');
      simConfig = analyzerConfigToSimulatorConfig(this.analyzerConfig, wsPort);
    } else {
      simConfig = configOrAnalyzerConfig as SimulatorConfig;
    }

    this.instrumentCode = instrumentCodeOverride
      ?? this.analyzerConfig?.simulation.analyzerId
      ?? simConfig.analyzerId;

    if (this.analyzerConfig?.code === 'COBAS_E411') {
      this.availableTestCodes = COBAS_E411_TEST_CODES;
    } else {
      this.availableTestCodes = [
        'GLU', 'CREA', 'UREE', 'ALT', 'AST', 'TBIL', 'TP', 'ALB',
        'CHOL', 'TG', 'HDL', 'LDL', 'HBA1C', 'TSH', 'FT4',
        'HGB', 'WBC', 'PLT', 'RBC', 'CRP', 'FERR', 'VIT_D',
      ];
    }

    this.state = new SimulatorState(simConfig);
    this.generator = new ResultGenerator(simConfig.abnormalRate, simConfig.errorRate);

    if (sharedWs) {
      this.ws = sharedWs;
      this.ownsWs = false;
    } else {
      this.ws = new SimulatorWebSocketServer(simConfig.wsPort);
      this.ownsWs = true;
    }

    this.astm = new AstmServer(
      simConfig.astmPort,
      (raw, socket) => this.handleAstmMessage(raw, socket),
      (socket, connected) => this.handleConnectionChange(socket, connected),
    );

    this.processor = new SampleProcessor(
      this.state,
      this.generator,
      this.ws,
      this.astm,
      simConfig.analyzerId,
      {
        processingTimeMin: simConfig.processingTimeMin,
        processingTimeMax: simConfig.processingTimeMax,
        resultSendDelay: simConfig.resultSendDelay,
        instrumentCode: this.instrumentCode,
      },
    );

    this.setupWsCommands();
  }

  private sendInitialState(ws: any): void {
    this.ws.sendToClient(ws, 'ANALYZER_STATE', {
      config: this.analyzerConfig ?? null,
      state: this.state.getState(),
    }, this.instrumentCode);
  }

  /** Returns the AnalyzerConfig if the simulator was created with one. */
  getConfig(): AnalyzerConfig | null {
    return this.analyzerConfig;
  }

  private setupWsCommands(): void {
    const code = this.instrumentCode;

    this.ws.onCommand('LOAD_SAMPLE', code, (data) => {
      const { rackId, slotNumber, sampleId, barcode, tests } = data;
      this.state.loadSample(rackId, slotNumber, sampleId, barcode, tests || []);
      this.ws.broadcast('SAMPLE_LOADED', { rackId, slotNumber, sampleId, barcode, tests: tests || [] }, code);
      this.ws.broadcastStateUpdate(this.state.getState(), code);
      this.processor.processSample(rackId, slotNumber).catch(console.error);
    });

    this.ws.onCommand('LOAD_RANDOM_SAMPLE', code, () => {
      const slot = this.state.findEmptySlot();
      if (!slot) { console.log(`[${code}] No empty slot`); return; }
      const sampleId = `SMP-${Date.now()}`;
      const barcode = String(Math.floor(Math.random() * 900000000000) + 100000000000);
      const count = 2 + Math.floor(Math.random() * 5);
      const tests = [...this.availableTestCodes].sort(() => Math.random() - 0.5).slice(0, count);
      this.state.loadSample(slot.rackId, slot.slotNumber, sampleId, barcode, tests);
      this.ws.broadcast('SAMPLE_LOADED', { rackId: slot.rackId, slotNumber: slot.slotNumber, sampleId, barcode, tests }, code);
      this.ws.broadcastStateUpdate(this.state.getState(), code);
      this.processor.processSample(slot.rackId, slot.slotNumber).catch(console.error);
    });

    this.ws.onCommand('EJECT_SAMPLE', code, (data) => {
      this.state.ejectSample(data.rackId, data.slotNumber);
      this.ws.broadcastStateUpdate(this.state.getState(), code);
    });

    this.ws.onCommand('START_CALIBRATION', code, () => { this.runCalibration(); });

    this.ws.onCommand('RESET_ANALYZER', code, () => {
      this.state.resetAnalyzer();
      this.ws.broadcastStateUpdate(this.state.getState(), code);
    });

    this.ws.onCommand('TRIGGER_ERROR', code, () => {
      this.state.setAnalyzerStatus('ERROR');
      this.ws.broadcast('SAMPLE_ERROR', { errorCode: 'MANUAL_TRIGGER', errorMessage: 'Error triggered from dashboard' }, code);
      this.ws.broadcastStateUpdate(this.state.getState(), code);
      setTimeout(() => {
        this.state.setAnalyzerStatus('READY');
        this.ws.broadcastStateUpdate(this.state.getState(), code);
      }, 5000);
    });

    this.ws.onCommand('SET_PROCESSING_SPEED', code, (data) => {
      this.processor.setSpeedMultiplier(data.speedMultiplier || 1);
    });

    this.ws.onCommand('CLEAR_ALL_SLOTS', code, () => {
      this.state.resetAnalyzer();
      this.ws.broadcastStateUpdate(this.state.getState(), code);
    });

    this.ws.onCommand('GET_STATE', code, () => {
      this.ws.broadcast('ANALYZER_STATE', { config: this.analyzerConfig ?? null, state: this.state.getState() }, code);
    });
  }

  private handleAstmMessage(raw: string, socket: net.Socket): void {
    const code = this.instrumentCode;
    this.state.incrementAstmReceived();
    this.ws.broadcast('RAW_ASTM_RECEIVED', { raw: raw.substring(0, 200), timestamp: new Date().toISOString() }, code);

    const parsed = parseAstmMessage(raw);
    if (!parsed) return;

    for (const order of parsed.orders) {
      const slot = this.state.findEmptySlot();
      if (!slot) continue;
      const tests = order.tests.length > 0 ? order.tests : ['GLU', 'CREA'];
      const sampleId = order.sampleId || `SMP-${Date.now()}`;
      const barcode = order.accessionNumber || sampleId;
      this.state.loadSample(slot.rackId, slot.slotNumber, sampleId, barcode, tests);
      this.ws.broadcast('SAMPLE_LOADED', { rackId: slot.rackId, slotNumber: slot.slotNumber, sampleId, barcode, tests }, code);
      this.ws.broadcastStateUpdate(this.state.getState(), code);
      this.processor.processSample(slot.rackId, slot.slotNumber).catch(console.error);
    }
  }

  private handleConnectionChange(socket: net.Socket, connected: boolean): void {
    const code = this.instrumentCode;
    this.state.setLisConnected(connected, socket.remoteAddress, socket.remotePort);
    this.ws.broadcast('CONNECTION_CHANGED', { lisConnected: connected, clientAddress: socket.remoteAddress, timestamp: new Date().toISOString() }, code);
    this.ws.broadcastStateUpdate(this.state.getState(), code);
  }

  private async runCalibration(): Promise<void> {
    const code = this.instrumentCode;
    const duration = 30000;
    this.state.setAnalyzerStatus('CALIBRATING');
    this.ws.broadcast('CALIBRATION_STARTED', { startedAt: new Date().toISOString(), estimatedDuration: duration }, code);
    this.ws.broadcastStateUpdate(this.state.getState(), code);
    await new Promise(resolve => setTimeout(resolve, duration / 10));
    this.state.setAnalyzerStatus('READY');
    this.ws.broadcast('CALIBRATION_DONE', { completedAt: new Date().toISOString() }, code);
    this.ws.broadcastStateUpdate(this.state.getState(), code);
  }

  /** Start standalone (owns WS server). */
  async start(): Promise<void> {
    this.ws.onNewConnection((ws) => this.sendInitialState(ws));
    await this._startInternal();
  }

  /** Start as part of MultiInstrumentSimulator (shared WS server). */
  async startWithSharedWs(): Promise<void> {
    this.ws.onNewConnection((ws) => this.sendInitialState(ws));
    await this._startInternal();
  }

  private async _startInternal(): Promise<void> {
    await this.astm.start();
    this.state.setAnalyzerStatus('READY');

    this.broadcastTimer = setInterval(() => {
      this.ws.broadcastStateUpdate(this.state.getState(), this.instrumentCode);
    }, 5000);

    const calInterval = this.analyzerConfig?.simulation.calibrationIntervalMs
      ?? (parseInt(process.env.CALIBRATION_INTERVAL || '300000'));
    if (calInterval > 0) {
      this.calibrationTimer = setInterval(() => {
        this.runCalibration().catch(console.error);
      }, calInterval);
    }

    const name = this.analyzerConfig?.simulation.name ?? this.instrumentCode;
    const astmPort = this.analyzerConfig?.protocol.connection.port ?? parseInt(process.env.ASTM_PORT || '5000');
    console.log(`[Sim] ${name} — ASTM TCP: port ${astmPort}`);
  }

  applySimulatorConfig(sc: {
    rackCount: number; slotsPerRack: number; statSlots: number;
    processingTimeMinMs: number; processingTimeMaxMs: number;
    abnormalRate: number; errorRate: number;
  }): boolean {
    const status = this.state.getState().analyzer.status;
    const busy = ['RUNNING', 'PROCESSING', 'SENDING_RESULTS', 'CALIBRATING'].includes(status);
    if (busy) {
      console.log(`[Sim:${this.instrumentCode}] Config update deferred — analyzer is ${status}, will retry next poll`);
      return false;
    }
    this.state.updateRacks(sc.rackCount, sc.slotsPerRack, sc.statSlots);
    this.processor.updateTiming(sc.processingTimeMinMs, sc.processingTimeMaxMs);
    this.generator.updateRates(sc.abnormalRate, sc.errorRate);
    console.log(`[Sim:${this.instrumentCode}] Config updated live: ${sc.rackCount} racks × ${sc.slotsPerRack} slots, ${sc.statSlots} STAT`);
    return true;
  }

  stop(): void {
    if (this.broadcastTimer) clearInterval(this.broadcastTimer);
    if (this.calibrationTimer) clearInterval(this.calibrationTimer);
    this.astm.stop();
    if (this.ownsWs) this.ws.close();
  }
}
