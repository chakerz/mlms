# Claude-Auftrag: Konfigurierbarer Analyzer-Visualizer für Cobas e 411

## Kontext

Wir entwickeln ein MLMS (Medical Laboratory Management System) mit einem Analyzer-Simulator-Service und einem Dashboard-Frontend.

Wir haben bereits:
- Einen Analyzer-Simulator als Node.js/TypeScript Docker-Service mit ASTM/TCP und WebSocket
- Ein Frontend-Dashboard das Racks, Slots, Animationen und Logs visualisiert
- Bestehende Datenbank mit mehreren Geräten in der Tabelle `instruments`

## Problem

Aktuell ist der Simulator und der Visualizer **hart codiert**: Rack-Anzahl, Slot-Anzahl, Farben, Timings und Protokoll-Details sind im Code fest verdrahtet.

Wir haben aber in der DB **viele verschiedene Geräte** und wollen für jedes Gerät eine eigene Konfiguration definieren, ohne den Code jedes Mal anzufassen.

## Ziel

1. Eine **generische Config-Struktur** für Geräte entwerfen (TypeScript Interfaces)
2. Eine konkrete **Cobas e 411 Config** als erste Gerätekonfiguration implementieren
3. Den **Simulator-Service** so umbauen, dass er die Config verwendet
4. Den **Frontend-Visualizer** so umbauen, dass Layout, Slots, Farben und Verhalten aus der Config kommen
5. Die Architektur so vorbereiten, dass wir später beliebige weitere Geräte per Config aus der DB einhängen können

Wir fangen konkret mit **einem Gerät** an: **Cobas e 411** (Immunoassay-Analyzer von Roche).

---

## Cobas e 411 — Gerätedaten

Folgende Eigenschaften soll die Config des Cobas e 411 abbilden:

- **Hersteller**: Roche Diagnostics
- **Typ**: Immunoassay-Analyzer (Elektrochemilumineszenz)
- **Protokoll**: ASTM (Elecsys/cobas-Variante)
- **Transport im echten Gerät**: RS-232, 9600 bps, 8N1, half-duplex
- **Transport im Simulator**: TCP (emuliert RS-232)
- **ASTM Frame-Länge**: 247 Zeichen
- **Durchsatz**: ~86–88 Tests/h
- **Rack-Layout**: lineare Rack-Visualisierung mit einer Reihe
- **Slots**: ca. 30 Positionen
- **STAT-Lane**: vorhanden, ca. 5 STAT-Slots
- **Processing-Zeit**: 6–15 Sekunden (simuliert)
- **Abnormal-Rate**: ~15 % (konfigurierbar)
- **Fehlerrate**: ~3 % (konfigurierbar)

---

## Schritt 1: Generische Config-Interfaces anlegen

Lege folgende Datei neu an:

`analyzer-simulator/src/config/analyzer-config.ts`

```ts
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
```

---

## Schritt 2: Cobas e 411 Config anlegen

Lege folgende Datei neu an:

`analyzer-simulator/src/config/cobas-e411.config.ts`

```ts
import { AnalyzerConfig } from './analyzer-config';

export const CobasE411Config: AnalyzerConfig = {
  code: 'COBAS_E411',

  visualization: {
    layoutType: 'RACK',
    racks: 1,
    slotsPerRack: 30,
    supportsStatLane: true,
    statLaneSlots: 5,
    colorScheme: {
      idle: '#9ca3af',
      ready: '#22c55e',
      processing: '#f97316',
      sending: '#06b6d4',
      error: '#ef4444'
    },
    icons: {
      slotLoaded: 'tube',
      slotProcessing: 'spinner',
      slotError: 'cross',
      slotDone: 'check'
    }
  },

  protocol: {
    protocolType: 'ASTM',
    astmVariant: 'ELECSYS',
    connection: {
      transport: 'TCP',
      port: 5000,
      speed: 9600,
      charConfig: '8N1',
      frameLength: 247
    }
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
    calibrationIntervalMs: 15 * 60 * 1000
  }
};
```

---

## Schritt 3: Simulator-State mit Config initialisieren

Lege folgende Datei neu an:

`analyzer-simulator/src/simulator/createInitialState.ts`

