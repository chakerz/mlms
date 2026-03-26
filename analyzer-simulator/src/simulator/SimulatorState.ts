import { SimulatorStateData, AnalyzerState, RackState, SlotState, ConnectionState, SimulatorStats, SimulatorConfig } from '../types';

export class SimulatorState {
  private state: SimulatorStateData;
  private startedAt: Date;

  constructor(config: SimulatorConfig) {
    this.startedAt = new Date();
    this.state = {
      analyzer: {
        id: config.analyzerId,
        name: config.analyzerName,
        model: config.analyzerModel,
        status: 'IDLE',
        currentRunId: null,
        processingCount: 0,
        totalProcessed: 0,
        errorCount: 0,
        lastActivity: new Date().toISOString(),
      },
      racks: this.createRacks(config.rackCount, config.slotsPerRack, config.statLaneSlots ?? 0),
      connection: {
        lisConnected: false,
        lisHost: null,
        lisPort: null,
        lastMessageAt: null,
        messagesSent: 0,
        messagesReceived: 0,
      },
      stats: {
        todayProcessed: 0,
        avgProcessingTimeMs: 0,
        errorRate: 0,
        abnormalRate: 0,
        astmSent: 0,
        astmReceived: 0,
        uptimeMs: 0,
        startedAt: this.startedAt.toISOString(),
      },
    };
  }

  private createRacks(rackCount: number, slotsPerRack: number, statLaneSlots = 0): RackState[] {
    return Array.from({ length: rackCount }, (_, i) => ({
      rackId: `RACK_${String(i + 1).padStart(2, '0')}`,
      position: i + 1,
      slots: Array.from({ length: slotsPerRack }, (_, j) => ({
        slotNumber: j + 1,
        status: 'EMPTY' as const,
        sampleId: null,
        barcode: null,
        tests: [],
        progress: 0,
        result: null,
        isStatSlot: statLaneSlots > 0 && (j + 1) <= statLaneSlots,
      })),
    }));
  }

  getState(): SimulatorStateData {
    this.state.stats.uptimeMs = Date.now() - this.startedAt.getTime();
    return JSON.parse(JSON.stringify(this.state));
  }

  setAnalyzerStatus(status: SimulatorStateData['analyzer']['status']): void {
    this.state.analyzer.status = status;
    this.state.analyzer.lastActivity = new Date().toISOString();
  }

  setLisConnected(connected: boolean, host?: string, port?: number): void {
    this.state.connection.lisConnected = connected;
    this.state.connection.lisHost = host || null;
    this.state.connection.lisPort = port || null;
    this.state.connection.lastMessageAt = new Date().toISOString();
  }

  incrementAstmSent(): void {
    this.state.connection.messagesSent++;
    this.state.stats.astmSent++;
  }

  incrementAstmReceived(): void {
    this.state.connection.messagesReceived++;
    this.state.stats.astmReceived++;
    this.state.connection.lastMessageAt = new Date().toISOString();
  }

  findEmptySlot(): { rackId: string; slotNumber: number } | null {
    for (const rack of this.state.racks) {
      for (const slot of rack.slots) {
        if (slot.status === 'EMPTY') {
          return { rackId: rack.rackId, slotNumber: slot.slotNumber };
        }
      }
    }
    return null;
  }

  getSlot(rackId: string, slotNumber: number): SlotState | null {
    const rack = this.state.racks.find(r => r.rackId === rackId);
    if (!rack) return null;
    return rack.slots.find(s => s.slotNumber === slotNumber) || null;
  }

  updateSlot(rackId: string, slotNumber: number, update: Partial<SlotState>): void {
    const rack = this.state.racks.find(r => r.rackId === rackId);
    if (!rack) return;
    const slot = rack.slots.find(s => s.slotNumber === slotNumber);
    if (!slot) return;
    Object.assign(slot, update);
  }

  loadSample(rackId: string, slotNumber: number, sampleId: string, barcode: string, tests: string[]): void {
    this.updateSlot(rackId, slotNumber, {
      status: 'LOADED',
      sampleId,
      barcode,
      tests,
      progress: 0,
      result: null,
    });
    this.state.analyzer.processingCount++;
    this.setAnalyzerStatus('RUNNING');
  }

  ejectSample(rackId: string, slotNumber: number): void {
    const slot = this.getSlot(rackId, slotNumber);
    if (slot && slot.status !== 'EMPTY') {
      this.state.analyzer.processingCount = Math.max(0, this.state.analyzer.processingCount - 1);
    }
    this.updateSlot(rackId, slotNumber, {
      status: 'EMPTY',
      sampleId: null,
      barcode: null,
      tests: [],
      progress: 0,
      result: null,
    });
    if (this.state.analyzer.processingCount === 0) {
      this.setAnalyzerStatus('IDLE');
    }
  }

  completeSample(rackId: string, slotNumber: number): void {
    this.state.analyzer.totalProcessed++;
    this.state.stats.todayProcessed++;
    this.state.analyzer.processingCount = Math.max(0, this.state.analyzer.processingCount - 1);
  }

  markError(rackId: string, slotNumber: number): void {
    this.state.analyzer.errorCount++;
    this.updateSlot(rackId, slotNumber, { status: 'ERROR' });
  }

  updateRacks(rackCount: number, slotsPerRack: number, statLaneSlots: number): void {
    this.state.racks = this.createRacks(rackCount, slotsPerRack, statLaneSlots);
    this.state.analyzer.processingCount = 0;
    this.state.analyzer.status = 'IDLE';
  }

  resetAnalyzer(): void {
    this.state.analyzer.status = 'IDLE';
    this.state.analyzer.processingCount = 0;
    this.state.racks = this.state.racks.map(rack => ({
      ...rack,
      slots: rack.slots.map(slot => ({
        ...slot,
        status: 'EMPTY' as const,
        sampleId: null,
        barcode: null,
        tests: [],
        progress: 0,
        result: null,
      })),
    }));
  }
}
