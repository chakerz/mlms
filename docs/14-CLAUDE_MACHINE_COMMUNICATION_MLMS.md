# Claude-Auftrag: Machine Communication Architecture für unser MLMS

## Kontext

Wir entwickeln ein MLMS (Medical Laboratory Management System) und wollen die Kommunikation mit Diagnosemaschinen und Laborgeräten sauber, erweiterbar und produktionsfähig implementieren.

Die Lösung soll so aufgebaut werden, dass unser MLMS mit unterschiedlichen Maschinen kommunizieren kann, ohne dass die Business-Logik jedes Moduls direkt an einen bestimmten Hersteller gekoppelt ist.

Ziel ist eine robuste Integrationsschicht zwischen unserem MLMS und Laborgeräten.

---

## Ziel

Implementiere in unserem MLMS eine vollständige Maschinenkommunikation mit folgenden Eigenschaften:

- Unterstützung für uni- und bidirektionale Kommunikation
- Unterstützung für mehrere Gerätetypen und Hersteller
- Saubere Trennung zwischen Business-Logik und Maschinenprotokollen
- Speicherung von Rohnachrichten und Rohresultaten
- Nachvollziehbarkeit über Audit-Trails
- Mapping zwischen internen Testcodes und maschinenspezifischen Testcodes
- Retry-Mechanismen für technische Fehler
- Keine automatische finale Validierung von Maschinenresultaten ohne Review
- Gute Erweiterbarkeit für weitere Analyzer in Zukunft

---

## Architekturprinzip

Die Kommunikation darf **nicht direkt** innerhalb der normalen fachlichen Analyse-Services implementiert werden.

Stattdessen soll eine eigene Integrationsschicht entstehen:

```
MLMS -> Instrument Interface Layer -> Diagnosemaschine
```

Diese Integrationsschicht ist verantwortlich für:

- Aufträge an Geräte senden
- Nachrichtenformate erzeugen
- Nachrichten transportieren
- Antworten empfangen
- Rohpayloads speichern
- Resultate parsen
- Resultate mit Samples und Orders matchen
- Fehler behandeln
- Audit-Logs schreiben

---

## Unterstützte Kommunikationsarten

### 1. Unidirektional

Die Maschine sendet nur Resultate an das MLMS zurück.

Beispiel:
- Auftrag wird manuell am Gerät eingegeben
- Maschine sendet am Ende Ergebnisse an das MLMS

### 2. Bidirektional

Das MLMS sendet Aufträge bzw. Worklists an die Maschine und erhält danach Resultate zurück.

Beispiel:
- Auftrag wird im MLMS erstellt
- Probe erhält Barcode
- MLMS sendet Worklist an Analyzer
- Analyzer misst
- Analyzer sendet Resultate zurück

### 3. Datei-basierte Integration

Einige Geräte kommunizieren nicht per Socket oder serieller Live-Verbindung, sondern über Dateien.

Beispiel:
- Export von Aufträgen in TXT/CSV
- Import von Resultaten aus TXT/CSV/XLS

---

## Unterstützte Protokolltypen

Die Lösung soll protokollunabhängig modelliert werden.

Protokolltypen:

- `HL7`
- `ASTM`
- `VENDOR_CUSTOM`
- `FILE_IMPORT`
- `FILE_EXPORT`

Transporttypen:

- `TCP`
- `SERIAL`
- `FILE_SYSTEM`

---

## Fachliches Kommunikationsmodell

Die Logik soll specimen-centric sein, also probezentriert.

Die zentrale fachliche Reihenfolge ist:

1. Auftrag wird erstellt
2. Probe wird registriert
3. Probe wird barcodiert
4. Probe wird einem Gerät oder Arbeitsbereich zugeordnet
5. Auftrag wird an Maschine gesendet oder auf Worklist bereitgestellt
6. Maschine verarbeitet Probe
7. Maschine sendet Resultate zurück
8. MLMS speichert Rohdaten
9. MLMS mappt Resultate auf interne Tests
10. Resultate gehen in technische Prüfung
11. Erst danach folgt fachliche / biologische Validierung

---

## Welche Daten vom MLMS an die Maschine gehen

### Pflichtfelder outbound

- `sample_id`
- `accession_number`
- `barcode`
- `order_id`
- `patient_id`
- `patient_name` optional
- `patient_sex` optional
- `patient_birth_date` optional
- `sample_type`
- `specimen_code`
- `priority`
- `tests` (Liste)
- `instrument_test_codes`
- `rack_id` optional
- `rack_position` optional
- `collected_at` optional
- `received_at` optional
- `clinical_note` optional

### Beschreibung der ausgehenden Felder

