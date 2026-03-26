export interface MlmsSimulatorConfig {
  rackCount: number;
  slotsPerRack: number;
  statSlots: number;
  throughputPerHour: number;
  processingTimeMinMs: number;
  processingTimeMaxMs: number;
  abnormalRate: number;
  errorRate: number;
  calibrationIntervalMs: number;
}

export interface MlmsInstrumentConfig {
  id: string;
  code: string;
  name: string;
  model: string;
  manufacturer: string;
  isActive: boolean;
  location: string | null;
  protocolType: string;
  connection: {
    host: string;
    port: number;
    baudRate: number | null;
  } | null;
  simulatorConfig: MlmsSimulatorConfig | null;
  testMappings: Array<{
    internalTestCode: string;
    instrumentTestCode: string;
    unit: string | null;
    sampleType: string | null;
    isActive: boolean;
  }>;
}

export class MlmsApiClient {
  private token: string | null = null;

  constructor(
    private readonly baseUrl: string,
    private readonly email: string,
    private readonly password: string,
  ) {}

  private async login(): Promise<void> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email, password: this.password }),
      });
      if (!res.ok) throw new Error(`Login failed: ${res.status}`);
      const body = await res.json() as { accessToken: string };
      this.token = body.accessToken;
      console.log('[MLMS] Authenticated as simulator service account');
    } catch (err) {
      console.error('[MLMS] Authentication failed:', err);
      throw err;
    }
  }

  private async get<T>(path: string): Promise<T> {
    if (!this.token) await this.login();
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    if (res.status === 401) {
      // Token expired, re-login once
      await this.login();
      const res2 = await fetch(`${this.baseUrl}${path}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      if (!res2.ok) throw new Error(`API call failed: ${res2.status} ${path}`);
      return res2.json() as Promise<T>;
    }
    if (!res.ok) throw new Error(`API call failed: ${res.status} ${path}`);
    return res.json() as Promise<T>;
  }

  async getActiveInstruments(): Promise<MlmsInstrumentConfig[]> {
    // Get list of instruments
    const listResult = await this.get<{ data: any[]; instruments: any[]; total: number }>('/instruments?pageSize=100');
    const instruments = listResult.data ?? listResult.instruments ?? listResult;

    const active = (Array.isArray(instruments) ? instruments : []).filter((i: any) => i.isActive);

    const results: MlmsInstrumentConfig[] = [];

    for (const inst of active) {
      let connection: MlmsInstrumentConfig['connection'] = null;
      let testMappings: MlmsInstrumentConfig['testMappings'] = [];

      try {
        const conn = await this.get<any>(`/instruments/${inst.id}/connection`);
        if (conn && conn.port) {
          connection = { host: conn.host, port: conn.port, baudRate: conn.baudRate ?? null };
        }
      } catch {
        // No connection configured
      }

      try {
        const mappings = await this.get<any[]>(`/instruments/${inst.id}/mappings`);
        testMappings = (Array.isArray(mappings) ? mappings : []).map((m: any) => ({
          internalTestCode: m.internalTestCode,
          instrumentTestCode: m.instrumentTestCode,
          unit: m.unit ?? null,
          sampleType: m.sampleType ?? null,
          isActive: m.isActive ?? true,
        }));
      } catch {
        // No mappings
      }

      let simulatorConfig: MlmsInstrumentConfig['simulatorConfig'] = null;
      try {
        const sc = await this.get<any>(`/instruments/${inst.id}/simulator-config`);
        if (sc) {
          simulatorConfig = {
            rackCount: sc.rackCount ?? 1,
            slotsPerRack: sc.slotsPerRack ?? 20,
            statSlots: sc.statSlots ?? 3,
            throughputPerHour: sc.throughputPerHour ?? 100,
            processingTimeMinMs: sc.processingTimeMinMs ?? 4000,
            processingTimeMaxMs: sc.processingTimeMaxMs ?? 10000,
            abnormalRate: sc.abnormalRate ?? 0.12,
            errorRate: sc.errorRate ?? 0.02,
            calibrationIntervalMs: sc.calibrationIntervalMs ?? 1800000,
          };
          console.log(`[MLMS] SimConfig for ${inst.code}: ${simulatorConfig.rackCount} racks × ${simulatorConfig.slotsPerRack} slots, ${simulatorConfig.statSlots} STAT, ${simulatorConfig.throughputPerHour}/h`);
        }
      } catch (err) {
        console.warn(`[MLMS] Could not fetch simulator config for ${inst.code}:`, err);
      }

      results.push({
        id: inst.id,
        code: inst.code,
        name: inst.name,
        model: inst.model ?? '',
        manufacturer: inst.manufacturer ?? '',
        isActive: inst.isActive,
        location: inst.location ?? null,
        protocolType: inst.protocolType ?? 'ASTM',
        connection,
        simulatorConfig,
        testMappings,
      });
    }

    console.log(`[MLMS] Loaded ${results.length} active instrument(s): ${results.map(i => i.code).join(', ')}`);
    return results;
  }
}