```ts
import { AnalyzerConfig } from '../config/analyzer-config';

export interface SlotState {
  slotNumber: number;
  status: string;
  sampleId: string | null;
  barcode: string | null;
  tests: string[];
  progress: number;
  result: any | null;
  isStatSlot: boolean;
}

export interface RackState {
  rackId: string;
  position: number;
  slots: SlotState[];
}

export interface SimulatorState {
  analyzer: {
    id: string;
    name: string;
    model: string;
    status: string;
    currentRunId: string | null;
    processingCount: number;
    totalProcessed: number;
    errorCount: number;
    lastActivity: string;
  };
  racks: RackState[];
  samples: any[];
  connection: {
    lisConnected: boolean;
    lisHost: string | null;
    lisPort: number;
    lastMessageAt: string | null;
    messagesSent: number;
    messagesReceived: number;
  };
  stats: {
    todaysSamples: number;
    averageProcessingMs: number;
    abnormalRate: number;
    errorRate: number;
  };
}

export function createInitialState(config: AnalyzerConfig): SimulatorState {
  const racks: RackState[] = [];

  for (let r = 0; r < config.visualization.racks; r++) {
    const slots: SlotState[] = [];
    const totalSlots = config.visualization.slotsPerRack;
    const statSlots = config.visualization.supportsStatLane
      ? (config.visualization.statLaneSlots ?? 0)
      : 0;

    for (let s = 1; s <= totalSlots; s++) {
      slots.push({
        slotNumber: s,
        status: 'EMPTY',
        sampleId: null,
        barcode: null,
        tests: [],
        progress: 0,
        result: null,
        isStatSlot: s <= statSlots
      });
    }

    racks.push({
      rackId: `RACK_${r + 1}`,
      position: r + 1,
      slots
    });
  }

  return {
    analyzer: {
      id: config.simulation.analyzerId,
      name: config.simulation.name,
      model: config.simulation.model,
      status: 'READY',
      currentRunId: null,
      processingCount: 0,
      totalProcessed: 0,
      errorCount: 0,
      lastActivity: new Date().toISOString()
    },
    racks,
    samples: [],
    connection: {
      lisConnected: false,
      lisHost: null,
      lisPort: config.protocol.connection.port,
      lastMessageAt: null,
      messagesSent: 0,
      messagesReceived: 0
    },
    stats: {
      todaysSamples: 0,
      averageProcessingMs: 0,
      abnormalRate: config.simulation.abnormalRate,
      errorRate: config.simulation.errorRate
    }
  };
}
```

---

## Schritt 4: AnalyzerSimulator.ts an Config anschließen

Suche die zentrale Simulator-Klasse (z. B. `AnalyzerSimulator.ts`).

Ändere sie so, dass sie die Config verwendet:

```ts
import { AnalyzerConfig } from '../config/analyzer-config';
import { CobasE411Config } from '../config/cobas-e411.config';
import { createInitialState, SimulatorState } from './createInitialState';

export class AnalyzerSimulator {
  private config: AnalyzerConfig;
  private state: SimulatorState;

  constructor(config: AnalyzerConfig = CobasE411Config) {
    this.config = config;
    this.state = createInitialState(config);
  }

  getConfig(): AnalyzerConfig {
    return this.config;
  }

  getState(): SimulatorState {
    return this.state;
  }

  getProcessingTimeMs(): number {
    const min = this.config.simulation.processingTimeMinMs;
    const max = this.config.simulation.processingTimeMaxMs;
    return min + Math.random() * (max - min);
  }

  shouldGenerateError(): boolean {
    return Math.random() < this.config.simulation.errorRate;
  }

  shouldGenerateAbnormal(): boolean {
    return Math.random() < this.config.simulation.abnormalRate;
  }

  getCalibrationIntervalMs(): number {
    return this.config.simulation.calibrationIntervalMs;
  }
}
```

---

## Schritt 5: WebSocket-Server gibt Config mit

Suche deinen `SimulatorWebSocketServer.ts`.

Beim Senden des initialen State-Events soll auch `config` mitgesendet werden:

```ts
private sendFullState(ws: WebSocket): void {
  ws.send(JSON.stringify({
    event: 'ANALYZER_STATE',
    data: {
      config: this.simulator.getConfig(),
      state: this.simulator.getState()
    }
  }));
}
```

Beim Senden von State-Updates nur den State senden:

```ts
public broadcastStateUpdate(): void {
  const payload = JSON.stringify({
    event: 'ANALYZER_STATE_UPDATE',
    data: {
      state: this.simulator.getState()
    }
  });
  for (const client of this.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}
```

---

## Schritt 6: Testdatenbank für Cobas e 411

Suche deinen `ResultGenerator.ts`.

Ersetze oder erweitere die hardcodierten Testlisten durch eine Config-getriebene Variante.

Lege folgende Datei neu an:

`analyzer-simulator/src/simulator/cobas-e411.tests.ts`

