# Claude-Auftrag: Labor-Analyzer-Simulator als Docker Service + Dashboard-Visualisierung

## Kontext

Wir entwickeln ein MLMS (Medical Laboratory Management System) und wollen einen **vollständigen Diagnosemaschinen-Simulator** bauen, der:

- Als eigenständiger Docker-Service läuft
- Über ASTM-Protokoll (TCP/IP) bidirektional mit unserem MLMS kommuniziert
- Aufträge vom MLMS empfangen kann
- Simulierte Messergebnisse an das MLMS zurücksendet
- Im MLMS-Dashboard grafisch visualisiert wird mit Echtzeit-Animationen, blinkenden Statuskreisen, Rack-Visualisierung und Sample-Flow

Ziel ist ein vollständig in sich geschlossenes Entwicklungs- und Testsystem, das ohne echte Hardware betrieben werden kann.

---

## Gesamtarchitektur

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Network                      │
│                                                         │
│  ┌──────────────┐    ASTM/TCP     ┌───────────────────┐ │
│  │   MLMS       │ ◄────────────► │ Analyzer Simulator │ │
│  │  Backend     │   Port 5000     │   Node.js Service  │ │
│  └──────┬───────┘                └───────────┬────────┘ │
│         │ REST/WS                             │ WS       │
│  ┌──────▼───────┐                            │          │
│  │  MLMS        │                            │          │
│  │  Frontend    │◄───────── WebSocket ───────┘          │
│  │  Dashboard   │     (Simulator Events)                │
│  └──────────────┘                                        │
└─────────────────────────────────────────────────────────┘
```

Der Analyzer-Simulator:
- Öffnet einen TCP-Server auf Port 5000 (ASTM)
- Öffnet einen WebSocket-Server auf Port 5001 (für Live-Dashboard)
- Empfängt ASTM-Worklists vom MLMS
- Simuliert Messvorgänge mit konfigurierbarer Dauer
- Sendet ASTM-Resultate zurück
- Broadcastet alle internen Zustände per WebSocket an das Frontend

---

## Komponente 1: Analyzer Simulator Service

### Technologie

- **Runtime**: Node.js
- **Protokoll inbound/outbound**: ASTM E1394 über TCP
- **Live-Events**: WebSocket (ws oder socket.io)
- **Sprache**: TypeScript
- **Config**: Umgebungsvariablen

### Verzeichnisstruktur

```
analyzer-simulator/
├── src/
│   ├── index.ts
│   ├── config.ts
│   ├── astm/
│   │   ├── AstmServer.ts
│   │   ├── AstmParser.ts
│   │   ├── AstmBuilder.ts
│   │   ├── AstmConstants.ts
│   │   └── AstmProtocolHandler.ts
│   ├── simulator/
│   │   ├── AnalyzerSimulator.ts
│   │   ├── RackSimulator.ts
│   │   ├── SampleProcessor.ts
│   │   ├── ResultGenerator.ts
│   │   └── SimulatorState.ts
│   ├── websocket/
│   │   └── SimulatorWebSocketServer.ts
│   └── types/
│       └── index.ts
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## ASTM-Protokoll Grundlagen

### Was ASTM ist

ASTM E1394 ist das Standardprotokoll für Labor-Analyzer-Kommunikation über serielle oder TCP-Verbindungen.

Die Kommunikation ist halbduplex und nachrichtenbasiert.

### ASTM Nachrichtenstruktur

Eine ASTM-Nachricht besteht aus Records:

```
H|\^&|||LIS^1.0|||||||P|LIS2-A2|20260325010000    <- Header Record
P|1||PAT001|||DOE^JOHN||19880612|M                 <- Patient Record
O|1|SMP001|ACC001|^^^GLU\^^^CREA\^^^ALT|R|||||||N  <- Order Record
R|1|^^^GLU|0.91|g/L|0.70^1.10|N||F|||20260325      <- Result Record
L|1|N                                               <- Terminator Record
```

### Steuerzeichen