#### Sample-/Order-Bezug
- `sample_id`: interne eindeutige Kennung der Probe
- `accession_number`: externe / laborinterne Auftragsnummer
- `barcode`: maschinenlesbare Kennung für Tube oder Probe
- `order_id`: interner Auftrag

#### Patientenkontext
- `patient_id`
- Name optional
- Geschlecht optional
- Geburtsdatum optional

Hinweis: Nicht jedes Gerät braucht Patientendaten. Manche Geräte arbeiten nur mit Sample-ID und Testliste.

#### Specimen-Kontext
- `sample_type`: z. B. Serum, Plasma, EDTA, Urin
- `specimen_code`: gerätespezifischer Code
- `priority`: Routine / STAT / Urgent

#### Testauftrag
- Liste der angeforderten Analysen
- Pro Analyse ein internes Kürzel und ein gerätespezifischer Code
- Optional Panels oder Profile

#### Routing
- Rack
- Position
- Slot
- Gerätelinie
- Laufkanal

---

## Welche Daten von der Maschine zurückkommen

### Pflichtfelder inbound

- `instrument_id`
- `message_id`
- `sample_id`
- `barcode`
- `order_id` optional
- `instrument_test_code`
- `internal_test_code` nach Mapping
- `result_value`
- `result_text`
- `unit`
- `flag_code`
- `result_status`
- `device_status`
- `measured_at`
- `received_at`
- `run_id` optional
- `qc_status` optional
- `calibration_status` optional
- `raw_payload`
- `parsed_payload_json`

### Typische eingehende Inhalte

Die Maschine kann u.a. senden:

- Numerische Resultate
- Qualitative Resultate
- Geräteseitige Flags
- Fehlercodes
- Status des Laufs
- Hinweise auf Wiederholung / Rerun
- Hinweise auf Verdünnung
- Hinweise auf QC oder Kalibration
- Zeitstempel
- Gerätekennung

---

## Fachliche Trennung der Ergebnistypen

Das MLMS muss Ergebnisse in **klar getrennten Ebenen** speichern.

### Ebene 1 — Raw Instrument Result

Das Ergebnis direkt vom Gerät. Speichere hier unverändert:

- Originalwert
- Originaleinheit
- Originalflag
- Original-Testcode des Geräts
- Originalnachricht
- Messzeit
- Geräte-ID
- Lauf-ID
- Technischer Status

### Ebene 2 — Mapped Internal Result

Das Ergebnis nach Zuordnung zum internen Testkatalog. Speichere hier:

- Interner Testcode
- Gemappter Wert
- Optionale Einheiten-Normalisierung
- Verknüpfung zur Probe
- Verknüpfung zum Auftrag
- Verknüpfung zum Rohresultat

### Ebene 3 — Technical Review Result

Das Ergebnis nach technischer Prüfung. Beispiele für technische Prüfung:

- Ergebnis plausibel importiert
- Testcode korrekt gemappt
- Probe korrekt gematcht
- Gerät aktiv und gültig
- Keine offensichtliche Dublette
- Kein Parserfehler

### Ebene 4 — Validated Laboratory Result

Das fachlich freigegebene Laborresultat.

**Wichtig:**
- Ein Maschinenresultat darf **niemals automatisch** direkt als finales validiertes Ergebnis gelten.
- Es braucht mindestens technische Prüfung und je nach Workflow fachliche Freigabe.

---

## JSON-Beispiele

### Outbound an Maschine

```json
{
  "instrumentId": "inst_chem_01",
  "sampleId": "SMP-2026-000123",
  "accessionNumber": "ACC-2026-000123",
  "orderId": "ORD-2026-004567",
  "barcode": "123456789012",
  "patient": {
    "id": "PAT-001245",
    "name": "DOE JOHN",
    "sex": "M",
    "birthDate": "1988-06-12"
  },
  "specimen": {
    "type": "SERUM",
    "specimenCode": "SER",
    "priority": "ROUTINE",
    "collectedAt": "2026-03-25T00:35:00Z",
    "receivedAt": "2026-03-25T00:41:00Z"
  },
  "tests": [
    { "internalCode": "GLU", "instrumentCode": "GLU" },
    { "internalCode": "CREA", "instrumentCode": "CREA" },
    { "internalCode": "ALT", "instrumentCode": "ALT" }
  ],
  "routing": {
    "rack": "R12",
    "position": "05"
  }
}
```

### Inbound von Maschine

