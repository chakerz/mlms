import { AnalyzerConfig } from './analyzer-config';

export const CobasC311Config: AnalyzerConfig = {
  code: 'COBAS_C311',

  visualization: {
    layoutType: 'RACK',
    racks: 2,
    slotsPerRack: 20,
    supportsStatLane: true,
    statLaneSlots: 3,
    colorScheme: {
      idle: '#9ca3af',
      ready: '#22c55e',
      processing: '#3b82f6',
      sending: '#06b6d4',
      error: '#ef4444',
    },
    icons: {
      slotLoaded: 'tube',
      slotProcessing: 'spinner',
      slotError: 'cross',
      slotDone: 'check',
    },
  },

  protocol: {
    protocolType: 'ASTM',
    astmVariant: 'COBAS_GENERIC',
    connection: {
      transport: 'TCP',
      port: 5000,
      speed: 9600,
      charConfig: '8N1',
      frameLength: 247,
    },
  },

  simulation: {
    analyzerId: 'SIM_COBAS_C311',
    name: 'cobas c 311 Simulator',
    model: 'cobas c 311',
    throughputPerHour: 370,
    processingTimeMinMs: 3000,
    processingTimeMaxMs: 8000,
    abnormalRate: 0.12,
    errorRate: 0.02,
    calibrationIntervalMs: 30 * 60 * 1000,
  },
};
