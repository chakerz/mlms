import { AnalyzerConfig } from '../config/analyzer-config';

export interface SlotStateInit {
  slotNumber: number;
  status: string;
  sampleId: string | null;
  barcode: string | null;
  tests: string[];
  progress: number;
  result: any | null;
  isStatSlot: boolean;
}

export interface RackStateInit {
  rackId: string;
  position: number;
  slots: SlotStateInit[];
}

export interface SimulatorStateInit {
  analyzer: {
    id: string;
    name: string;
    model: string;
    status: string;
    currentRunId: string | null;
    processingCount: number;
    totalProcessed: number;
    errorCount: number;
    lastActivity: string;
  };
  racks: RackStateInit[];
  samples: any[];
  connection: {
    lisConnected: boolean;
    lisHost: string | null;
    lisPort: number;
    lastMessageAt: string | null;
    messagesSent: number;
    messagesReceived: number;
  };
  stats: {
    todaysSamples: number;
    averageProcessingMs: number;
    abnormalRate: number;
    errorRate: number;
  };
}

export function createInitialState(config: AnalyzerConfig): SimulatorStateInit {
  const racks: RackStateInit[] = [];

  for (let r = 0; r < config.visualization.racks; r++) {
    const slots: SlotStateInit[] = [];
    const totalSlots = config.visualization.slotsPerRack;
    const statSlots = config.visualization.supportsStatLane
      ? (config.visualization.statLaneSlots ?? 0)
      : 0;

    for (let s = 1; s <= totalSlots; s++) {
      slots.push({
        slotNumber: s,
        status: 'EMPTY',
        sampleId: null,
        barcode: null,
        tests: [],
        progress: 0,
        result: null,
        isStatSlot: s <= statSlots,
      });
    }

    racks.push({
      rackId: `RACK_${String(r + 1).padStart(2, '0')}`,
      position: r + 1,
      slots,
    });
  }

  return {
    analyzer: {
      id: config.simulation.analyzerId,
      name: config.simulation.name,
      model: config.simulation.model,
      status: 'READY',
      currentRunId: null,
      processingCount: 0,
      totalProcessed: 0,
      errorCount: 0,
      lastActivity: new Date().toISOString(),
    },
    racks,
    samples: [],
    connection: {
      lisConnected: false,
      lisHost: null,
      lisPort: config.protocol.connection.port,
      lastMessageAt: null,
      messagesSent: 0,
      messagesReceived: 0,
    },
    stats: {
      todaysSamples: 0,
      averageProcessingMs: 0,
      abnormalRate: config.simulation.abnormalRate,
      errorRate: config.simulation.errorRate,
    },
  };
}
