import { MlmsApiClient, MlmsInstrumentConfig } from '../mlms/MlmsApiClient';
import { SimulatorWebSocketServer } from '../websocket/SimulatorWebSocketServer';
import { AnalyzerSimulator } from './AnalyzerSimulator';
import { getAnalyzerConfig } from '../config/config-registry';
import { AnalyzerConfig } from '../config/analyzer-config';

// Snapshot of last-seen simulator config per instrument code
interface ConfigSnapshot {
  rackCount: number; slotsPerRack: number; statSlots: number;
  throughputPerHour: number; processingTimeMinMs: number; processingTimeMaxMs: number;
  abnormalRate: number; errorRate: number;
}

function configKey(sc: ConfigSnapshot): string {
  return `${sc.rackCount}|${sc.slotsPerRack}|${sc.statSlots}|${sc.processingTimeMinMs}|${sc.processingTimeMaxMs}|${sc.abnormalRate}|${sc.errorRate}`;
}

export class MultiInstrumentSimulator {
  private ws: SimulatorWebSocketServer;
  private instances: Map<string, AnalyzerSimulator> = new Map();
  private configSnapshots: Map<string, string> = new Map();
  private pollTimer: NodeJS.Timeout | null = null;

  constructor(
    private readonly mlmsClient: MlmsApiClient,
    private readonly wsPort: number,
    private readonly pollIntervalMs: number = 30_000,
  ) {
    this.ws = new SimulatorWebSocketServer(wsPort);
  }

  async start(): Promise<void> {
    let instruments: MlmsInstrumentConfig[] = [];

    try {
      instruments = await this.mlmsClient.getActiveInstruments();
    } catch (err) {
      console.error('[MultiSim] Failed to load instruments from MLMS:', err);
      console.warn('[MultiSim] No instruments could be loaded. Simulator will be empty.');
    }

    if (instruments.length === 0) {
      console.warn('[MultiSim] No active instruments found in MLMS.');
      return;
    }

    for (const inst of instruments) {
      const analyzerConfig = getAnalyzerConfig(inst.code);
      if (!analyzerConfig) {
        console.warn(`[MultiSim] No AnalyzerConfig found for instrument code "${inst.code}" – skipping.`);
        continue;
      }

      if (!inst.connection?.port) {
        console.warn(`[MultiSim] Instrument "${inst.code}" has no connection port configured – skipping.`);
        continue;
      }

      // Build config: merge hardcoded defaults with DB overrides
      const sc = inst.simulatorConfig;
      const configWithPort: AnalyzerConfig = {
        ...analyzerConfig,
        protocol: {
          ...analyzerConfig.protocol,
          connection: {
            ...analyzerConfig.protocol.connection,
            port: inst.connection.port,
          },
        },
        visualization: sc ? {
          ...analyzerConfig.visualization,
          racks: sc.rackCount,
          slotsPerRack: sc.slotsPerRack,
          statLaneSlots: sc.statSlots,
          supportsStatLane: sc.statSlots > 0,
        } : analyzerConfig.visualization,
        simulation: {
          ...analyzerConfig.simulation,
          // Always use name/model from MLMS DB
          name: inst.name,
          model: inst.model || analyzerConfig.simulation.model,
          // Override simulation params from DB config if present
          ...(sc ? {
            throughputPerHour: sc.throughputPerHour,
            processingTimeMinMs: sc.processingTimeMinMs,
            processingTimeMaxMs: sc.processingTimeMaxMs,
            abnormalRate: sc.abnormalRate,
            errorRate: sc.errorRate,
            calibrationIntervalMs: sc.calibrationIntervalMs,
          } : {}),
        },
      };

      try {
        const simulator = new AnalyzerSimulator(configWithPort, this.ws, inst.code);
        this.instances.set(inst.code, simulator);
        await simulator.startWithSharedWs();
        // Store initial config snapshot for change detection
        if (sc) this.configSnapshots.set(inst.code, configKey(sc));
        console.log(`[MultiSim] Started simulator for ${inst.code} (ASTM port ${inst.connection.port})`);
      } catch (err) {
        console.error(`[MultiSim] Failed to start simulator for ${inst.code}:`, err);
      }
    }

    console.log(`[MultiSim] ${this.instances.size} instrument(s) running.`);
    this.startConfigPolling();
  }

  private startConfigPolling(): void {
    this.pollTimer = setInterval(async () => {
      try {
        const instruments = await this.mlmsClient.getActiveInstruments();
        for (const inst of instruments) {
          const sim = this.instances.get(inst.code);
          if (!sim || !inst.simulatorConfig) continue;
          const sc = inst.simulatorConfig;
          const key = configKey(sc);
          if (this.configSnapshots.get(inst.code) !== key) {
            const applied = sim.applySimulatorConfig(sc);
            // Only update snapshot if actually applied (not deferred due to busy state)
            if (applied) this.configSnapshots.set(inst.code, key);
          }
        }
      } catch {
        // Poll errors are non-fatal
      }
    }, this.pollIntervalMs);
  }

  stop(): void {
    if (this.pollTimer) clearInterval(this.pollTimer);
    for (const [, sim] of this.instances) {
      sim.stop();
    }
    this.ws.close();
  }
}