```json
{
  "instrumentId": "inst_chem_01",
  "messageId": "MSG-00099881",
  "sampleId": "SMP-2026-000123",
  "barcode": "123456789012",
  "receivedAt": "2026-03-25T00:52:11Z",
  "results": [
    {
      "instrumentTestCode": "GLU",
      "internalTestCode": "GLU",
      "value": "0.91",
      "unit": "g/L",
      "flag": "NORMAL",
      "resultStatus": "COMPLETED",
      "measuredAt": "2026-03-25T00:50:02Z"
    },
    {
      "instrumentTestCode": "CREA",
      "internalTestCode": "CREA",
      "value": "9.8",
      "unit": "mg/L",
      "flag": "NORMAL",
      "resultStatus": "COMPLETED",
      "measuredAt": "2026-03-25T00:50:20Z"
    }
  ],
  "deviceStatus": {
    "status": "COMPLETED",
    "runId": "RUN-CH-00045"
  }
}
```

### Interne Parser-Normalform

```json
{
  "instrumentId": "inst_chem_01",
  "messageId": "MSG-00099881",
  "messageType": "RESULT",
  "sampleId": "SMP-2026-000123",
  "barcode": "123456789012",
  "orderId": "ORD-2026-004567",
  "receivedAt": "2026-03-25T00:52:11Z",
  "results": [
    {
      "instrumentTestCode": "GLU",
      "value": "0.91",
      "resultText": null,
      "unit": "g/L",
      "flagCode": "NORMAL",
      "resultStatus": "COMPLETED",
      "measuredAt": "2026-03-25T00:50:02Z"
    }
  ],
  "deviceStatus": {
    "status": "COMPLETED",
    "runId": "RUN-CH-00045",
    "qcStatus": null,
    "calibrationStatus": null
  },
  "rawPayloadRef": "inbox_message_123"
}
```

---

## Zielmodule

- `instrument-definitions`
- `instrument-connections`
- `instrument-test-mappings`
- `instrument-order-outbox`
- `instrument-result-inbox`
- `instrument-raw-results`
- `instrument-message-builder`
- `instrument-message-parser`
- `instrument-transport`
- `instrument-result-importer`
- `instrument-audit-log`
- `instrument-error-handler`
- `instrument-retry-manager`

---

## Verantwortlichkeiten der Module

### Instrument Definitions
Verwaltet die Stammdaten eines Geräts: Name, Hersteller, Modell, Code, Standort, aktiv/inaktiv, Protokolltyp, Transporttyp, Kommunikationsmodus.

### Instrument Connections
Verwaltet technische Verbindungsdaten: Host, Port, Serial Port, Baudrate, Parity, Stop Bits, Encoding, Timeout, File Import Path, File Export Path, ACK aktiviert, Retry Limit.

### Instrument Test Mappings
Mappt interne Testcodes auf maschinenspezifische Codes.

### Instrument Order Outbox
Speichert alle ausgehenden Aufträge an Geräte.

### Instrument Result Inbox
Speichert alle eingehenden Nachrichten von Geräten.

### Instrument Raw Results
Speichert einzelne Rohresultate nach Parsing.

### Instrument Message Builder
Erzeugt pro Protokoll das richtige Nachrichtenformat.

### Instrument Message Parser
Parst eingehende Rohpayloads in eine interne Normalform.

### Instrument Transport
Sendet und empfängt Daten über TCP, Serial oder Filesystem.

### Instrument Result Importer
Überführt geparste Rohdaten in interne Ergebnisstrukturen.

### Instrument Audit Log
Erfasst jeden technischen Kommunikationsschritt.

### Instrument Error Handler
Verarbeitet Fehlerfälle systematisch.

### Instrument Retry Manager
Steuert automatische Wiederholungen bei technischen Fehlern.

---

## Datenbankschema

### Tabelle `instruments`

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | UUID | Primary Key |
| `code` | VARCHAR | Eindeutiger Code |
| `name` | VARCHAR | Anzeigename |
| `manufacturer` | VARCHAR | Hersteller |
| `model` | VARCHAR | Modell |
| `protocol_type` | ENUM | HL7, ASTM, VENDOR_CUSTOM, FILE_IMPORT, FILE_EXPORT |
| `transport_type` | ENUM | TCP, SERIAL, FILE_SYSTEM |
| `direction_mode` | ENUM | UNIDIRECTIONAL, BIDIRECTIONAL |
| `is_active` | BOOLEAN | Aktiv/Inaktiv |
| `location` | VARCHAR | Standort |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMP | Letzte Änderung |

### Tabelle `instrument_connections`

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | UUID | Primary Key |
| `instrument_id` | UUID | FK zu instruments |
| `host` | VARCHAR | IP oder Hostname |
| `port` | INTEGER | TCP Port |
| `serial_port` | VARCHAR | COM Port |
| `baud_rate` | INTEGER | Baudrate |
| `parity` | VARCHAR | Parity |
| `data_bits` | INTEGER | Data Bits |
| `stop_bits` | INTEGER | Stop Bits |
| `file_import_path` | TEXT | Pfad Import |
| `file_export_path` | TEXT | Pfad Export |
| `ack_enabled` | BOOLEAN | ACK aktiviert |
| `encoding` | VARCHAR | Zeichensatz |
| `timeout_ms` | INTEGER | Timeout in ms |
| `retry_limit` | INTEGER | Max Retries |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMP | Letzte Änderung |