```ts
export interface TestDefinition {
  code: string;
  name: string;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  category: 'NUMERIC' | 'QUALITATIVE';
}

// Typische Immunoassay-Tests des Cobas e 411
export const CobasE411Tests: TestDefinition[] = [
  { code: 'TSH',    name: 'TSH',           unit: 'mUI/L',  referenceMin: 0.27,  referenceMax: 4.20,  category: 'NUMERIC' },
  { code: 'FT4',    name: 'T4 Libre',      unit: 'pmol/L', referenceMin: 12,    referenceMax: 22,    category: 'NUMERIC' },
  { code: 'FT3',    name: 'T3 Libre',      unit: 'pmol/L', referenceMin: 3.1,   referenceMax: 6.8,   category: 'NUMERIC' },
  { code: 'LH',     name: 'LH',            unit: 'mUI/mL', referenceMin: 1.7,   referenceMax: 8.6,   category: 'NUMERIC' },
  { code: 'FSH',    name: 'FSH',           unit: 'mUI/mL', referenceMin: 1.5,   referenceMax: 12.4,  category: 'NUMERIC' },
  { code: 'PRL',    name: 'Prolactine',    unit: 'µg/L',   referenceMin: 4.0,   referenceMax: 15.2,  category: 'NUMERIC' },
  { code: 'E2',     name: 'Oestradiol',    unit: 'pmol/L', referenceMin: 73,    referenceMax: 550,   category: 'NUMERIC' },
  { code: 'TESTO',  name: 'Testostérone',  unit: 'nmol/L', referenceMin: 9.9,   referenceMax: 27.8,  category: 'NUMERIC' },
  { code: 'PROG',   name: 'Progestérone',  unit: 'nmol/L', referenceMin: 0.6,   referenceMax: 4.7,   category: 'NUMERIC' },
  { code: 'HCG',    name: 'βHCG',          unit: 'mUI/mL', referenceMin: 0,     referenceMax: 5,     category: 'NUMERIC' },
  { code: 'INSU',   name: 'Insuline',      unit: 'mUI/L',  referenceMin: 2.6,   referenceMax: 24.9,  category: 'NUMERIC' },
  { code: 'CPP',    name: 'Peptide C',     unit: 'nmol/L', referenceMin: 0.37,  referenceMax: 1.47,  category: 'NUMERIC' },
  { code: 'CRT',    name: 'Cortisol',      unit: 'nmol/L', referenceMin: 171,   referenceMax: 536,   category: 'NUMERIC' },
  { code: 'DHEAS',  name: 'DHEA-S',        unit: 'µmol/L', referenceMin: 4.3,   referenceMax: 12.2,  category: 'NUMERIC' },
  { code: 'PTH',    name: 'PTH intacte',   unit: 'pmol/L', referenceMin: 1.6,   referenceMax: 6.9,   category: 'NUMERIC' },
  { code: 'VIT_D',  name: 'Vitamine D',    unit: 'nmol/L', referenceMin: 75,    referenceMax: 250,   category: 'NUMERIC' },
  { code: 'B12',    name: 'Vitamine B12',  unit: 'pmol/L', referenceMin: 150,   referenceMax: 700,   category: 'NUMERIC' },
  { code: 'FOLAT',  name: 'Folate',        unit: 'nmol/L', referenceMin: 10,    referenceMax: 42,    category: 'NUMERIC' },
  { code: 'FERR',   name: 'Ferritine',     unit: 'ng/mL',  referenceMin: 20,    referenceMax: 200,   category: 'NUMERIC' },
  { code: 'PSA',    name: 'PSA total',     unit: 'µg/L',   referenceMin: 0,     referenceMax: 4,     category: 'NUMERIC' },
  { code: 'AFP',    name: 'Alpha-fœtoprotéine', unit: 'µg/L', referenceMin: 0,  referenceMax: 7,     category: 'NUMERIC' },
  { code: 'CEA',    name: 'ACE',           unit: 'µg/L',   referenceMin: 0,     referenceMax: 5,     category: 'NUMERIC' },
  { code: 'CA125',  name: 'CA 125',        unit: 'kUI/L',  referenceMin: 0,     referenceMax: 35,    category: 'NUMERIC' },
  { code: 'CA199',  name: 'CA 19-9',       unit: 'kUI/L',  referenceMin: 0,     referenceMax: 37,    category: 'NUMERIC' },
  { code: 'TROPP',  name: 'Troponine P',   unit: 'ng/L',   referenceMin: 0,     referenceMax: 14,    category: 'NUMERIC' },
  { code: 'NT_BNP', name: 'NT-proBNP',     unit: 'ng/L',   referenceMin: 0,     referenceMax: 125,   category: 'NUMERIC' },
  { code: 'CRP_HS', name: 'CRP Haute Sens', unit: 'mg/L',  referenceMin: 0,     referenceMax: 1,     category: 'NUMERIC' },
  { code: 'HBS_AG', name: 'Ag HBs',        unit: '',       referenceMin: 0,     referenceMax: 0,     category: 'QUALITATIVE' },
  { code: 'AC_HBS', name: 'Ac anti-HBs',   unit: 'mUI/mL', referenceMin: 10,   referenceMax: 1000,  category: 'NUMERIC' },
  { code: 'AC_HBC', name: 'Ac anti-HBc Total', unit: '',   referenceMin: 0,     referenceMax: 0,     category: 'QUALITATIVE' },
  { code: 'AC_VIH', name: 'HIV Ag/Ac',     unit: '',       referenceMin: 0,     referenceMax: 0,     category: 'QUALITATIVE' },
  { code: 'AC_VHC', name: 'Ac anti-HCV',   unit: '',       referenceMin: 0,     referenceMax: 0,     category: 'QUALITATIVE' }
];
```

Ändere `ResultGenerator.ts` so, dass er diese Testliste verwendet:

