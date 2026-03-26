import { AnalyzerConfig } from './analyzer-config';
import { CobasE411Config } from './cobas-e411.config';
import { CobasC311Config } from './cobas-c311.config';

// Registry: instrument code → AnalyzerConfig
// Add new device configs here as they are implemented
export const CONFIG_REGISTRY: Record<string, AnalyzerConfig> = {
  COBAS_E411: CobasE411Config,
  COBAS_C311: CobasC311Config,
};

export function getAnalyzerConfig(instrumentCode: string): AnalyzerConfig | null {
  return CONFIG_REGISTRY[instrumentCode] ?? null;
}