| Zeichen | Hex | Bedeutung |
|---|---|---|
| STX | 0x02 | Start of Text |
| ETX | 0x03 | End of Text |
| EOT | 0x04 | End of Transmission |
| ENQ | 0x05 | Enquiry |
| ACK | 0x06 | Acknowledge |
| NAK | 0x15 | Not Acknowledge |
| LF | 0x0A | Line Feed |
| CR | 0x0D | Carriage Return |

### Bidirektionaler Ablauf

#### Analyzer sendet Ergebnisse (unidirektional)
```
Analyzer → LIS: ENQ
LIS → Analyzer: ACK
Analyzer → LIS: STX + Frame + ETX + Checksum + CR LF
LIS → Analyzer: ACK
Analyzer → LIS: EOT
```

#### LIS sendet Worklist (bidirektional Query)
```
Analyzer → LIS: ENQ (Barcode-Scan)
LIS → Analyzer: ACK
LIS → Analyzer: H Record + Q Record
Analyzer → LIS: ACK
LIS → Analyzer: EOT
Analyzer → LIS: ENQ (sendet Ergebnisse)
...
```

---

## Implementierung: AstmServer.ts

Implementiere einen TCP-Server, der ASTM-Kommunikation verwaltet.

### Anforderungen

- TCP-Server auf konfiguriertem Port öffnen
- Pro Client-Verbindung einen AstmProtocolHandler erzeugen
- Eingehende Bytes puffern und Frame-weise parsen
- ACK/NAK senden
- ENQ, EOT, Frames korrekt verarbeiten
- Mehrere gleichzeitige Verbindungen unterstützen

### Wichtige Methoden

- `start()`: TCP Server starten
- `stop()`: TCP Server beenden
- `onClientConnected(socket)`: Handler erzeugen
- `sendFrame(socket, frameData)`: Frame senden
- `sendAck(socket)`: ACK senden
- `sendNak(socket)`: NAK senden
- `sendEnq(socket)`: ENQ senden
- `sendEot(socket)`: EOT senden

---

## Implementierung: AstmParser.ts

Parst rohe ASTM-Byte-Ströme in strukturierte Records.

### Anforderungen

- Frame-Extraktion aus Byte-Stream
- Checksum-Validierung
- Record-Typ-Erkennung (H, P, O, R, C, Q, L)
- Felder per `|` und `^` trennen
- Strukturierte JSON-Normalform ausgeben

### Ausgabe-Normalform

```typescript
interface ParsedAstmMessage {
  header: AstmHeader;
  patient?: AstmPatient;
  orders: AstmOrder[];
  results: AstmResult[];
  terminator: AstmTerminator;
}

interface AstmOrder {
  sequenceNumber: string;
  sampleId: string;
  accessionNumber: string;
  tests: string[];
  priority: string;
  specimenCode: string;
  collectedAt: string;
}

interface AstmResult {
  sequenceNumber: string;
  testCode: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag: string;
  resultStatus: string;
  measuredAt: string;
}
```

---

## Implementierung: AstmBuilder.ts

Baut ASTM-Nachrichten aus internen Strukturen.

### Anforderungen

- Alle ASTM-Records korrekt formatieren
- Checksum berechnen
- Frames mit STX/ETX/CR/LF korrekt wrappen
- Sonderzeichen korrekt escapen
- Segmentnummern korrekt vergeben

### Checksum-Algorithmus

```
Checksum = (Summe aller Bytes zwischen STX und ETX einschließlich Frame-Nummer) MOD 256
Ausgabe als 2-stelliger Hex-String
```

---

## Implementierung: SimulatorState.ts

Verwaltet den kompletten internen Zustand des Simulators.

### State-Struktur