```ts
import { CobasE411Tests, TestDefinition } from './cobas-e411.tests';

export class ResultGenerator {
  private tests: TestDefinition[];
  private abnormalRate: number;
  private errorRate: number;

  constructor(
    tests: TestDefinition[] = CobasE411Tests,
    abnormalRate = 0.15,
    errorRate = 0.03
  ) {
    this.tests = tests;
    this.abnormalRate = abnormalRate;
    this.errorRate = errorRate;
  }

  generateResult(testCode: string): {
    value: string;
    unit: string;
    flag: 'NORMAL' | 'HIGH' | 'LOW' | 'ERROR';
    referenceRange: string;
  } {
    const def = this.tests.find((t) => t.code === testCode);
    if (!def) throw new Error(`Test code not found: ${testCode}`);

    if (Math.random() < this.errorRate) {
      return { value: '', unit: def.unit, flag: 'ERROR', referenceRange: '' };
    }

    if (def.category === 'QUALITATIVE') {
      const positive = Math.random() < this.abnormalRate;
      return {
        value: positive ? 'POSITIF' : 'NEGATIF',
        unit: '',
        flag: positive ? 'HIGH' : 'NORMAL',
        referenceRange: 'NEGATIF'
      };
    }

    const range = def.referenceMax - def.referenceMin;
    const isAbnormal = Math.random() < this.abnormalRate;

    let value: number;
    let flag: 'NORMAL' | 'HIGH' | 'LOW';

    if (!isAbnormal) {
      value = def.referenceMin + Math.random() * range;
      flag = 'NORMAL';
    } else {
      const isHigh = Math.random() > 0.5;
      if (isHigh) {
        value = def.referenceMax + Math.random() * range * 0.5;
        flag = 'HIGH';
      } else {
        value = def.referenceMin - Math.random() * range * 0.3;
        value = Math.max(0, value);
        flag = 'LOW';
      }
    }

    return {
      value: value.toFixed(2),
      unit: def.unit,
      flag,
      referenceRange: `${def.referenceMin}–${def.referenceMax}`
    };
  }
}
```

---

## Schritt 7: docker-compose.yml um Cobas-Simulator erweitern

Ergänze die bestehende `docker-compose.yml` um folgenden Service:

```yaml
  cobas-e411-simulator:
    build:
      context: ./analyzer-simulator
      dockerfile: Dockerfile
    container_name: mlms_cobas_e411_simulator
    ports:
      - "5000:5000"
      - "5001:5001"
    environment:
      - ANALYZER_CONFIG=COBAS_E411
      - ASTM_PORT=5000
      - WS_PORT=5001
      - LOG_LEVEL=info
    networks:
      - mlms_network
    healthcheck:
      test: ["CMD", "node", "-e", "require('net').connect(5000, 'localhost', () => process.exit(0))"]
      interval: 10s
      timeout: 5s
      retries: 3
    restart: unless-stopped
```

Passe `index.ts` im Simulator so an, dass er per ENV den richtigen Config-Code lädt:

```ts
import { CobasE411Config } from './config/cobas-e411.config';
import { AnalyzerConfig } from './config/analyzer-config';

const CONFIG_MAP: Record<string, AnalyzerConfig> = {
  'COBAS_E411': CobasE411Config
  // später: 'SYSMEX_XN': SysmexXNConfig, etc.
};

const configCode = process.env.ANALYZER_CONFIG ?? 'COBAS_E411';
const config = CONFIG_MAP[configCode];

if (!config) {
  console.error(`Unknown ANALYZER_CONFIG: ${configCode}`);
  process.exit(1);
}

const simulator = new AnalyzerSimulator(config);
// ... Rest Startup
```

---

## Schritt 8: Instrument in der DB anlegen (Seed)

Lege in deinem Seed-Script (oder einer neuen Seed-Datei) folgenden Eintrag für den Cobas e 411 Simulator an.

Passe die Tabellen- und Feldnamen an deine vorhandene Datenbankstruktur an:

```sql
INSERT INTO instruments (
  id,
  code,
  name,
  manufacturer,
  model,
  protocol_type,
  transport_type,
  direction_mode,
  is_active,
  location,
  visualization_config,
  simulation_config,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'COBAS_E411',
  'cobas e 411',
  'Roche Diagnostics',
  'cobas e 411',
  'ASTM',
  'TCP',
  'BIDIRECTIONAL',
  true,
  'Labo Immunologie',
  '{
    "layoutType": "RACK",
    "racks": 1,
    "slotsPerRack": 30,
    "supportsStatLane": true,
    "statLaneSlots": 5,
    "colorScheme": {
      "idle": "#9ca3af",
      "ready": "#22c55e",
      "processing": "#f97316",
      "sending": "#06b6d4",
      "error": "#ef4444"
    },
    "icons": {
      "slotLoaded": "tube",
      "slotProcessing": "spinner",
      "slotError": "cross",
      "slotDone": "check"
    }
  }',
  '{
    "analyzerId": "SIM_COBAS_E411",
    "throughputPerHour": 86,
    "processingTimeMinMs": 6000,
    "processingTimeMaxMs": 15000,
    "abnormalRate": 0.15,
    "errorRate": 0.03,
    "calibrationIntervalMs": 900000
  }',
  NOW(),
  NOW()
)
ON CONFLICT (code) DO NOTHING;
```

Lege auch Testmappings an:

```sql
INSERT INTO instrument_test_mappings
  (id, instrument_id, internal_test_code, instrument_test_code, sample_type, unit, is_active)
SELECT
  gen_random_uuid(),
  i.id,
  m.internal_code,
  m.instrument_code,
  'SERUM',
  m.unit,
  true
FROM instruments i,
(VALUES
  ('TSH',   'TSH',   'mUI/L'),
  ('FT4',   'FT4',   'pmol/L'),
  ('FT3',   'FT3',   'pmol/L'),
  ('LH',    'LH',    'mUI/mL'),
  ('FSH',   'FSH',   'mUI/mL'),
  ('PRL',   'PRL',   'µg/L'),
  ('E2',    'E2',    'pmol/L'),
  ('TESTO', 'TESTO', 'nmol/L'),
  ('PROG',  'PROG',  'nmol/L'),
  ('HCG',   'HCG',  'mUI/mL'),
  ('INSU',  'INSU',  'mUI/L'),
  ('CRT',   'CRT',   'nmol/L'),
  ('PTH',   'PTH',   'pmol/L'),
  ('VIT_D', 'VIT_D', 'nmol/L'),
  ('B12',   'B12',   'pmol/L'),
  ('FOLAT', 'FOLAT', 'nmol/L'),
  ('FERR',  'FERR',  'ng/mL'),
  ('PSA',   'PSA',   'µg/L'),
  ('AFP',   'AFP',   'µg/L'),
  ('CEA',   'CEA',   'µg/L'),
  ('CA125', 'CA125', 'kUI/L'),
  ('CA199', 'CA199', 'kUI/L'),
  ('TROPP', 'TROPP', 'ng/L'),
  ('NT_BNP','NT_BNP','ng/L'),
  ('CRP_HS','CRP_HS','mg/L'),
  ('HBS_AG','HBS_AG',''),
  ('AC_HBS','AC_HBS','mUI/mL'),
  ('AC_HBC','AC_HBC',''),
  ('AC_VIH','AC_VIH',''),
  ('AC_VHC','AC_VHC','')
) AS m(internal_code, instrument_code, unit)
WHERE i.code = 'COBAS_E411'
ON CONFLICT DO NOTHING;
```

---

## Schritt 9: Frontend-Typen anlegen

Lege folgende Datei im Frontend an:

`frontend/src/types/analyzer.ts`

```ts
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

export interface AnalyzerColorScheme {
  idle: string;
  ready: string;
  processing: string;
  sending: string;
  error: string;
}

export interface AnalyzerVisualizationConfig {
  layoutType: LayoutType;
  racks: number;
  slotsPerRack: number;
  supportsStatLane: boolean;
  statLaneSlots?: number;
  colorScheme: AnalyzerColorScheme;
  icons: {
    slotLoaded: string;
    slotProcessing: string;
    slotError: string;
    slotDone: string;
  };
}

export interface AnalyzerConfig {
  code: string;
  visualization: AnalyzerVisualizationConfig;
}

export interface SlotState {
  slotNumber: number;
  status: SlotStatus;
  sampleId: string | null;
  barcode: string | null;
  tests: string[];
  progress: number;
  isStatSlot: boolean;
  result: null | {
    testCode: string;
    value: string;
    unit: string;
    flag: string;
  }[];
}

export interface RackState {
  rackId: string;
  position: number;
  slots: SlotState[];
}

export interface ConnectionState {
  lisConnected: boolean;
  lisHost: string | null;
  lisPort: number;
  lastMessageAt: string | null;
  messagesSent: number;
  messagesReceived: number;
}

export interface AnalyzerInfo {
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

export interface SimulatorStats {
  todaysSamples: number;
  averageProcessingMs: number;
  abnormalRate: number;
  errorRate: number;
}

export interface SimulatorState {
  analyzer: AnalyzerInfo;
  racks: RackState[];
  connection: ConnectionState;
  stats: SimulatorStats;
}
```

---

## Schritt 10: Frontend-Komponenten implementieren

### 10.1 SlotCircle.tsx

`frontend/src/components/analyzer/SlotCircle.tsx`

```tsx
import React from 'react';
import { SlotState, AnalyzerColorScheme } from '../../types/analyzer';

interface Props {
  slot: SlotState;
  colorScheme: AnalyzerColorScheme;
  x: number;
  y: number;
  radius?: number;
}

const CIRCUMFERENCE = (r: number) => 2 * Math.PI * r;

export const SlotCircle: React.FC<Props> = ({
  slot,
  colorScheme,
  x,
  y,
  radius = 18
}) => {
  const innerRadius = radius - 4;
  const circ = CIRCUMFERENCE(radius);
  const dashOffset = circ * (1 - (slot.progress ?? 0) / 100);

  const fill =
    slot.status === 'EMPTY'       ? '#e5e7eb'
    : slot.status === 'DONE'      ? colorScheme.ready
    : slot.status === 'ERROR'     ? colorScheme.error
    : slot.status === 'PROCESSING'? colorScheme.processing
    : slot.status === 'SENDING'   ? colorScheme.sending
    : slot.status === 'LOADED'    ? colorScheme.idle
    : slot.status === 'SCANNING'  ? '#facc15'
    : slot.status === 'WAITING'   ? '#facc15'
    : colorScheme.idle;

  const isBlinking =
    slot.status === 'PROCESSING' ||
    slot.status === 'ERROR' ||
    slot.status === 'SENDING';

  return (
    <g>
      {/* STAT-Markierung */}
      {slot.isStatSlot && (
        <rect
          x={x - radius - 2}
          y={y - radius - 2}
          width={(radius + 2) * 2}
          height={(radius + 2) * 2}
          rx={4}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={1.5}
          strokeDasharray="3 2"
        />
      )}

      {/* Fortschrittsring */}
      {slot.status === 'PROCESSING' && (
        <circle
          cx={x}
          cy={y}
          r={radius}
          fill="none"
          stroke={colorScheme.processing}
          strokeWidth={3}
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${x} ${y})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      )}

      {/* Haupt-Kreis */}
      <circle
        cx={x}
        cy={y}
        r={innerRadius}
        fill={fill}
        style={
          isBlinking
            ? { animation: 'pulse 1.2s ease-in-out infinite' }
            : undefined
        }
      />

      {/* Icons */}
      {slot.status === 'DONE' && (
        <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">
          ✓
        </text>
      )}
      {slot.status === 'ERROR' && (
        <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">
          !
        </text>
      )}
      {slot.status === 'SENDING' && (
        <text x={x} y={y + 4} textAnchor="middle" fontSize="9" fill="white">
          ↗
        </text>
      )}
      {slot.status === 'SCANNING' && (
        <text x={x} y={y + 4} textAnchor="middle" fontSize="9" fill="white">
          ⌕
        </text>
      )}

      {/* Slot-Nummer */}
      <text x={x} y={y + innerRadius + 12} textAnchor="middle" fontSize="8" fill="#6b7280">
        {slot.slotNumber}
      </text>
    </g>
  );
};
```

