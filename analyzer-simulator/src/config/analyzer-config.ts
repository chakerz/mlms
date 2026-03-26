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

export type AstmVariant = 'ELECSYS' | 'COBAS_GENERIC';

export interface AnalyzerColorScheme {
  idle: string;
  ready: string;
  processing: string;
  sending: string;
  error: string;
}

export interface AnalyzerIconScheme {
  slotLoaded: string;
  slotProcessing: string;
  slotError: string;
  slotDone: string;
}

export interface AnalyzerVisualizationConfig {
  layoutType: LayoutType;
  racks: number;
  slotsPerRack: number;
  supportsStatLane: boolean;
  statLaneSlots?: number;
  colorScheme: AnalyzerColorScheme;
  icons: AnalyzerIconScheme;
}

export interface AnalyzerProtocolConnectionConfig {
  transport: 'TCP' | 'SERIAL';
  port: number;
  speed: 4800 | 9600 | 19200;
  charConfig: '8N1';
  frameLength: number;
}

export interface AnalyzerProtocolConfig {
  protocolType: 'ASTM';
  astmVariant: AstmVariant;
  connection: AnalyzerProtocolConnectionConfig;
}

export interface AnalyzerSimulationConfig {
  analyzerId: string;
  name: string;
  model: string;
  throughputPerHour: number;
  processingTimeMinMs: number;
  processingTimeMaxMs: number;
  abnormalRate: number;
  errorRate: number;
  calibrationIntervalMs: number;
}

export interface AnalyzerConfig {
  code: string;
  visualization: AnalyzerVisualizationConfig;
  protocol: AnalyzerProtocolConfig;
  simulation: AnalyzerSimulationConfig;
}