### Tabelle `instrument_test_mappings`

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | UUID | Primary Key |
| `instrument_id` | UUID | FK zu instruments |
| `internal_test_code` | VARCHAR | Interner Testcode im MLMS |
| `instrument_test_code` | VARCHAR | Testcode des Geräts |
| `sample_type` | VARCHAR | Probentyp |
| `specimen_code` | VARCHAR | Gerätespezifischer Specimen Code |
| `unit` | VARCHAR | Einheit optional |
| `is_active` | BOOLEAN | Aktiv/Inaktiv |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMP | Letzte Änderung |

### Tabelle `instrument_order_outbox`

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | UUID | Primary Key |
| `instrument_id` | UUID | FK zu instruments |
| `sample_id` | UUID | FK zu Probe |
| `order_id` | UUID | FK zu Auftrag |
| `message_type` | VARCHAR | Nachrichtentyp |
| `payload_json` | JSONB | Interne Normalform |
| `raw_payload` | TEXT | Nachricht im Zielprotokoll |
| `status` | ENUM | Outbox Status |
| `retry_count` | INTEGER | Anzahl Versuche |
| `sent_at` | TIMESTAMP | Sendezeitpunkt |
| `ack_received_at` | TIMESTAMP | ACK Eingang |
| `error_message` | TEXT | Fehlermeldung |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMP | Letzte Änderung |

### Tabelle `instrument_result_inbox`

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | UUID | Primary Key |
| `instrument_id` | UUID | FK zu instruments |
| `message_type` | VARCHAR | Nachrichtentyp |
| `raw_payload` | TEXT | Originalnachricht |
| `parsed_payload_json` | JSONB | Geparste interne Normalform |
| `sample_id` | VARCHAR | Sample-ID extrahiert |
| `barcode` | VARCHAR | Barcode extrahiert |
| `matching_status` | ENUM | Matching Status |
| `import_status` | ENUM | Import Status |
| `received_at` | TIMESTAMP | Empfangszeitpunkt |
| `processed_at` | TIMESTAMP | Verarbeitungszeitpunkt |
| `error_message` | TEXT | Fehlermeldung |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMP | Letzte Änderung |

### Tabelle `instrument_raw_results`

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | UUID | Primary Key |
| `instrument_id` | UUID | FK zu instruments |
| `sample_id` | UUID | FK zu Probe |
| `order_id` | UUID | FK zu Auftrag |
| `internal_test_code` | VARCHAR | Interner Testcode nach Mapping |
| `instrument_test_code` | VARCHAR | Testcode des Geräts Original |
| `result_value` | VARCHAR | Messwert |
| `result_text` | TEXT | Qualitativer Text |
| `unit` | VARCHAR | Einheit |
| `flag_code` | VARCHAR | Flag vom Gerät |
| `device_status` | VARCHAR | Gerätestatus |
| `result_status` | ENUM | Raw Result Status |
| `measured_at` | TIMESTAMP | Messzeit |
| `imported_at` | TIMESTAMP | Importzeitpunkt |
| `raw_message_id` | UUID | FK zu instrument_result_inbox |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMP | Letzte Änderung |

### Tabelle `instrument_message_audit`

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | UUID | Primary Key |
| `instrument_id` | UUID | FK zu instruments |
| `direction` | ENUM | OUTBOUND / INBOUND |
| `message_type` | VARCHAR | Nachrichtentyp |
| `transport_type` | VARCHAR | Transporttyp |
| `status` | VARCHAR | Technischer Status |
| `reference_id` | UUID | Referenz auf Outbox oder Inbox |
| `details_json` | JSONB | Zusatzinformationen |
| `created_at` | TIMESTAMP | Zeitpunkt |

---

## Statusmodelle

### Outbox Status

| Status | Bedeutung |
|---|---|
| `PENDING` | Warte auf Verarbeitung |
| `READY_TO_SEND` | Bereit zum Senden |
| `SENT` | Gesendet |
| `ACK_RECEIVED` | Empfang bestätigt |
| `FAILED` | Fehlgeschlagen |
| `RETRY_SCHEDULED` | Retry geplant |
| `CANCELLED` | Abgebrochen |

### Inbox Status

| Status | Bedeutung |
|---|---|
| `RECEIVED` | Empfangen |
| `PARSED` | Geparst |
| `MATCHED` | Sample/Order gefunden |
| `IMPORTED` | Vollständig importiert |
| `PARTIALLY_IMPORTED` | Teilweise importiert |
| `ERROR` | Fehler |
| `IGNORED` | Ignoriert |