### 10.2 RackView.tsx

`frontend/src/components/analyzer/RackView.tsx`

```tsx
import React from 'react';
import { RackState, AnalyzerVisualizationConfig } from '../../types/analyzer';
import { SlotCircle } from './SlotCircle';

interface Props {
  rack: RackState;
  config: AnalyzerVisualizationConfig;
}

const SLOT_SIZE = 52;
const PADDING_X = 20;
const PADDING_Y = 40;
const HEIGHT = 90;

export const RackView: React.FC<Props> = ({ rack, config }) => {
  const width = PADDING_X * 2 + config.slotsPerRack * SLOT_SIZE;

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-2">
      <div className="text-xs text-gray-500 font-medium mb-1 pl-1">
        {rack.rackId}
        {config.supportsStatLane && (
          <span className="ml-2 text-amber-500 text-xs">
            ⚑ STAT: Slot 1–{config.statLaneSlots}
          </span>
        )}
      </div>
      <svg width={width} height={HEIGHT}>
        {/* Rack-Hintergrundbalken */}
        <rect
          x={PADDING_X - 8}
          y={PADDING_Y - 22}
          width={config.slotsPerRack * SLOT_SIZE + 16}
          height={44}
          rx={6}
          fill="#e5e7eb"
        />

        {rack.slots.map((slot, index) => (
          <SlotCircle
            key={`${rack.rackId}-${slot.slotNumber}`}
            slot={slot}
            colorScheme={config.colorScheme}
            x={PADDING_X + index * SLOT_SIZE + SLOT_SIZE / 2}
            y={PADDING_Y}
            radius={16}
          />
        ))}
      </svg>
    </div>
  );
};
```

### 10.3 AnalyzerHeader.tsx

`frontend/src/components/analyzer/AnalyzerHeader.tsx`

```tsx
import React from 'react';
import { AnalyzerInfo, ConnectionState, AnalyzerColorScheme } from '../../types/analyzer';

interface Props {
  analyzer: AnalyzerInfo;
  connection: ConnectionState;
  colorScheme: AnalyzerColorScheme;
}

const STATUS_LABELS: Record<string, string> = {
  IDLE: 'Inactif',
  READY: 'Prêt',
  RUNNING: 'En marche',
  PROCESSING: 'En traitement',
  SENDING_RESULTS: 'Envoi résultats',
  CALIBRATING: 'Calibration',
  ERROR: 'Erreur',
  MAINTENANCE: 'Maintenance',
  OFFLINE: 'Hors ligne'
};

export const AnalyzerHeader: React.FC<Props> = ({ analyzer, connection, colorScheme }) => {
  const statusColor =
    analyzer.status === 'READY'              ? colorScheme.ready
    : analyzer.status === 'PROCESSING'       ? colorScheme.processing
    : analyzer.status === 'SENDING_RESULTS'  ? colorScheme.sending
    : analyzer.status === 'ERROR'            ? colorScheme.error
    : colorScheme.idle;

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Status-Kreis */}
        <span
          className="inline-block w-4 h-4 rounded-full"
          style={{
            backgroundColor: statusColor,
            boxShadow: `0 0 8px ${statusColor}`,
            animation:
              ['PROCESSING', 'SENDING_RESULTS', 'ERROR'].includes(analyzer.status)
                ? 'pulse 1s ease-in-out infinite'
                : 'none'
          }}
        />
        <div>
          <div className="font-semibold text-gray-800 text-sm">{analyzer.name}</div>
          <div className="text-xs text-gray-400">{analyzer.model}</div>
        </div>
        <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: statusColor + '20', color: statusColor }}>
          {STATUS_LABELS[analyzer.status] ?? analyzer.status}
        </span>
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-500">
        <div>
          <span className="font-medium text-gray-700">{analyzer.totalProcessed}</span>
          <span className="ml-1 text-xs">traités</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">{analyzer.processingCount}</span>
          <span className="ml-1 text-xs">en cours</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">{analyzer.errorCount}</span>
          <span className="ml-1 text-xs">erreurs</span>
        </div>
        {/* LIS-Verbindung */}
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: connection.lisConnected ? colorScheme.ready : colorScheme.error,
              animation: connection.lisConnected ? 'none' : 'pulse 1.5s infinite'
            }}
          />
          <span className="text-xs">
            {connection.lisConnected ? 'LIS connecté' : 'LIS déconnecté'}
          </span>
        </div>
      </div>
    </div>
  );
};
```

