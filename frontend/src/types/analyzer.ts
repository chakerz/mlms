export type LayoutType = 'RACK' | 'DISK';

export type SlotStatus =
  | 'EMPTY'
  | 'LOADED'
  | 'SCANNING'
  | 'WAITING'
  | 'PROCESSING'
  | 'DONE'
  | 'ERROR'
  | 'SENDING';

export type AnalyzerStatus =
  | 'IDLE'
  | 'READY'
  | 'RUNNING'
  | 'PROCESSING'
  | 'SENDING_RESULTS'
  | 'CALIBRATING'
  | 'ERROR'
  | 'MAINTENANCE'
  | 'OFFLINE';

export interface AnalyzerColorScheme {
  idle: string;
  ready: string;
  processing: string;
  sending: string;
  error: string;
}

export interface AnalyzerVisualizationConfig {
  layoutType: LayoutType;
  racks: number;
  slotsPerRack: number;
  supportsStatLane: boolean;
  statLaneSlots?: number;
  colorScheme: AnalyzerColorScheme;
  icons: {
    slotLoaded: string;
    slotProcessing: string;
    slotError: string;
    slotDone: string;
  };
}

export interface AnalyzerConfig {
  code: string;
  visualization: AnalyzerVisualizationConfig;
}

export interface SlotState {
  slotNumber: number;
  status: SlotStatus;
  sampleId: string | null;
  barcode: string | null;
  tests: string[];
  progress: number;
  isStatSlot?: boolean;
  result: null | {
    testCode: string;
    value: string;
    unit: string;
    flag: string;
  }[];
}

export interface RackState {
  rackId: string;
  position: number;
  slots: SlotState[];
}

export interface ConnectionState {
  lisConnected: boolean;
  lisHost: string | null;
  lisPort: number;
  lastMessageAt: string | null;
  messagesSent: number;
  messagesReceived: number;
}

export interface AnalyzerInfo {
  id: string;
  name: string;
  model: string;
  status: AnalyzerStatus;
  currentRunId: string | null;
  processingCount: number;
  totalProcessed: number;
  errorCount: number;
  lastActivity: string;
}

export interface SimulatorStats {
  todaysSamples: number;
  averageProcessingMs: number;
  abnormalRate: number;
  errorRate: number;
}

export interface SimulatorState {
  analyzer: AnalyzerInfo;
  racks: RackState[];
  connection: ConnectionState;
  stats: SimulatorStats;
}