### Matching Status

| Status | Bedeutung |
|---|---|
| `UNMATCHED` | Kein Match gefunden |
| `MATCHED_BY_SAMPLE_ID` | Match über Sample-ID |
| `MATCHED_BY_BARCODE` | Match über Barcode |
| `MATCHED_BY_FALLBACK_RULE` | Match über Fallback |
| `AMBIGUOUS` | Mehrere mögliche Matches |
| `FAILED` | Match fehlgeschlagen |

### Raw Result Status

| Status | Bedeutung |
|---|---|
| `RAW_RECEIVED` | Roh empfangen |
| `MAPPED` | Testcode gemappt |
| `PENDING_REVIEW` | Warte auf technische Prüfung |
| `ACCEPTED_TECHNICALLY` | Technisch akzeptiert |
| `REJECTED_TECHNICALLY` | Technisch abgelehnt |
| `FOR_VALIDATION` | Bereit für Validierung |
| `VALIDATED` | Fachlich freigegeben |

---

## Matching-Regeln

### Reihenfolge

1. Versuche Matching über `sample_id`
2. Wenn nicht vorhanden, versuche `barcode`
3. Wenn nicht erfolgreich, versuche `order_id`
4. Wenn weiterhin kein Ergebnis, nutze Fallback-Regeln
5. Wenn mehrere Matches möglich, markiere als `AMBIGUOUS`
6. Wenn kein Match möglich, markiere als `UNMATCHED`
7. Rohpayload und Parsergebnis niemals verwerfen

### Fallback-Regeln

Mögliche Fallback-Kombination:

- `instrument_id` + `rack` + `position` + Zeitfenster
- `instrument_id` + `instrument_test_code` + `measured_at` + Zeitfenster

---

## Validierungsregeln

### Vor dem Senden an die Maschine

- Probe existiert
- Auftrag existiert
- Probe ist nicht verworfen
- Gerät ist aktiv
- Gerät unterstützt diese Testart
- Alle Testcodes sind gemappt
- Probenart passt zum Gerät
- Barcode oder Sample-ID ist vorhanden
- Nachricht kann technisch gebaut werden

### Vor dem Import eingehender Resultate

- Gerät ist bekannt und aktiv
- Nachricht ist parsebar
- Sample-ID oder Barcode vorhanden
- Testcode bekannt oder mappbar
- Resultatwert lesbar
- Nachricht ist kein offensichtliches Duplikat

### Duplikaterkennung

Primäre Kombination:

- `instrument_id` + `sample_id` + `instrument_test_code` + `measured_at`

Alternativ:

- `message_id` + `result_position`

---

## Fehlerbehandlung

### Häufige Fehlerfälle

- Unbekanntes Gerät
- Gerät inaktiv
- Unbekannter Testcode
- Unbekannte Sample-ID
- Parserfehler
- NACK vom Gerät
- Timeout
- Verbindungsabbruch
- Dateizugriff fehlgeschlagen
- Dublette
- Resultat ohne passenden Auftrag
- Mehrdeutiges Matching
- Ungültiger Payload
- Inkompatible Probentypen

### Gewünschtes Verhalten

- Originalnachricht immer speichern
- Fehler immer protokollieren
- Bei technischen Fehlern Retry erlauben
- Bei fachlichen Fehlern Review Queue nutzen
- Keine stillen Datenverluste
- Keine automatische Löschung problematischer Nachrichten

---

## Retry-Strategie

### Retry erlaubt bei

- Timeout
- TCP-Verbindung fehlgeschlagen
- Temporärer Netzwerkfehler
- Serial-Port kurzzeitig nicht verfügbar
- Datei-Lock
- Temporäre Zielstörung

### Kein Retry bei

- Unbekannter Testcode
- Unbekannte Sample-ID
- Fehlerhaftes Mapping
- Ungültiger Payload
- Logischer Datenfehler
- Unparsbare Nachricht ohne definierte Recovery-Regel

### Retry-Verhalten

- Exponential Backoff
- Maximale Anzahl Wiederholungen konfigurierbar
- Finaler Fehlerstatus nach Überschreitung
- Audit-Eintrag pro Versuch

---

## Audit-Anforderungen

Jede Kommunikation muss vollständig nachvollziehbar sein.

Speichere pro Kommunikationsschritt:

- Instrument
- Richtung OUTBOUND / INBOUND
- Zeitpunkt
- Message Type
- Technischer Status
- Referenz auf Sample
- Referenz auf Order
- Rohpayload
- Geparstes Payload
- Fehlerdetails
- Benutzer oder Systemprozess
- Retry-Zähler
- ACK/NACK Status