### 10.4 SimulatorLogPanel.tsx

`frontend/src/components/analyzer/SimulatorLogPanel.tsx`

```tsx
import React, { useEffect, useRef } from 'react';

interface LogEntry {
  timestamp: string;
  event: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

interface Props {
  entries: LogEntry[];
}

const TYPE_COLORS = {
  info: 'text-blue-400',
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400'
};

export const SimulatorLogPanel: React.FC<Props> = ({ entries }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-3 h-52 overflow-y-auto font-mono text-xs">
      {entries.map((entry, i) => (
        <div key={i} className="flex gap-2 py-0.5">
          <span className="text-gray-500 shrink-0">{entry.timestamp.slice(11, 19)}</span>
          <span className={`shrink-0 w-36 ${TYPE_COLORS[entry.type]}`}>{entry.event}</span>
          <span className="text-gray-300">{entry.message}</span>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
};
```

### 10.5 AnalyzerVisualizer.tsx (Hauptkomponente)

`frontend/src/components/analyzer/AnalyzerVisualizer.tsx`

```tsx
import React from 'react';
import { AnalyzerConfig, SimulatorState } from '../../types/analyzer';
import { AnalyzerHeader } from './AnalyzerHeader';
import { RackView } from './RackView';

interface Props {
  config: AnalyzerConfig;
  state: SimulatorState;
}

export const AnalyzerVisualizer: React.FC<Props> = ({ config, state }) => {
  const { visualization } = config;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <AnalyzerHeader
        analyzer={state.analyzer}
        connection={state.connection}
        colorScheme={visualization.colorScheme}
      />

      {/* Racks */}
      <div className="flex flex-col gap-3">
        {state.racks.map((rack) => (
          <RackView key={rack.rackId} rack={rack} config={visualization} />
        ))}
      </div>

      {/* Statistik-Zeile */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Échantillons aujourd\'hui', value: state.stats.todaysSamples },
          {
            label: 'Temps moyen',
            value: `${(state.stats.averageProcessingMs / 1000).toFixed(1)}s`
          },
          { label: 'Taux anormal', value: `${(state.stats.abnormalRate * 100).toFixed(0)}%` },
          { label: 'Taux erreur', value: `${(state.stats.errorRate * 100).toFixed(0)}%` }
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg border border-gray-200 p-3 text-center"
          >
            <div className="text-xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## Schritt 11: Dashboard-Seite implementieren

Erstelle oder ersetze die Seite:

`frontend/src/pages/CobasE411SimulatorPage.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import { AnalyzerConfig, SimulatorState } from '../types/analyzer';
import { AnalyzerVisualizer } from '../components/analyzer/AnalyzerVisualizer';
import { SimulatorLogPanel } from '../components/analyzer/SimulatorLogPanel';

const WS_URL = import.meta.env.VITE_COBAS_SIM_WS_URL ?? 'ws://localhost:5001';

interface LogEntry {
  timestamp: string;
  event: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

const MAX_LOG_ENTRIES = 100;

const eventToLogEntry = (msg: any): LogEntry | null => {
  const ts = new Date().toISOString();
  switch (msg.event) {
    case 'SAMPLE_LOADED':
      return { timestamp: ts, event: 'PROBE GELADEN', message: `${msg.data.sampleId} → Slot ${msg.data.slotNumber}`, type: 'info' };
    case 'WORKLIST_RECEIVED':
      return { timestamp: ts, event: 'WORKLIST', message: `${msg.data.sampleId}: ${msg.data.tests?.join(', ')}`, type: 'info' };
    case 'SAMPLE_PROCESSING':
      return { timestamp: ts, event: 'MESSUNG', message: `${msg.data.sampleId} ${msg.data.progress}%`, type: 'info' };
    case 'SAMPLE_DONE':
      return { timestamp: ts, event: 'DONE', message: `${msg.data.sampleId} – ${msg.data.results?.length} Resultate`, type: 'success' };
    case 'RESULTS_SENT':
      return { timestamp: ts, event: 'GESENDET', message: `${msg.data.sampleId}`, type: 'success' };
    case 'SAMPLE_ERROR':
      return { timestamp: ts, event: 'FEHLER', message: `${msg.data.sampleId}: ${msg.data.errorMessage}`, type: 'error' };
    case 'CONNECTION_CHANGED':
      return {
        timestamp: ts,
        event: 'VERBINDUNG',
        message: msg.data.lisConnected ? 'LIS verbunden' : 'LIS getrennt',
        type: msg.data.lisConnected ? 'success' : 'warning'
      };
    default:
      return null;
  }
};

const CobasE411SimulatorPage: React.FC = () => {
  const [config, setConfig] = useState<AnalyzerConfig | null>(null);
  const [state, setState] = useState<SimulatorState | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [wsStatus, setWsStatus] = useState<'connecting' | 'open' | 'closed'>('connecting');
  const wsRef = React.useRef<WebSocket | null>(null);

  useEffect(() => {
    let ws: WebSocket;
    let retryTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      ws = new WebSocket(WS_URL);
      wsRef.current = ws;
      setWsStatus('connecting');

      ws.onopen = () => setWsStatus('open');

      ws.onmessage = (ev) => {
        const msg = JSON.parse(ev.data);
        if (msg.event === 'ANALYZER_STATE') {
          setConfig(msg.data.config);
          setState(msg.data.state);
        }
        if (msg.event === 'ANALYZER_STATE_UPDATE') {
          setState(msg.data.state);
        }
        const logEntry = eventToLogEntry(msg);
        if (logEntry) {
          setLogs((prev) => [...prev.slice(-MAX_LOG_ENTRIES + 1), logEntry]);
        }
      };

      ws.onclose = () => {
        setWsStatus('closed');
        retryTimeout = setTimeout(connect, 3000);
      };
    };

    connect();
    return () => {
      ws.close();
      clearTimeout(retryTimeout);
    };
  }, []);

