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

export type SlotStatus =
  | 'EMPTY'
  | 'LOADED'
  | 'SCANNING'
  | 'WAITING'
  | 'PROCESSING'
  | 'DONE'
  | 'ERROR'
  | 'SENDING';

export interface SlotState {
  slotNumber: number;
  status: SlotStatus;
  sampleId: string | null;
  barcode: string | null;
  tests: string[];
  progress: number;
  result: ProcessedResult | null;
  isStatSlot?: boolean;
}

export interface ProcessedResult {
  testCode: string;
  value: string;
  unit: string;
  flag: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL_HIGH' | 'CRITICAL_LOW' | 'ERROR';
}

export interface RackState {
  rackId: string;
  position: number;
  slots: SlotState[];
}

export interface AnalyzerState {
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

export interface ConnectionState {
  lisConnected: boolean;
  lisHost: string | null;
  lisPort: number | null;
  lastMessageAt: string | null;
  messagesSent: number;
  messagesReceived: number;
}

export interface SimulatorStats {
  todayProcessed: number;
  avgProcessingTimeMs: number;
  errorRate: number;
  abnormalRate: number;
  astmSent: number;
  astmReceived: number;
  uptimeMs: number;
  startedAt: string;
}

export interface SimulatorStateData {
  analyzer: AnalyzerState;
  racks: RackState[];
  connection: ConnectionState;
  stats: SimulatorStats;
}

export interface TestDefinition {
  code: string;
  name: string;
  unit: string;
  refLow: number;
  refHigh: number;
  criticalLow?: number;
  criticalHigh?: number;
  decimals: number;
}

export interface SimulatorConfig {
  analyzerId: string;
  analyzerName: string;
  analyzerModel: string;
  astmPort: number;
  wsPort: number;
  rackCount: number;
  slotsPerRack: number;
  statLaneSlots?: number;
  processingTimeMin: number;
  processingTimeMax: number;
  abnormalRate: number;
  errorRate: number;
  resultSendDelay: number;
  calibrationInterval: number;
  logLevel: string;
}
