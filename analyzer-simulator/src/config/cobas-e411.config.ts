import { AnalyzerConfig } from './analyzer-config';

export const CobasE411Config: AnalyzerConfig = {
  code: 'COBAS_E411',

  visualization: {
    layoutType: 'RACK',
    racks: 2,
    slotsPerRack: 20,
    supportsStatLane: true,
    statLaneSlots: 3,
    colorScheme: {
      idle: '#9ca3af',
      ready: '#22c55e',
      processing: '#f97316',
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
    astmVariant: 'ELECSYS',
    connection: {
      transport: 'TCP',
      port: 5000,
      speed: 9600,
      charConfig: '8N1',
      frameLength: 247,
    },
  },

  simulation: {
    analyzerId: 'SIM_COBAS_E411',
    name: 'Cobas e 411 Simulator',
    model: 'cobas e 411',
    throughputPerHour: 86,
    processingTimeMinMs: 6000,
    processingTimeMaxMs: 15000,
    abnormalRate: 0.15,
    errorRate: 0.03,
    calibrationIntervalMs: 15 * 60 * 1000,
  },
};