### Grundregeln

- Rohnachrichten niemals löschen
- Audit-Einträge unveränderbar oder revisionssicher modellieren
- Änderungen an Mappings protokollieren
- Reprocessing-Aktionen protokollieren

---

## Adapter-Konzept

### Zielinterface für Protokolladapter

Jeder Adapter implementiert mindestens:

- `buildOutboundMessage(orderData)`
- `parseInboundMessage(rawPayload)`
- `validateMessage(rawPayload)`
- `extractSampleIdentifier(parsedMessage)`
- `extractOrderIdentifier(parsedMessage)`
- `extractResults(parsedMessage)`
- `extractDeviceStatus(parsedMessage)`

### Vorgesehene Adapter

- `Hl7InstrumentAdapter`
- `AstmInstrumentAdapter`
- `VendorCustomAdapter`
- `FileImportAdapter`

### Anforderungen

- Kernlogik darf nicht von HL7/ASTM abhängig sein
- Neue Adapter müssen ohne Umbau der Business-Logik ergänzt werden können
- Parser- und Builder-Logik je Protokoll kapseln

---

## Transport-Layer

### Zielinterface

Jeder Transport-Connector implementiert:

- `connect()`
- `disconnect()`
- `send(rawMessage)`
- `receive()`
- `ack()`
- `nack()`
- `healthCheck()`

### Vorgesehene Implementierungen

- `TcpTransport`
- `SerialTransport`
- `FileTransport`

---

## Kommunikationsfluss A — Auftrag an Maschine senden

1. Benutzer oder Workflow erstellt einen Auftrag
2. Probe wird registriert
3. Probe erhält Barcode und Sample-ID
4. MLMS bestimmt das passende Gerät
5. MLMS lädt das Testmapping für dieses Gerät
6. MLMS baut eine Outbound-Nachricht in interner Normalform
7. Protokolladapter transformiert in Zielformat
8. Nachricht wird in `instrument_order_outbox` gespeichert
9. Transport-Layer sendet Nachricht
10. ACK/NACK oder Sendestatus wird protokolliert
11. Bei technischem Fehler greift Retry-Strategie

---

## Kommunikationsfluss B — Resultat von Maschine empfangen

1. Gerät sendet Nachricht
2. Nachricht wird roh in `instrument_result_inbox` gespeichert
3. Protokolladapter parst die Nachricht
4. Sample-ID / Barcode / Order-ID werden extrahiert
5. Resultate werden extrahiert
6. Matching gegen interne Samples und Orders wird durchgeführt
7. Einzelne Resultate werden als Rohresultate in `instrument_raw_results` gespeichert
8. Testcodes werden auf interne Codes gemappt
9. Resultate gehen in technische Prüfung
10. Erst danach werden sie für die Validierung freigegeben

---

## Kommunikationsfluss C — Datei-basierte Integration

### Outbound Datei-Export

1. MLMS erzeugt Exportpayload in interner Normalform
2. Adapter transformiert in TXT/CSV/XLS
3. Datei wird in konfiguriertes Exportverzeichnis geschrieben
4. Outbox-Status wird aktualisiert
5. Audit-Eintrag wird erstellt

### Inbound Datei-Import

1. Polling oder File-Watcher erkennt neue Datei im Importverzeichnis
2. Datei wird eingelesen
3. Rohinhalt wird in `instrument_result_inbox` gespeichert
4. Parser wandelt Inhalt in interne Normalform
5. Matching und Import erfolgen wie im Standardfluss
6. Datei wird archiviert oder als verarbeitet markiert

---

## Backend-Services

Implementiere mindestens diese Services:

1. `InstrumentDefinitionService`
2. `InstrumentConnectionService`
3. `InstrumentMappingService`
4. `InstrumentMessageBuilderService`
5. `InstrumentTransportService`
6. `InstrumentInboxService`
7. `InstrumentParserService`
8. `InstrumentResultImportService`
9. `InstrumentAuditService`
10. `InstrumentRetryService`

### Zentrale Service-Methoden

- `buildOrderMessage(sampleId, instrumentId)`
- `queueOrderForInstrument(sampleId, instrumentId)`
- `sendOrderMessage(outboxId)`
- `receiveInboundMessage(instrumentId, rawPayload)`
- `parseInboundMessage(instrumentId, rawPayload)`
- `matchInboundResults(parsedMessage)`
- `importRawResults(parsedMessage)`
- `mapInstrumentTestCode(instrumentId, instrumentTestCode)`
- `reprocessInboxMessage(inboxId)`
- `detectDuplicateResult(resultCandidate)`
- `runRetryScheduler()`
- `writeAuditEntry(direction, instrumentId, referenceId, status, details)`