```typescript
interface SimulatorState {
  analyzer: AnalyzerState;
  racks: RackState[];
  samples: SampleState[];
  connection: ConnectionState;
  stats: SimulatorStats;
}

interface AnalyzerState {
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

type AnalyzerStatus =
  | 'IDLE'
  | 'READY'
  | 'RUNNING'
  | 'PROCESSING'
  | 'SENDING_RESULTS'
  | 'CALIBRATING'
  | 'ERROR'
  | 'MAINTENANCE'
  | 'OFFLINE';

interface RackState {
  rackId: string;
  position: number;
  slots: SlotState[];
}

interface SlotState {
  slotNumber: number;
  status: SlotStatus;
  sampleId: string | null;
  barcode: string | null;
  tests: string[];
  progress: number; // 0-100
  result: ProcessedResult | null;
}

type SlotStatus =
  | 'EMPTY'
  | 'LOADED'
  | 'SCANNING'
  | 'WAITING'
  | 'PROCESSING'
  | 'DONE'
  | 'ERROR'
  | 'SENDING';

interface ConnectionState {
  lisConnected: boolean;
  lisHost: string | null;
  lisPort: number | null;
  lastMessageAt: string | null;
  messagesSent: number;
  messagesReceived: number;
}
```

---

## Implementierung: ResultGenerator.ts

Generiert realistische simulierte Messwerte.

### Anforderungen

- Pro Testcode einen Normalbereich definieren
- Zufällige Werte innerhalb oder außerhalb des Normalbereichs generieren
- Konfigurierbare Fehlerrate
- Konfigurierbare Abnormal-Rate
- Realistische Einheiten
- Qualitative Tests unterstützen (positiv/negativ)

### Testdatenbank

Implementiere mindestens diese Tests mit realistischen Werten:

| Code | Name | Referenz | Einheit |
|---|---|---|---|
| `GLU` | Glucose | 0.70 - 1.10 | g/L |
| `CREA` | Créatinine | 7.0 - 13.0 | mg/L |
| `UREE` | Urée | 0.15 - 0.45 | g/L |
| `ALT` | ALT/SGPT | 7 - 56 | U/L |
| `AST` | AST/SGOT | 10 - 40 | U/L |
| `TBIL` | Bilirubine totale | 3 - 17 | µmol/L |
| `TP` | Protéines totales | 64 - 83 | g/L |
| `ALB` | Albumine | 35 - 50 | g/L |
| `CHOL` | Cholestérol total | 1.50 - 2.00 | g/L |
| `TG` | Triglycérides | 0.50 - 1.50 | g/L |
| `HDL` | HDL-Cholestérol | 0.40 - 0.60 | g/L |
| `LDL` | LDL-Cholestérol | 0.50 - 1.30 | g/L |
| `HBA1C` | HbA1c | 4.0 - 5.6 | % |
| `TSH` | TSH | 0.27 - 4.20 | mUI/L |
| `FT4` | T4 Libre | 12 - 22 | pmol/L |
| `HGB` | Hémoglobine | 12 - 17 | g/dL |
| `WBC` | Leucocytes | 4.0 - 10.0 | x10³/µL |
| `PLT` | Plaquettes | 150 - 400 | x10³/µL |
| `RBC` | Érythrocytes | 4.2 - 5.4 | x10⁶/µL |
| `CRP` | CRP | 0 - 5 | mg/L |
| `FERR` | Ferritine | 20 - 200 | ng/mL |
| `VIT_D` | Vitamine D | 75 - 150 | nmol/L |

### Simulation-Timing

Konfigurierbare Parameter:

- `processingTimeMin`: Minimale Messzeit pro Sample in ms
- `processingTimeMax`: Maximale Messzeit pro Sample in ms
- `resultSendDelay`: Verzögerung vor Resultat-Senden in ms
- `abnormalRate`: Rate der abnormalen Werte (0.0 - 1.0)
- `errorRate`: Rate der Messfehler (0.0 - 1.0)
- `calibrationInterval`: Kalibrierungsintervall in ms

---

## Implementierung: SampleProcessor.ts

Steuert den Ablauf der Probenverarbeitung im Simulator.

### Ablauf

