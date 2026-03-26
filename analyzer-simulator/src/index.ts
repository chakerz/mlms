import { loadConfig } from './config';
import { AnalyzerSimulator } from './simulator/AnalyzerSimulator';
import { MultiInstrumentSimulator } from './simulator/MultiInstrumentSimulator';
import { MlmsApiClient } from './mlms/MlmsApiClient';
import { AnalyzerConfig } from './config/analyzer-config';
import { CobasE411Config } from './config/cobas-e411.config';

const CONFIG_MAP: Record<string, AnalyzerConfig> = {
  COBAS_E411: CobasE411Config,
};

const mlmsApiUrl = process.env.MLMS_API_URL;
const wsPort = parseInt(process.env.WS_PORT || '5001');

let stopFn: () => void;

if (mlmsApiUrl) {
  // Multi-instrument mode: read configs from MLMS
  console.log(`[Sim] Multi-instrument mode — MLMS API: ${mlmsApiUrl}`);
  const client = new MlmsApiClient(
    mlmsApiUrl,
    process.env.SIMULATOR_EMAIL || 'simulator@mlms.local',
    process.env.SIMULATOR_PASSWORD || 'Sim1234!',
  );
  const multi = new MultiInstrumentSimulator(client, wsPort);
  multi.start().catch(err => { console.error('[Sim] Fatal:', err); process.exit(1); });
  stopFn = () => multi.stop();
} else {
  // Legacy single-instrument mode
  const analyzerConfigCode = process.env.ANALYZER_CONFIG;
  if (analyzerConfigCode) {
    const analyzerConfig = CONFIG_MAP[analyzerConfigCode];
    if (!analyzerConfig) {
      console.error(`[Sim] Unknown ANALYZER_CONFIG: "${analyzerConfigCode}"`);
      process.exit(1);
    }
    const simulator = new AnalyzerSimulator(analyzerConfig);
    simulator.start().catch(err => { console.error('[Sim] Fatal:', err); process.exit(1); });
    stopFn = () => simulator.stop();
  } else {
    const legacyConfig = loadConfig();
    const simulator = new AnalyzerSimulator(legacyConfig);
    simulator.start().catch(err => { console.error('[Sim] Fatal:', err); process.exit(1); });
    stopFn = () => simulator.stop();
  }
}

process.on('SIGTERM', () => { console.log('[Sim] Shutting down...'); stopFn(); process.exit(0); });
process.on('SIGINT', () => { console.log('[Sim] Shutting down...'); stopFn(); process.exit(0); });