---

## API-Anforderungen

### Instrumente

- `GET /instruments`
- `GET /instruments/:id`
- `POST /instruments`
- `PATCH /instruments/:id`
- `DELETE /instruments/:id` — nur soft delete / deactivate

### Connections

- `GET /instruments/:id/connection`
- `POST /instruments/:id/connection`
- `PATCH /instruments/:id/connection`
- `POST /instruments/:id/test-connection`

### Mappings

- `GET /instruments/:id/mappings`
- `POST /instruments/:id/mappings`
- `PATCH /instruments/:id/mappings/:mappingId`
- `DELETE /instruments/:id/mappings/:mappingId`

### Outbox

- `GET /instrument-outbox`
- `GET /instrument-outbox/:id`
- `POST /instrument-outbox/:id/send`
- `POST /instrument-outbox/:id/retry`
- `POST /instrument-outbox/:id/cancel`

### Inbox

- `GET /instrument-inbox`
- `GET /instrument-inbox/:id`
- `POST /instrument-inbox/:id/reprocess`

### Raw Results

- `GET /samples/:id/raw-results`
- `GET /instrument-raw-results`
- `GET /instrument-raw-results/:id`

### Utilities

- `POST /samples/:id/push-to-instrument`

---

## UI-Anforderungen

### 1. Instrumente
- Geräteliste mit Status
- Detailseite
- Hersteller, Modell, Protokoll, Transport
- Aktivstatus
- Verbindung testen

### 2. Connections
- Host / Port
- Serial-Einstellungen
- File Paths
- Timeout und Retry Limit
- Verbindungstest-Button

### 3. Mappings
- Mapping-Tabelle pro Gerät
- Filter nach Gerät, Probentyp, Testcode
- Aktiv/Inaktiv togglebar
- Massenbearbeitung sinnvoll

### 4. Outbox
- Liste aller ausgehenden Aufträge
- Payload anzeigen
- Sendestatus sichtbar
- Retry-Zähler sichtbar
- ACK/NACK Anzeige
- Fehlerdetails sichtbar
- Manueller Retry-Button

### 5. Inbox
- Liste aller eingehenden Nachrichten
- Rohpayload anzeigen
- Parserstatus
- Matchingstatus
- Importstatus
- Fehlerdetails
- Reprocess-Button

### 6. Raw Results
- Rohresultate pro Probe
- Rohresultate pro Gerät
- Resultatwert, Einheit, Flags, Status
- Messzeit und Importzeit

### 7. Audit
- Vollständige Kommunikationshistorie
- Filter nach Gerät
- Filter nach Zeitraum
- Filter nach Richtung
- Filter nach Status
- Rohpayload auf Anfrage anzeigbar

---

## Nicht-funktionale Anforderungen

- Keine stille Datenverwerfung
- Originalnachrichten immer speichern
- Idempotente Verarbeitung soweit möglich
- Duplikaterkennung aktiv
- Gute Erweiterbarkeit für neue Geräte ohne Kernumbau
- Mapping ohne Codeänderung administrierbar
- Keine harte Kopplung an einzelne Hersteller
- Saubere Trennung zwischen Rohdaten und validierten Daten
- Fehlerfälle müssen über UI und Logs diagnostizierbar sein

---

## Testfälle

### Outbound

- Gültige Worklist wird korrekt gebaut
- Unbekanntes Mapping verhindert Senden mit klarer Fehlermeldung
- Nachricht wird korrekt in Outbox gespeichert
- Timeout löst Retry aus
- ACK wird korrekt protokolliert
- NACK führt zu Fehlerstatus

### Inbound

- Gültige Resultatnachricht wird korrekt geparst
- Unbekannte Sample-ID führt zu UNMATCHED-Status
- Unbekannter Testcode wird nicht still importiert
- Dublette wird erkannt und abgeblockt
- Rohpayload wird immer gespeichert, auch bei Fehler
- Matching über Barcode funktioniert
- Matching über Fallback-Regeln funktioniert

### Import

- Resultate werden korrekter Probe zugeordnet
- Raw Result wird in instrument_raw_results gespeichert
- Internes Testmapping funktioniert korrekt
- Ergebnis bleibt nach Import zunächst PENDING_REVIEW
- Reprocessing importiert korrigierte Nachrichten erneut
- Kein automatischer Sprung zu VALIDATED

### UI

- Inbox zeigt Fehlerdetails korrekt an
- Outbox zeigt Sendestatus und Retry korrekt an
- Mapping-Verwaltung funktioniert vollständig
- Raw Results sind pro Probe sichtbar
- Audit-Historie ist filterbar

---

## Implementierungsreihenfolge