1. Sample wird in Slot geladen → Status `LOADED`
2. Barcode-Scan → Status `SCANNING`
3. ENQ an LIS → Worklist-Anfrage
4. Wartezeit auf Worklist-Antwort → Status `WAITING`
5. Wenn Worklist empfangen → Status `PROCESSING`
6. Messung simulieren mit Progress 0 → 100
7. Werte generieren → Status `DONE`
8. Ergebnisse per ASTM senden → Status `SENDING`
9. Slot freigeben

### Simulierter Messfortschritt

Progress soll realistisch ansteigen, nicht linear. Beispiel:
- 0-20%: Probenaufnahme langsam
- 20-70%: Messung schnell
- 70-100%: Kalibrierung/Auswertung mittel

---

## Komponente 2: Docker Integration

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/

EXPOSE 5000
EXPOSE 5001

ENV NODE_ENV=production
ENV ASTM_PORT=5000
ENV WS_PORT=5001
ENV ANALYZER_ID=SIM_CHEM_01
ENV ANALYZER_NAME=SimAnalyzer Pro
ENV ANALYZER_MODEL=SAP-2000
ENV PROCESSING_TIME_MIN=3000
ENV PROCESSING_TIME_MAX=8000
ENV ABNORMAL_RATE=0.15
ENV ERROR_RATE=0.02

CMD ["node", "dist/index.js"]
```

### docker-compose.yml Erweiterung

Ergänze unsere bestehende docker-compose.yml um diesen Service:

```yaml
  analyzer-simulator:
    build:
      context: ./analyzer-simulator
      dockerfile: Dockerfile
    container_name: mlms_analyzer_simulator
    ports:
      - "5000:5000"    # ASTM TCP Port
      - "5001:5001"    # WebSocket Port für Dashboard
    environment:
      - ASTM_PORT=5000
      - WS_PORT=5001
      - ANALYZER_ID=SIM_CHEM_01
      - ANALYZER_NAME=SimAnalyzer Pro 2000
      - ANALYZER_MODEL=SAP-2000
      - RACK_COUNT=3
      - SLOTS_PER_RACK=10
      - PROCESSING_TIME_MIN=4000
      - PROCESSING_TIME_MAX=10000
      - ABNORMAL_RATE=0.15
      - ERROR_RATE=0.02
      - RESULT_SEND_DELAY=1000
      - CALIBRATION_INTERVAL=300000
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

Stelle sicher, dass der MLMS-Backend-Service das analyzer-simulator-Netzwerk kennt und auf Port 5000 zugreifen kann.

---

## Komponente 3: WebSocket-Events

### Event-Typen vom Simulator an das Dashboard

Alle Events werden per WebSocket als JSON gesendet.

#### `ANALYZER_STATE`
Vollständiger Systemzustand wird initial und bei großen Änderungen gesendet.

```json
{
  "event": "ANALYZER_STATE",
  "data": {
    "analyzer": { ... },
    "racks": [ ... ],
    "connection": { ... },
    "stats": { ... }
  }
}
```

#### `ANALYZER_STATUS_CHANGED`
```json
{
  "event": "ANALYZER_STATUS_CHANGED",
  "data": {
    "status": "PROCESSING",
    "previousStatus": "READY",
    "timestamp": "2026-03-25T01:00:00Z"
  }
}
```

#### `SAMPLE_LOADED`
```json
{
  "event": "SAMPLE_LOADED",
  "data": {
    "rackId": "RACK_01",
    "slotNumber": 3,
    "sampleId": "SMP-2026-000123",
    "barcode": "123456789012",
    "tests": ["GLU", "CREA", "ALT"]
  }
}
```

#### `SAMPLE_SCANNING`
```json
{
  "event": "SAMPLE_SCANNING",
  "data": {
    "rackId": "RACK_01",
    "slotNumber": 3,
    "barcode": "123456789012"
  }
}
```

#### `WORKLIST_REQUESTED`
```json
{
  "event": "WORKLIST_REQUESTED",
  "data": {
    "rackId": "RACK_01",
    "slotNumber": 3,
    "sampleId": "SMP-2026-000123"
  }
}
```