  const sendCommand = (command: string, data?: any) => {
    wsRef.current?.send(JSON.stringify({ command, data }));
  };

  if (!config || !state) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        {wsStatus === 'connecting' ? 'Verbinde mit Cobas e 411 Simulator…' : 'Keine Verbindung zum Simulator'}
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-5 max-w-6xl mx-auto">
      {/* Visualizer */}
      <AnalyzerVisualizer config={config} state={state} />

      {/* Control Panel */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => sendCommand('LOAD_RANDOM_SAMPLE')}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Probe einlegen
        </button>
        <button
          onClick={() => sendCommand('START_CALIBRATION')}
          className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Kalibration
        </button>
        <button
          onClick={() => sendCommand('RESET_ANALYZER')}
          className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Reset
        </button>
        <button
          onClick={() => sendCommand('TRIGGER_ERROR')}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Fehler simulieren
        </button>
      </div>

      {/* Log */}
      <div>
        <div className="text-xs text-gray-400 font-medium mb-1.5">Live-Log</div>
        <SimulatorLogPanel entries={logs} />
      </div>
    </div>
  );
};

export default CobasE411SimulatorPage;
```

---

## Schritt 12: CSS-Animation hinzufügen

Füge folgenden Stil zu deiner globalen CSS-Datei hinzu (z. B. `index.css` oder `global.css`):

```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
```

---

## Schritt 13: Routing ergänzen

Registriere die neue Seite in deinem Router (React Router oder ähnlich):

```tsx
<Route path="/analyzer/cobas-e411" element={<CobasE411SimulatorPage />} />
```

---

## Schritt 14: ENV-Variablen

Ergänze in deiner `.env` (Frontend):

```env
VITE_COBAS_SIM_WS_URL=ws://localhost:5001
```

In `docker-compose.yml` für das Frontend:

```yaml
environment:
  - VITE_COBAS_SIM_WS_URL=ws://localhost:5001
```

---

## Vorbereitung für weitere Geräte

Das System soll so aufgebaut sein, dass später ein zweites, drittes Gerät ohne Änderungen im Frontend-Visualizer einfach hinzugefügt werden kann.

### Was nötig ist pro neues Gerät:

1. `analyzer-simulator/src/config/geraet-xyz.config.ts` anlegen
2. `CONFIG_MAP` in `index.ts` erweitern
3. In `docker-compose.yml` zweiten Service anlegen mit eigenem Port
4. In der DB Instrument + Testmappings per Seed anlegen
5. Im Frontend eine neue Seite `/analyzer/geraet-xyz` mit denselben Komponenten

**Der Visualizer selbst muss nicht geändert werden.**

---

## Konkreter Arbeitsauftrag

Bitte führe folgende Schritte aus:

1. Analysiere unser bestehendes Simulator-Projekt und Frontend.
2. Lege alle neuen Dateien wie oben beschrieben an.
3. Baue bestehende Simulator-Klassen so um, dass sie die Config verwenden.
4. Baue bestehende Frontend-Komponenten so um, dass Layout, Farben und Slots aus der Config kommen.
5. Erstelle Seed-SQL für Cobas e 411 und alle Testmappings.
6. Füge die neue Seite dem Router hinzu.

Am Ende bitte ausgeben:

- Welche Dateien neu angelegt wurden
- Welche Dateien geändert wurden
- Welcher Befehl den Simulator startet
- Unter welcher URL die Cobas e 411 Visualisierung aufrufbar ist

---

## Harte Regeln

- Der Visualizer darf keine Gerätedaten hard coden
- Farben, Slot-Anzahl, Racks kommen immer aus `config.visualization`
- Neue Geräte werden per Config ergänzt, nicht per Code-Kopie
- WebSocket soll automatisch reconnecten (3s Delay)
- Simulator-Zustand bleibt im Memory, keine DB-Schreibvorgänge im Simulator
- Alle Delays und Raten müssen über ENV oder Config konfigurierbar sein
