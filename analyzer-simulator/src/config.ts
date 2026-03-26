import { SimulatorConfig } from './types';

export function loadConfig(): SimulatorConfig {
  return {
    analyzerId: process.env.ANALYZER_ID || 'SIM_CHEM_01',
    analyzerName: process.env.ANALYZER_NAME || 'SimAnalyzer Pro 2000',
    analyzerModel: process.env.ANALYZER_MODEL || 'SAP-2000',
    astmPort: parseInt(process.env.ASTM_PORT || '5000', 10),
    wsPort: parseInt(process.env.WS_PORT || '5001', 10),
    rackCount: parseInt(process.env.RACK_COUNT || '3', 10),
    slotsPerRack: parseInt(process.env.SLOTS_PER_RACK || '10', 10),
    processingTimeMin: parseInt(process.env.PROCESSING_TIME_MIN || '4000', 10),
    processingTimeMax: parseInt(process.env.PROCESSING_TIME_MAX || '10000', 10),
    abnormalRate: parseFloat(process.env.ABNORMAL_RATE || '0.15'),
    errorRate: parseFloat(process.env.ERROR_RATE || '0.02'),
    resultSendDelay: parseInt(process.env.RESULT_SEND_DELAY || '1000', 10),
    calibrationInterval: parseInt(process.env.CALIBRATION_INTERVAL || '300000', 10),
    logLevel: process.env.LOG_LEVEL || 'info',
  };
}