#### `WORKLIST_RECEIVED`
```json
{
  "event": "WORKLIST_RECEIVED",
  "data": {
    "sampleId": "SMP-2026-000123",
    "tests": ["GLU", "CREA", "ALT"],
    "priority": "ROUTINE"
  }
}
```

#### `SAMPLE_PROCESSING`
```json
{
  "event": "SAMPLE_PROCESSING",
  "data": {
    "rackId": "RACK_01",
    "slotNumber": 3,
    "sampleId": "SMP-2026-000123",
    "progress": 42,
    "currentTest": "GLU"
  }
}
```

#### `SAMPLE_DONE`
```json
{
  "event": "SAMPLE_DONE",
  "data": {
    "rackId": "RACK_01",
    "slotNumber": 3,
    "sampleId": "SMP-2026-000123",
    "results": [
      { "testCode": "GLU", "value": "0.91", "unit": "g/L", "flag": "NORMAL" },
      { "testCode": "CREA", "value": "15.2", "unit": "mg/L", "flag": "HIGH" }
    ]
  }
}
```

#### `RESULTS_SENT`
```json
{
  "event": "RESULTS_SENT",
  "data": {
    "sampleId": "SMP-2026-000123",
    "resultCount": 3,
    "sentAt": "2026-03-25T01:05:22Z"
  }
}
```

#### `SAMPLE_ERROR`
```json
{
  "event": "SAMPLE_ERROR",
  "data": {
    "rackId": "RACK_01",
    "slotNumber": 3,
    "sampleId": "SMP-2026-000123",
    "errorCode": "CLOT_DETECTED",
    "errorMessage": "Sample clot detected"
  }
}
```

#### `CONNECTION_CHANGED`
```json
{
  "event": "CONNECTION_CHANGED",
  "data": {
    "lisConnected": true,
    "clientAddress": "172.20.0.3",
    "timestamp": "2026-03-25T01:00:00Z"
  }
}
```

#### `CALIBRATION_STARTED` / `CALIBRATION_DONE`
```json
{
  "event": "CALIBRATION_STARTED",
  "data": {
    "startedAt": "2026-03-25T01:10:00Z",
    "estimatedDuration": 30000
  }
}
```

#### `RAW_ASTM_SENT` / `RAW_ASTM_RECEIVED`
```json
{
  "event": "RAW_ASTM_SENT",
  "data": {
    "raw": "H|\\^&|||SIM^1.0...",
    "timestamp": "2026-03-25T01:05:20Z"
  }
}
```

### Commands vom Dashboard an den Simulator

Das Dashboard soll auch Commands an den Simulator senden können.

#### `LOAD_SAMPLE`
Simuliert das manuelle Einlegen einer Probe.

```json
{
  "command": "LOAD_SAMPLE",
  "data": {
    "rackId": "RACK_01",
    "slotNumber": 3,
    "sampleId": "SMP-2026-000123",
    "barcode": "123456789012",
    "tests": ["GLU", "CREA"]
  }
}
```

#### `EJECT_SAMPLE`
Probe aus Slot entfernen.

```json
{
  "command": "EJECT_SAMPLE",
  "data": { "rackId": "RACK_01", "slotNumber": 3 }
}
```

#### `START_CALIBRATION`
Kalibration auslösen.

#### `RESET_ANALYZER`
Analyzer-Zustand zurücksetzen.

#### `SET_ERROR_MODE`
Fehlerrate erhöhen für Tests.

#### `SET_PROCESSING_SPEED`
Verarbeitungsgeschwindigkeit anpassen.

```json
{
  "command": "SET_PROCESSING_SPEED",
  "data": { "speedMultiplier": 3 }
}
```

---

## Komponente 4: Frontend-Visualisierung

### Technologie