Arbeite in genau dieser Reihenfolge:

1. Bestehende Sample-, Order-, Result- und Teststrukturen im Projekt analysieren
2. Bestehende APIs, Services und Datenmodelle identifizieren
3. Vorhandene Interface- oder Integration-Module sichten
4. DB-Migrationsentwurf für alle neuen Tabellen erstellen
5. Migrationen ausführen
6. Adapter-Interface definieren
7. Transport-Interface definieren
8. Ersten funktionalen Protokolladapter implementieren
9. Outbound-Flow vollständig implementieren
10. Inbound-Rohspeicherung implementieren
11. Parser implementieren
12. Matching- und Importlogik implementieren
13. Technische Review-Logik einbauen
14. Admin-UI für Instrumente, Connections, Mappings, Outbox, Inbox, Raw Results und Audit erstellen
15. Fehlerbehandlung und Retry vervollständigen
16. Tests ergänzen
17. Logging-Abdeckung prüfen

---

## Konkreter Arbeitsauftrag

Bitte führe jetzt diese Schritte aus:

1. Analysiere unser bestehendes Projekt rund um Samples, Orders, Results, Testkatalog und Workflow-Status.

2. Identifiziere bestehende Tabellen, Models, APIs, Services und Frontend-Seiten, die relevant sein könnten.

3. Erstelle einen kurzen Umsetzungsplan mit minimal invasiven Änderungen.

4. Implementiere anschließend direkt:
   - DB-Schema-Erweiterungen
   - Migrationen
   - Instrument Definitions
   - Connection Config
   - Test Mappings
   - Outbox / Inbox
   - Raw Result Storage
   - Parser-/Builder-Architektur
   - Transport-Architektur
   - Ersten funktionalen Instrument Adapter
   - Admin UI für Verwaltung und Fehlerdiagnose

5. Achte dabei darauf:
   - Bestehende Namenskonventionen einzuhalten
   - Bestehende Architektur zu respektieren
   - Vorhandene Result-/Order-/Sample-Strukturen zu erweitern statt zu duplizieren
   - Keine hardcodierten Mappings im Business-Code zu hinterlegen

6. Zeige am Ende klar:
   - Welche Dateien geändert wurden
   - Welche neuen Dateien erstellt wurden
   - Welche Tabellen hinzugefügt wurden
   - Welche Felder hinzugefügt wurden
   - Welche Statusmodelle neu eingeführt wurden
   - Wie ein Auftrag an eine Maschine gesendet wird
   - Wie ein Maschinenresultat zurück importiert wird
   - Wie Matching funktioniert
   - Wie Reprocessing funktioniert

---

## Harte Regeln

Diese Regeln sind verbindlich und dürfen nicht umgangen werden:

- Keine direkte finale Validierung von Maschinenresultaten ohne technische und fachliche Prüfung
- Keine Löschung von Rohpayloads
- Keine stillen Fehler
- Keine herstellerspezifische Logik quer über die Kernmodule verteilen
- Keine hardcodierten Testmappings im fachlichen Code
- Keine enge Kopplung zwischen einem Analysemodul und einem konkreten Gerät
- Keine automatische Übernahme problematischer Resultate als validierte Laborwerte
- Keine Duplikatimporte ohne Prüfung
- Jede Kommunikation muss auditierbar sein

---

## Erwartetes Endergebnis

Das Endergebnis soll eine robuste, erweiterbare Integrationsbasis für Diagnosemaschinen im MLMS sein.

Die Lösung soll:

- Mehrere Protokolle unterstützen
- Mehrere Geräte gleichzeitig betreiben können
- Sauber debugbar sein
- Rohdaten sicher und dauerhaft speichern
- Resultate korrekt matchen
- Technische und fachliche Ergebnisebenen trennen
- Für spätere Analyzer-Anbindungen wiederverwendbar sein
- Über Admin-UI vollständig bedienbar und observierbar sein

---

## Abschlusskontrolle durch Claude

Wenn die Implementierung fertig ist, beantworte bitte folgende Fragen:

1. Welche neuen Tabellen wurden angelegt?
2. Welche bestehenden Tabellen wurden erweitert?
3. Wie wird ein Outbound-Auftrag erzeugt und gesendet?
4. Wie wird eine eingehende Maschinennachricht empfangen, geparst und importiert?
5. Wie wird Matching durchgeführt?
6. Was passiert bei einem unbekannten Testcode?
7. Was passiert bei einem Parsing-Fehler?
8. Wie kann ein Administrator eine fehlerhafte Nachricht erneut verarbeiten?
9. Wie wird ein neues Gerät mit neuem Protokoll in Zukunft ergänzt?
10. Welche Statusmodelle wurden eingeführt und was bedeuten sie?
