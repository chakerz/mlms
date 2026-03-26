export type AnalyzerStatus = 'IDLE' | 'READY' | 'RUNNING' | 'PROCESSING' | 'SENDING_RESULTS' | 'CALIBRATING' | 'ERROR' | 'MAINTENANCE' | 'OFFLINE';
export type SlotStatus = 'EMPTY' | 'LOADED' | 'SCANNING' | 'WAITING' | 'PROCESSING' | 'DONE' | 'ERROR' | 'SENDING';

export interface ColorScheme {
  idle: string;
  ready: string;
  processing: string;
  sending: string;
  error: string;
}

export interface VisualizationConfig {
  layoutType: 'RACK' | 'DISK';
  racks: number;
  slotsPerRack: number;
  supportsStatLane: boolean;
  statLaneSlots?: number;
  colorScheme: ColorScheme;
}

export interface AnalyzerConfig {
  code: string;
  visualization: VisualizationConfig;
}

export interface SlotState {
  slotNumber: number;
  status: SlotStatus;
  sampleId: string | null;
  barcode: string | null;
  tests: string[];
  progress: number;
  result: any;
  isStatSlot?: boolean;
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
  todayProcessed?: number;
  todaysSamples?: number;
  avgProcessingTimeMs?: number;
  averageProcessingMs?: number;
  errorRate: number;
  abnormalRate: number;
  astmSent?: number;
  astmReceived?: number;
}

export interface SimulatorStateData {
  analyzer: AnalyzerState;
  racks: RackState[];
  connection: ConnectionState;
  stats: SimulatorStats;
}

export interface InstrumentData {
  instrumentCode: string;
  config: AnalyzerConfig | null;
  state: SimulatorStateData | null;
  logs: LogEntry[];
}

export interface LogEntry {
  id: number;
  timestamp: string;
  event: string;
  data: any;
  type: 'info' | 'success' | 'error' | 'warning';
}