- **Framework**: React oder Vue (bestehende MLMS-Architektur)
- **Grafik**: SVG (für scharfe Skalierung) oder Canvas
- **WebSocket-Client**: native WebSocket API oder socket.io-client
- **Animationen**: CSS transitions + requestAnimationFrame
- **State**: lokaler Component-State oder Pinia/Zustand

### Dashboard-Seite: `/analyzer-simulator`

Implementiere eine dedizierte Seite im MLMS-Frontend für die Analyzer-Visualisierung.

---

### 4.1 Analyzer-Header-Panel

Zeige oben einen Statusheader:

```
╔══════════════════════════════════════════════════════════════╗
║  ● SimAnalyzer Pro 2000  [SAP-2000]          ● LIS Connected ║
║  Status: PROCESSING          Processed: 42    Errors: 1      ║
╚══════════════════════════════════════════════════════════════╝
```

Implementierungsdetails:

- Großer Statuskreis links, Farbe nach `AnalyzerStatus`
- Blinkt bei PROCESSING, ERROR
- Pulsiert bei CALIBRATING
- Durchgehend grün bei READY / IDLE
- LIS-Verbindungsindikator rechts oben blinkt bei aktiver Kommunikation

### Statusfarben

| Status | Farbe | Animation |
|---|---|---|
| `IDLE` | Grau | Keine |
| `READY` | Grün | Keine |
| `RUNNING` | Blau | Langsames Pulsieren |
| `PROCESSING` | Orange | Schnelles Blinken |
| `SENDING_RESULTS` | Cyan | Schnelles Blinken |
| `CALIBRATING` | Lila | Langsames Pulsieren |
| `ERROR` | Rot | Schnelles Blinken |
| `MAINTENANCE` | Gelb | Langsames Pulsieren |
| `OFFLINE` | Dunkelgrau | Keine |

---

### 4.2 Rack-Visualisierung (SVG)

Das Herzstück der Visualisierung. Implementiere eine SVG-basierte Rack-Darstellung.

#### Rack-Layout

Jedes Rack ist ein horizontaler Streifen mit N Slots.
Jeder Slot ist ein Kreis oder Röhrchen-Symbol.

```
RACK 01
┌────────────────────────────────────────────────┐
│ [●] [●] [○] [⚡] [▶] [▶] [✓] [✓] [○] [○]   │
│  1   2   3   4   5   6   7   8   9   10         │
│ GLU CREA    SCN  ■■■■▓▓▓░░░                     │
└────────────────────────────────────────────────┘

RACK 02
┌────────────────────────────────────────────────┐
│ [✓] [✓] [✓] [○] [○] [○] [○] [○] [○] [○]   │
└────────────────────────────────────────────────┘
```

#### Slot-Symbol nach Status

| Status | Symbol | Farbe | Animation |
|---|---|---|---|
| `EMPTY` | Leerer Kreis | Hellgrau | Keine |
| `LOADED` | Gefüllter Kreis | Grau | Keine |
| `SCANNING` | Kreis mit Scan-Icon | Gelb | Rotation |
| `WAITING` | Kreis mit Uhr | Gelb | Langsames Blinken |
| `PROCESSING` | Kreis mit Fortschrittsring | Orange | Drehendes Segment |
| `DONE` | Kreis mit Häkchen | Grün | Kurzes Aufleuchten |
| `ERROR` | Kreis mit X | Rot | Schnelles Blinken |
| `SENDING` | Kreis mit Pfeil | Cyan | Pfeil-Animation |

#### SVG-Slot-Komponente

Implementiere pro Slot eine SVG-Gruppe mit:
- Äußerer Ring (Fortschrittsanzeige bei Processing)
- Innerer Kreis (Statusfarbe)
- Icon-Overlay (je nach Status)
- Tooltip mit Sample-ID, Tests, aktueller Status
- Click-Handler für Details

#### Progressring-Animation

Bei Status `PROCESSING` soll der äußere Ring als Fortschrittsring animiert werden.

Nutze SVG `stroke-dasharray` und `stroke-dashoffset` für die Fortschrittsanimation.

Der Ring soll von 0 auf progress (0-100) über die Messzeit ansteigen.

```svg
<circle
  cx="24" cy="24" r="20"
  fill="none"
  stroke="#f97316"
  stroke-width="3"
  stroke-dasharray="125.6"
  stroke-dashoffset={125.6 * (1 - progress / 100)}
  transform="rotate(-90 24 24)"
/>
```

---

### 4.3 Sample-Flow-Visualisierung

Zeige einen animierten Datenpfeil vom MLMS zum Analyzer und zurück.

#### Outbound-Animation (MLMS → Analyzer)
Wenn ein Auftrag gesendet wird:
- Kleines Paket-Icon wandert von links nach rechts
- Farbe: Blau
- Dauer: 1s

#### Inbound-Animation (Analyzer → MLMS)
Wenn Ergebnisse gesendet werden:
- Kleines Ergebnis-Icon wandert von rechts nach links
- Farbe: Grün
- Dauer: 1s

Implementiere das mit CSS `@keyframes` und `translateX`.

---

### 4.4 Echtzeit-Log-Panel

Zeige unten ein scrollendes Log aller Simulator-Events.

```
[01:05:22] ► WORKLIST RECEIVED   SMP-2026-000123   Tests: GLU, CREA, ALT
[01:05:23] ► PROCESSING STARTED  RACK_01 Slot 3    Progress: 0%
[01:05:25] ► PROCESSING          RACK_01 Slot 3    Progress: 35%
[01:05:28] ► PROCESSING DONE     RACK_01 Slot 3    3 results
[01:05:29] ► RESULTS SENT        SMP-2026-000123   ACK received
```

Implementierungsdetails:
- Maximal 100 Einträge
- Automatisch nach unten scrollen
- Farb-Coding nach Event-Typ
- Zeitstempel links
- Filterbar nach Event-Typ

---

### 4.5 Statistik-Panel

Zeige rechts oder unten Echtzeit-Statistiken:

- Heute verarbeitete Samples
- Durchschnittliche Verarbeitungszeit
- Fehlerrate
- Abnormal-Rate
- Gesendete ASTM-Nachrichten
- Empfangene ASTM-Nachrichten
- LIS-Verbindungsstatus + Uptime

---

### 4.6 Steuer-Panel (Control)

Implementiere Buttons für manuelle Steuerung:

- **Load Random Sample**: Lädt eine zufällige Testprobe in einen freien Slot
- **Load Sample from Order**: Öffnet Dialog mit Sample-ID eingeben
- **Start Calibration**: Kalibration simulieren
- **Reset Analyzer**: Zurücksetzen
- **Set Speed**: Schieberegler für Verarbeitungsgeschwindigkeit (0.5x bis 10x)
- **Trigger Error**: Fehler für einen Slot simulieren
- **Clear All Slots**: Alle Slots leeren

---

### 4.7 ASTM-Raw-Monitor

Zeige optional einen Tab mit dem rohen ASTM-Datenstrom.

- Eingehende Nachrichten in einer Farbe
- Ausgehende Nachrichten in anderer Farbe
- Steuerzeichen sichtbar machen (ENQ, ACK, STX, EOT)
- Hex-Ansicht optional

---

## Komponente 5: MLMS-Backend-Anbindung

### Konfiguration

Der MLMS-Backend muss wissen, wie er den Simulator erreicht.

Ergänze die Instrument-Konfiguration in der Datenbank:

```json
{
  "code": "SIM_CHEM_01",
  "name": "SimAnalyzer Pro 2000",
  "manufacturer": "Simulator",
  "model": "SAP-2000",
  "protocolType": "ASTM",
  "transportType": "TCP",
  "directionMode": "BIDIRECTIONAL",
  "connection": {
    "host": "analyzer-simulator",
    "port": 5000,
    "encoding": "ASCII",
    "timeoutMs": 10000,
    "retryLimit": 3,
    "ackEnabled": true
  }
}
```

Hinweis: Im Docker-Netzwerk ist der Hostname `analyzer-simulator` der Container-Name.

### Seed / Setup-Script

Erstelle ein Seed-Script, das:
- Den Simulator-Analyzer in der `instruments`-Tabelle anlegt
- Die Connection-Konfiguration anlegt
- Default-Testmappings für alle 22 simulierten Tests anlegt
- Einen Healthcheck-Endpoint aufruft um zu prüfen ob der Simulator läuft

---

## Implementierungsreihenfolge

Arbeite in genau dieser Reihenfolge:

1. **Analyzer Simulator Service** aufbauen
   - Node.js/TypeScript Projektstruktur
   - ASTM TCP Server implementieren
   - ASTM Parser implementieren
   - ASTM Builder implementieren
   - SimulatorState implementieren
   - ResultGenerator mit Testdatenbank implementieren
   - SampleProcessor mit Ablaufsteuerung implementieren
   - WebSocket Event Server implementieren

2. **Dockerfile** für den Simulator erstellen

3. **docker-compose.yml** um den Simulator-Service erweitern

4. **MLMS-Backend** konfigurieren
   - Instrument-Eintrag für den Simulator anlegen
   - Testmappings anlegen
   - TCP-Verbindung zum Simulator testen

5. **Frontend Dashboard** implementieren
   - WebSocket-Client für Simulator-Events
   - Analyzer-Header-Panel
   - Rack-SVG-Visualisierung mit animierten Slots
   - Sample-Flow-Animationen
   - Echtzeit-Log-Panel
   - Statistik-Panel
   - Steuer-Panel
   - Optional: ASTM Raw Monitor

6. **Integration testen**
   - Auftrag im MLMS erstellen
   - Auftrag an Simulator senden
   - Verarbeitung im Dashboard beobachten
   - Resultate im MLMS empfangen

---

## Konkreter Arbeitsauftrag

Bitte führe folgende Schritte aus:

1. Analysiere unsere bestehende Projektstruktur (Backend, Frontend, Docker Compose).

2. Erstelle den kompletten Analyzer Simulator Service als neues Verzeichnis `analyzer-simulator/`.

3. Erweitere die `docker-compose.yml` um den neuen Service.

4. Erstelle ein Seed-Script für den Simulator-Analyzer in der Datenbank.

5. Implementiere die Dashboard-Seite im MLMS-Frontend mit vollständiger SVG-Rack-Visualisierung, Animationen, Log-Panel und Control-Panel.

6. Zeige am Ende:
   - Wie der Simulator gestartet wird
   - Wie ein Testauftrag gesendet wird
   - Wie die Visualisierung im Dashboard aussieht
   - Welche Ports und Services geöffnet sind

---

## Harte Regeln

- Der Simulator darf keine echten Patientendaten speichern
- Der Simulator soll als `dev` und `test` Service markiert sein
- Keine produktiven Konfigurationen für den Simulator
- WebSocket-Verbindung soll automatisch reconnecten
- Simulator-State soll im Memory gehalten werden (kein DB-Schreiben nötig)
- Alle Delays und Raten müssen über Umgebungsvariablen konfigurierbar sein
- Die Dashboard-Visualisierung darf die MLMS-Performance nicht beeinflussen

---

## Erwartetes Endergebnis

Nach der Implementierung soll folgendes möglich sein:

1. `docker-compose up` startet alle Services inklusive Analyzer Simulator
2. Im MLMS-Dashboard gibt es eine Seite `/analyzer-simulator`
3. Auf dieser Seite sieht man eine realistische Analyzer-Visualisierung mit Racks, blinkenden Slots, Fortschrittsringen und Datenstrom-Animationen
4. Im MLMS kann ein Auftrag für eine Probe erstellt und an den Simulator gesendet werden
5. Im Dashboard sieht man in Echtzeit wie die Probe eingelegt wird, gescannt wird, verarbeitet wird und das Ergebnis zurückgesendet wird
6. Die Ergebnisse landen korrekt im MLMS Instrument Inbox und werden als Raw Results importiert
