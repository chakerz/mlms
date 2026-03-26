# Claude-Auftrag: Instrument Dashboard + Analyzer Simulator Workflow + i18n FR/AR

---

## Wichtiger Grundsatz: Zweisprachigkeit FR + AR

**Alle** Texte, Labels, Statustexte, Fehlermeldungen, PDF-Inhalte, Buttons, Tooltips und Notifications im gesamten MLMS müssen in **Französisch (FR)** und **Arabisch (AR)** verfügbar sein.

Das gilt rückwirkend für alles was bisher implementiert wurde und für alles was neu gebaut wird.

### i18n-Konfiguration

Das Projekt soll `i18next` (React) oder `vue-i18n` (Vue) verwenden.

Lege pro Sprache eine Übersetzungsdatei an:

```
frontend/src/locales/
├── fr/
│   ├── common.json
│   ├── orders.json
│   ├── samples.json
│   ├── analyzer.json
│   ├── validation.json
│   ├── reports.json
│   └── patients.json
└── ar/
    ├── common.json
    ├── orders.json
    ├── samples.json
    ├── analyzer.json
    ├── validation.json
    ├── reports.json
    └── patients.json
```

### RTL für Arabisch

Wenn die Sprache auf AR wechselt:
- `<html dir="rtl" lang="ar">` setzen
- Tailwind `rtl:` Klassen verwenden oder `dir="rtl"` per Layout-Wrapper
- Flexbox-Richtungen umkehren
- Abstände und Margins spiegeln
- Icons die Richtung haben (Pfeile, Fortschritt) ebenfalls spiegeln

### Übersetzungsdateien

Lege mindestens folgende Schlüssel an:

`frontend/src/locales/fr/analyzer.json`

```json
{
  "title": "Simulateur Analyseur",
  "pool_title": "Pool des Demandes",
  "send_to_analyzer": "Envoyer à l'analyseur",
  "place_in_rack": "Placer dans le rack",
  "start_analysis": "Démarrer l'analyse",
  "status": {
    "pending": "En attente",
    "sent_to_analyzer": "Envoyée à l'analyseur",
    "placed_in_rack": "Placée dans le rack",
    "in_progress": "En cours d'analyse",
    "results_received": "Résultats reçus",
    "results_sent_back": "Résultats transmis",
    "error": "Erreur"
  },
  "rack": "Rack",
  "slot": "Position",
  "barcode": "Code-barres",
  "patient": "Patient",
  "tests_requested": "Analyses demandées",
  "result": "Résultat",
  "unit": "Unité",
  "reference_range": "Valeurs de référence",
  "flag": "Indicateur",
  "measured_at": "Mesuré le",
  "send_results_back": "Renvoyer les résultats",
  "send_results_auto": "Envoi automatique",
  "send_results_manual": "Envoi manuel",
  "confirm_place_in_rack": "Confirmer le placement dans le rack",
  "confirm_start": "Confirmer le démarrage de l'analyse",
  "no_demandes": "Aucune demande dans le pool",
  "demande_details": "Détails de la demande",
  "sample_info": "Informations sur l'échantillon",
  "patient_info": "Informations patient",
  "prescription_info": "Informations de prescription",
  "astm_sent": "Message ASTM envoyé",
  "astm_received": "Message ASTM reçu",
  "ack": "ACK reçu",
  "nack": "NACK reçu"
}
```

`frontend/src/locales/ar/analyzer.json`

```json
{
  "title": "محاكي جهاز التحليل",
  "pool_title": "قائمة الطلبات",
  "send_to_analyzer": "إرسال إلى الجهاز",
  "place_in_rack": "وضع في الرف",
  "start_analysis": "بدء التحليل",
  "status": {
    "pending": "في الانتظار",
    "sent_to_analyzer": "أُرسلت إلى الجهاز",
    "placed_in_rack": "موضوعة في الرف",
    "in_progress": "قيد التحليل",
    "results_received": "تم استلام النتائج",
    "results_sent_back": "تم إرسال النتائج",
    "error": "خطأ"
  },
  "rack": "الرف",
  "slot": "الموضع",
  "barcode": "الباركود",
  "patient": "المريض",
  "tests_requested": "التحاليل المطلوبة",
  "result": "النتيجة",
  "unit": "الوحدة",
  "reference_range": "القيم المرجعية",
  "flag": "المؤشر",
  "measured_at": "تاريخ القياس",
  "send_results_back": "إرسال النتائج",
  "send_results_auto": "إرسال تلقائي",
  "send_results_manual": "إرسال يدوي",
  "confirm_place_in_rack": "تأكيد الوضع في الرف",
  "confirm_start": "تأكيد بدء التحليل",
  "no_demandes": "لا توجد طلبات في القائمة",
  "demande_details": "تفاصيل الطلب",
  "sample_info": "معلومات العينة",
  "patient_info": "معلومات المريض",
  "prescription_info": "معلومات الوصفة",
  "astm_sent": "تم إرسال رسالة ASTM",
  "astm_received": "تم استلام رسالة ASTM",
  "ack": "تم استلام ACK",
  "nack": "تم استلام NACK"
}
```

Erstelle analoge Übersetzungsdateien für alle anderen Module (`common`, `orders`, `samples`, `validation`, `reports`, `patients`) mit denselben Schlüsseln auf FR und AR.

### Sprachumschalter

Füge in den App-Header einen Sprachumschalter ein:

```tsx
// LanguageSwitcher.tsx
<button onClick={() => i18n.changeLanguage('fr')}>FR</button>
<button onClick={() => i18n.changeLanguage('ar')}>AR</button>
```

Wenn AR aktiv: `document.documentElement.dir = 'rtl'`
Wenn FR aktiv: `document.documentElement.dir = 'ltr'`

---

## Überprüfung aller bisherigen Module auf i18n

Bitte überprüfe alle bisher implementierten Dateien und Komponenten auf hardcodierte Texte.

Folgende Module müssen vollständig übersetzt sein:

### 1. Patientenaufnahme (Accueil)
Alle Labels, Buttons, Fehlermeldungen, Platzhalter, Statustexte.

### 2. Probeneingang (Réception des échantillons)
Alle Non-Conformité Texte, Qualitätsstatus, Aktionen.

### 3. Analyzer Dashboard
Header-Texte, Status-Labels, Rack/Slot-Tooltips, Log-Einträge, Control-Buttons.

### 4. Technische Validierung
Alle Validierungsaktionen, Delta-Check-Texte, Westgard-Regeln, Flagbeschreibungen.

### 5. Medizinische Validierung
Befundtexte, Kommentarfelder, Aktions-Buttons.

### 6. PDF-Befund
Das PDF-Template muss in FR und AR existieren. Sprachauswahl aus Auftragskonfiguration oder Patientenpräferenz.

---

## Schritt 2: Workflow — Von "Envoyer à l'analyseur" bis Ergebnisrücklauf

### Beschreibung

Dieser Abschnitt beschreibt den **vollständigen, realen Ablauf** einer Probe vom Moment der Freigabe durch den Laborant bis zum Eintreffen der Ergebnisse im MLMS.

Der Ablauf ist so nah wie möglich an der **realen Laborumgebung** modelliert.

In der realen Welt:
- Der Biologiste/Technicien schaut auf seine Arbeitsliste
- Er sieht eine freigegebene Demande
- Er nimmt das Röhrchen mit dem Barcode
- Er stellt es physisch in den Rack des Analyzers ein
- Er startet den Lauf am Gerät
- Das Gerät scannt den Barcode, fragt das LIS nach der Worklist
- Das LIS antwortet mit den angeforderten Tests
- Das Gerät misst und sendet die Ergebnisse
- Der Technicien sieht die Ergebnisse auf seinem Bildschirm

**Im MLMS** wird genau dieser Ablauf digital abgebildet.

---

### Phase 2.1 — Freigabe einer Demande für den Analyzer

#### Wer macht das

Rolle: `TECHNICIEN` oder `BIOLOGISTE`

#### Wo im Dashboard

Seite: `/samples/inbox` oder `/orders` mit Filter "Bereit für Analyse"

#### Was der Benutzer sieht

Eine Liste aller Demandes (Aufträge), bei denen:
- Die Probe empfangen wurde (`sample.status = RECEIVED` oder `PREPARED`)
- Die Probe dem richtigen Analyzer zugeordnet ist
- Die Demande noch nicht an den Analyzer gesendet wurde

Jede Zeile zeigt:
- Accession-Nummer
- **Patientenname und Geburtsdatum** (aus der echten Demande, keine Dummy-Daten)
- **Barcode der Probe**
- **Röhrchentyp / Farbe**
- Liste der angeforderten Tests
- Dringlichkeit (ROUTINE / URGENT / STAT)
- Entnahmedatum
- Empfangsdatum

#### Was der Benutzer macht

Er klickt auf **"Envoyer à l'analyseur" / "إرسال إلى الجهاز"**.

#### Was das System macht

1. Validiert: Probe vorhanden, Barcode gesetzt, Tests gemappt, Gerät aktiv
2. Baut eine ASTM-Nachricht mit den **echten Daten aus der Demande**:
   - `sample_id` aus `samples.id`
   - `barcode` aus `samples.barcode`
   - `patient_name` aus `patients.last_name + first_name`
   - `patient_birth_date` aus `patients.birth_date`
   - `patient_sex` aus `patients.sex`
   - `tests` aus den gemappten `order_results.test_code`
   - `priority` aus `orders.priority`
   - `collected_at` aus `samples.collected_at`
   - `received_at` aus `samples.received_at`
3. Speichert in `instrument_order_outbox`
4. Sendet ASTM-Worklist an Simulator
5. Ändert Order-Status auf `SENT_TO_ANALYZER`
6. Schickt WebSocket-Event an Dashboard und Simulator

#### Status-Änderung

```
SAMPLE_PREPARED → SENT_TO_ANALYZER
```

---

### Phase 2.2 — Empfang im Analyzer-Simulator Pool

#### Was der Simulator empfängt

Der Simulator empfängt die ASTM-Nachricht und legt sie in seinem **internen Pool** ab.

Der Pool ist eine Liste aller eingegangenen Demandes mit folgenden Informationen:

```ts
interface SimulatorPoolEntry {
  poolId: string;
  receivedAt: string;

  // Echte Daten aus der Demande
  accessionNumber: string;
  sampleId: string;
  barcode: string;
  patient: {
    fullName: string;
    birthDate: string;
    sex: string;
    patientId: string;
  };
  specimen: {
    type: string;
    tubeColor: string;
    collectedAt: string;
    receivedAt: string;
    priority: string;
  };
  tests: {
    internalCode: string;
    instrumentCode: string;
    testName: string;
  }[];

  // Simulator-Zustand
  poolStatus: PoolStatus;
  rackId: string | null;
  slotNumber: number | null;
  results: SimulatorResult[];
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
}

type PoolStatus =
  | 'WAITING'          // Angekommen, noch nicht im Rack
  | 'IN_RACK'          // Im Rack platziert, noch nicht gestartet
  | 'IN_PROGRESS'      // Lauf läuft
  | 'COMPLETED'        // Messung fertig, Ergebnisse vorhanden
  | 'RESULTS_SENT'     // Ergebnisse an MLMS gesendet
  | 'ERROR';           // Fehler
```

#### WebSocket-Event an Dashboard

```json
{
  "event": "POOL_ENTRY_ADDED",
  "data": {
    "poolId": "pool_001",
    "accessionNumber": "ACC-2026-000123",
    "sampleId": "SMP-2026-000123",
    "barcode": "123456789012",
    "patient": {
      "fullName": "DOE Jean",
      "birthDate": "1988-06-12",
      "sex": "M",
      "patientId": "PAT-001245"
    },
    "specimen": {
      "type": "Sérum",
      "tubeColor": "Jaune",
      "collectedAt": "2026-03-26T08:00:00Z",
      "receivedAt": "2026-03-26T08:15:00Z",
      "priority": "ROUTINE"
    },
    "tests": [
      { "internalCode": "TSH", "instrumentCode": "TSH", "testName": "TSH" },
      { "internalCode": "FT4", "instrumentCode": "FT4", "testName": "T4 Libre" }
    ],
    "poolStatus": "WAITING",
    "rackId": null,
    "slotNumber": null
  }
}
```

---

### Phase 2.3 — Pool-Ansicht im Dashboard (MLMS · Analyzer Simulator)

Dies ist das **Herzstück** dieses Abschnitts.

#### Seitentitel

Français: `MLMS · Simulateur Analyseur — Pool des Demandes`
Arabe: `MLMS · محاكي الجهاز — قائمة الطلبات`

#### Layout der Seite

Die Seite besteht aus **zwei Bereichen**:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  MLMS · Simulateur Analyseur — cobas e 411                                    │
│  [Statusindicator: ● PRÊT]   [LIS: ● Connecté]                                │
└───────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐   ┌────────────────────────────────────────────┐
│                              │   │                                            │
│   POOL DES DEMANDES          │   │   RACK VISUALISEUR                         │
│   قائمة الطلبات              │   │   مرئيات الرف                              │
│                              │   │                                            │
│   [Demande 1] WAITING        │   │  RACK 01                                   │
│   [Demande 2] IN_RACK        │   │  [●][●][◐][○][○]...                       │
│   [Demande 3] IN_PROGRESS    │   │                                            │
│   [Demande 4] COMPLETED      │   │                                            │
│                              │   │                                            │
└──────────────────────────────┘   └────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────────────┐
│  LIVE LOG                                                                     │
│  [08:15:22] ASTM reçu  ACC-2026-000123  Tests: TSH, FT4                      │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

#### Pool-Listenkomponente

Jede Zeile im Pool zeigt folgendes:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ● WAITING                                                                    │
│                                                                              │
│  ACC-2026-000123                        [ROUTINE]                           │
│  ████████████████ (Barcode visual)                                          │
│                                                                              │
│  👤 DOE Jean     ♂   né le 12/06/1988                                      │
│  🧪 Sérum  -   Tube Jaune  -   Reçu: 26/03/2026 08:15                        │
│  🔬 TSH  -   FT4  -   FT3                                                    │
│                                                                              │
│  Prescripteur: Dr. Ahmed Benali                                             │
│                                                                              │
│  [ Placer dans le rack ]                                                    │
│  [ وضع في الرف ]                                                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Alle Daten kommen aus der echten Demande:**
- Name, Geburtsdatum, Geschlecht → aus `patients`
- Barcode → aus `samples.barcode`
- Röhrchenfarbe → aus `samples.tube_color`
- Empfangszeit → aus `samples.received_at`
- Tests → aus `order_results` + Testmapping
- Prescripteur → aus `prescribers`

Keine fiktiven Platzhalter. Alle Felder müssen mit echten Daten gefüllt sein.

---

#### Pool-Status-Farben

| Status | FR | AR | Farbe | Animation |
|---|---|---|---|---|
| `WAITING` | En attente | في الانتظار | Grau | Keine |
| `IN_RACK` | Dans le rack | في الرف | Gelb | Langsames Pulsieren |
| `IN_PROGRESS` | En cours | قيد التحليل | Orange | Schnelles Blinken |
| `COMPLETED` | Terminé | مكتمل | Grün | Keine |
| `RESULTS_SENT` | Résultats transmis | تم إرسال النتائج | Cyan | Keine |
| `ERROR` | Erreur | خطأ | Rot | Schnelles Blinken |

---

### Phase 2.4 — Probe im Rack platzieren (analoges Einstellen ins Gerät)

#### Reales Vorbild

In der realen Welt: Der Technicien nimmt das Röhrchen, liest den Barcode und stellt es in eine freie Position im Rack des Analyzers.

#### Was der Benutzer macht

Er klickt auf **"Placer dans le rack" / "وضع في الرف"** in der Pool-Karte.

#### Was das System zeigt

Ein **Placement-Dialog** öffnet sich:

```
┌────────────────────────────────────────────────────────────┐
│  Placer dans le rack — وضع في الرف                         │
│                                                            │
│  Échantillon: ACC-2026-000123                              │
│  Patient: DOE Jean — né 12/06/1988                         │
│  Tests: TSH · FT4 · FT3                                   │
│                                                            │
│  Sélectionner une position libre:                          │
│  اختر موضعاً شاغراً:                                       │
│                                                            │
│  RACK 01:                                                  │
│  [○1][○2][●3][○4][○5][○6][○7][○8][○9][○10]              │
│   Libre    Occupé                                          │
│                                                            │
│  Position sélectionnée: Slot 1                             │
│                                                            │
│  [ Confirmer le placement ]  [ Annuler ]                   │
│  [ تأكيد الوضع ]             [ إلغاء ]                     │
└────────────────────────────────────────────────────────────┘
```

Freie Slots sind anklickbar und hervorgehoben.
Belegte Slots sind grau und nicht klickbar.

#### Was das System macht

1. Slot wird als belegt markiert
2. Pool-Eintrag bekommt `rackId` und `slotNumber`
3. Pool-Status ändert sich auf `IN_RACK`
4. Rack-Visualisierung wird sofort aktualisiert: Slot zeigt jetzt den Barcode der Probe
5. WebSocket-Event wird gesendet

#### WebSocket-Event

```json
{
  "event": "SAMPLE_PLACED_IN_RACK",
  "data": {
    "poolId": "pool_001",
    "accessionNumber": "ACC-2026-000123",
    "barcode": "123456789012",
    "patient": {
      "fullName": "DOE Jean",
      "birthDate": "1988-06-12",
      "sex": "M"
    },
    "rackId": "RACK_01",
    "slotNumber": 1,
    "placedAt": "2026-03-26T08:20:00Z"
  }
}
```

#### Rack-Visualisierung nach Placement

Der Slot zeigt jetzt:
- Barcode-Nummer
- Patientenname (abgekürzt)
- Status-Kreis (gelb, pulsierend)
- Tooltip mit allen Probe-Details

```
RACK 01
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  [DOE J.]  [○]  [○]  [○]  [○]  [○]  [○]  [○]  [○]  [○]    │
│   TSH/FT4                                                      │
│   Slot 1                                                       │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### Phase 2.5 — Analyse starten

#### Reales Vorbild

Der Technicien drückt "Start" am Gerät oder der Lauf startet automatisch wenn alle Proben eingelegt sind.

#### Was der Benutzer macht

Option A — Manuell pro Probe:
Er klickt auf **"Démarrer l'analyse" / "بدء التحليل"** in der Pool-Karte nachdem die Probe im Rack ist.

Option B — Manuell gesamt:
Er klickt auf **"Démarrer le run" / "بدء الجلسة"** um alle Proben im Rack auf einmal zu starten.

Option C — Automatisch:
Sobald die Probe im Rack ist, startet der Lauf automatisch nach einem konfigurierbaren Delay (z. B. 10 Sekunden).

#### Was das System macht

1. Pool-Status: `IN_RACK` → `IN_PROGRESS`
2. Slot-Status in Rack-Visualisierung: `LOADED` → `PROCESSING`
3. Fortschrittsring startet am Slot (0% → 100%)
4. Simulator-Messung beginnt (mit konfigurierten Timings aus CobasE411Config)
5. Progress-Updates per WebSocket alle 1–2 Sekunden

#### Progress-Events

```json
{
  "event": "ANALYSIS_PROGRESS",
  "data": {
    "poolId": "pool_001",
    "accessionNumber": "ACC-2026-000123",
    "barcode": "123456789012",
    "patient": {
      "fullName": "DOE Jean"
    },
    "rackId": "RACK_01",
    "slotNumber": 1,
    "progress": 45,
    "currentTest": "TSH",
    "elapsedMs": 4500,
    "estimatedRemainingMs": 5500
  }
}
```

---

### Phase 2.6 — Ergebnisse generieren und zurücksenden

#### Was der Simulator macht

Wenn die Messung fertig ist (progress = 100%):

1. Ergebnisse werden generiert mit echten Testcodes aus der Demande
2. Werte werden mit `ResultGenerator` berechnet (basierend auf `CobasE411Tests`)
3. Ergebnisse werden im Pool gespeichert
4. Pool-Status: `IN_PROGRESS` → `COMPLETED`
5. Slot-Status: `PROCESSING` → `DONE`

#### Was angezeigt wird (vor Senden)

In der Pool-Karte werden die Ergebnisse sofort angezeigt:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ✅ TERMINÉ                                                                   │
│                                                                              │
│  ACC-2026-000123 — DOE Jean  ♂  12/06/1988                                  │
│  Rack 01 — Slot 1 — TSH · FT4 · FT3                                         │
│                                                                              │
│  Résultats:                                                                  │
│  ┌─────────────────────────────────────────────────────┐                    │
│  │ TSH      │  2.45  │ mUI/L  │ 0.27–4.20  │ NORMAL ✓ │                   │
│  │ FT4      │  24.1  │ pmol/L │ 12–22      │ ÉLEVÉ  ↑ │                   │
│  │ FT3      │  5.2   │ pmol/L │ 3.1–6.8    │ NORMAL ✓ │                   │
│  └─────────────────────────────────────────────────────┘                    │
│                                                                              │
│  Mode de transmission:                                                       │
│  [● Automatique]  [○ Manuel]                                                 │
│                                                                              │
│  [ Transmettre au MLMS ]   ← nur sichtbar wenn Modus = Manuel              │
│  [ إرسال إلى النظام ]                                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### Phase 2.7 — Ergebnisse an MLMS zurücksenden

#### Zwei Modi

**Automatisch:**
Sobald `COMPLETED`, werden die Ergebnisse automatisch als ASTM-Nachricht zurückgesendet.
Konfigurierbar per `autoSendResults: true` in der Analyzer-Config.

**Manuell:**
Der Technicien sieht die Ergebnisse zuerst, prüft sie visuell und klickt dann auf "Transmettre au MLMS".

#### ASTM-Resultat-Nachricht

Die Nachricht wird mit **echten Daten** aus der Demande gebaut. Keine Dummy-Werte.

Beispiel ASTM-Nachricht (interne Normalform vor Protokolltransformation):

```json
{
  "instrumentId": "SIM_COBAS_E411",
  "messageId": "MSG-20260326-001",
  "messageType": "RESULT",
  "sampleId": "SMP-2026-000123",
  "accessionNumber": "ACC-2026-000123",
  "barcode": "123456789012",
  "patient": {
    "id": "PAT-001245",
    "fullName": "DOE Jean",
    "birthDate": "1988-06-12",
    "sex": "M"
  },
  "specimen": {
    "type": "SERUM",
    "collectedAt": "2026-03-26T08:00:00Z",
    "receivedAt": "2026-03-26T08:15:00Z"
  },
  "receivedAt": "2026-03-26T08:52:11Z",
  "results": [
    {
      "instrumentTestCode": "TSH",
      "internalTestCode": "TSH",
      "testName": "TSH",
      "value": "2.45",
      "unit": "mUI/L",
      "referenceRange": "0.27-4.20",
      "flag": "NORMAL",
      "resultStatus": "COMPLETED",
      "measuredAt": "2026-03-26T08:50:02Z"
    },
    {
      "instrumentTestCode": "FT4",
      "internalTestCode": "FT4",
      "testName": "T4 Libre",
      "value": "24.1",
      "unit": "pmol/L",
      "referenceRange": "12-22",
      "flag": "HIGH",
      "resultStatus": "COMPLETED",
      "measuredAt": "2026-03-26T08:50:15Z"
    },
    {
      "instrumentTestCode": "FT3",
      "internalTestCode": "FT3",
      "testName": "T3 Libre",
      "value": "5.2",
      "unit": "pmol/L",
      "referenceRange": "3.1-6.8",
      "flag": "NORMAL",
      "resultStatus": "COMPLETED",
      "measuredAt": "2026-03-26T08:50:28Z"
    }
  ],
  "deviceStatus": {
    "status": "COMPLETED",
    "runId": "RUN-20260326-001",
    "qcStatus": "OK",
    "calibrationStatus": "VALID"
  }
}
```

#### Was MLMS nach Empfang macht

1. Nachricht in `instrument_result_inbox` speichern (raw)
2. Parsen und Probe matchen (über `barcode` oder `accession_number`)
3. Ergebnisse in `instrument_raw_results` speichern
4. Ergebnisse in `order_results` mappen
5. Status: `IN_ANALYSIS` → `RESULTS_RECEIVED`
6. WebSocket-Event an Dashboard senden
7. Ergebnisse sind jetzt in der technischen Validierungsqueue sichtbar

#### WebSocket-Event an MLMS-Dashboard

```json
{
  "event": "RESULTS_IMPORTED",
  "data": {
    "orderId": "ORD-2026-004567",
    "accessionNumber": "ACC-2026-000123",
    "sampleId": "SMP-2026-000123",
    "patient": {
      "fullName": "DOE Jean",
      "birthDate": "1988-06-12"
    },
    "resultsCount": 3,
    "hasAbnormal": true,
    "hasCritical": false,
    "importedAt": "2026-03-26T08:52:30Z"
  }
}
```

---

### Phase 2.8 — Ergebnisse im MLMS Dashboard anzeigen

Nach dem Import sind die Ergebnisse sofort in der **Auftrags-Detailansicht** sichtbar.

#### Ergebnistabelle (FR + AR)

FR-Header: `Analyses | Résultat | Unité | Valeurs de référence | Indicateur | Statut`
AR-Header: `التحاليل | النتيجة | الوحدة | القيم المرجعية | المؤشر | الحالة`

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ACC-2026-000123 — DOE Jean — 12/06/1988 — Masculin                        │
│  Prescrit par: Dr. Ahmed Benali                                            │
│  Sérum — Reçu le 26/03/2026                                               │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Analyse  │ Résultat │ Unité  │ Réf.        │ Indicateur │ Statut     │ │
│  ├──────────┼──────────┼────────┼─────────────┼────────────┼────────────┤ │
│  │ TSH      │ 2.45     │ mUI/L  │ 0.27–4.20   │ Normal     │ ⏳ Attente │ │
│  │ **FT4**  │ **24.1** │ pmol/L │ 12–22       │ **↑ ÉLEVÉ**│ ⏳ Attente │ │
│  │ FT3      │ 5.2      │ pmol/L │ 3.1–6.8     │ Normal     │ ⏳ Attente │ │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  [ Valider techniquement ]   [ Rejeter ]                                   │
│  [ التحقق التقني ]           [ رفض ]                                       │
└────────────────────────────────────────────────────────────────────────────┘
```

Abnormale Werte werden fett und farbig markiert (Orange für HOCH/NIEDRIG, Rot für KRITISCH).

---

## Datenbankänderungen für diesen Workflow

### Tabelle `instrument_order_outbox` erweitern

Ergänze folgende Felder:

- `patient_snapshot_json JSONB` — Snapshot der Patientendaten zum Sendezeitpunkt
- `specimen_snapshot_json JSONB` — Snapshot der Probendaten
- `tests_snapshot_json JSONB` — Snapshot der angeforderten Tests

Diese Snapshots stellen sicher, dass auch wenn Patientendaten nachträglich geändert werden, die gesendeten Daten nachvollziehbar bleiben.

### Neue Tabelle `analyzer_pool`

```sql
CREATE TABLE analyzer_pool (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instrument_id         UUID NOT NULL REFERENCES instruments(id),
  order_id              UUID NOT NULL REFERENCES orders(id),
  sample_id             UUID NOT NULL REFERENCES samples(id),
  outbox_id             UUID REFERENCES instrument_order_outbox(id),

  -- Echte Daten aus der Demande (Snapshot)
  accession_number      VARCHAR NOT NULL,
  barcode               VARCHAR NOT NULL,
  patient_snapshot      JSONB NOT NULL,
  specimen_snapshot     JSONB NOT NULL,
  tests_snapshot        JSONB NOT NULL,

  -- Simulator-Zustand
  pool_status           VARCHAR NOT NULL DEFAULT 'WAITING',
  rack_id               VARCHAR,
  slot_number           INTEGER,

  -- Zeitstempel
  received_at           TIMESTAMP NOT NULL DEFAULT NOW(),
  placed_in_rack_at     TIMESTAMP,
  analysis_started_at   TIMESTAMP,
  analysis_completed_at TIMESTAMP,
  results_sent_at       TIMESTAMP,

  -- Ergebnisse (Snapshot wenn Simulator fertig)
  results_snapshot      JSONB,
  error_message         TEXT,

  -- Übertragungseinstellungen
  auto_send_results     BOOLEAN NOT NULL DEFAULT TRUE,

  created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## Neue API-Endpunkte

```
GET    /analyzer-pool                          → Alle Pool-Einträge (Filter nach Status, Gerät)
GET    /analyzer-pool/:id                      → Pool-Eintrag Details
POST   /analyzer-pool/:id/place-in-rack        → Probe in Rack platzieren
POST   /analyzer-pool/:id/start-analysis       → Analyse starten
POST   /analyzer-pool/:id/send-results         → Ergebnisse manuell senden (wenn Modus = manuell)
PATCH  /analyzer-pool/:id/auto-send            → Auto-Send aktivieren/deaktivieren
GET    /analyzer-pool/:id/results              → Ergebnisse des Pool-Eintrags
```

---

## Neue Frontend-Komponenten

### `AnalyzerPoolPage.tsx`

Hauptseite mit Pool-Liste links und Rack-Visualisierung rechts.

### `PoolCard.tsx`

Karte pro Demande im Pool mit:
- Patientendaten (Name, Geburtsdatum, Geschlecht) — **echt aus Demande**
- Barcode-Visualisierung
- Röhrchenfarbe als farbiger Punkt
- Testliste
- Dringlichkeits-Badge
- Status-Badge mit Animation
- Aktions-Buttons je nach Status
- Ergebnistabelle wenn COMPLETED
- Übertragungsmodus-Toggle (Auto/Manuel)

### `RackPlacementModal.tsx`

Dialog zum Platzieren einer Probe im Rack:
- Zeigt Rack-SVG mit freien/belegten Slots
- Slot-Auswahl per Klick
- Bestätigungsbutton
- Zweisprachig (FR + AR)

### `AnalysisProgressIndicator.tsx`

Fortschrittsbalken im Slot und in der Pool-Karte mit:
- Prozentzahl
- Aktueller Test
- Verbleibende Zeit

### `ResultsPreviewTable.tsx`

Ergebnistabelle mit:
- Testname (FR + AR)
- Wert
- Einheit
- Referenzbereich
- Flag mit Farbe und Pfeil
- Zweisprachig

---

## Simulator-Änderungen

### Pool-Management im Simulator

Der Simulator muss folgende neue Methoden implementieren:

```ts
// Neue Demande aus MLMS empfangen und in Pool legen
receiveOrderFromLIS(astmMessage: ParsedAstmMessage): void

// Probe im Rack platzieren (ausgelöst durch Benutzeraktion im Dashboard)
placeInRack(poolId: string, rackId: string, slotNumber: number): void

// Analyse starten
startAnalysis(poolId: string): void

// Alle Proben im Rack starten (Batch-Start)
startAllInRack(rackId: string): void

// Pool-Status abrufen
getPool(): SimulatorPoolEntry[]

// Pool-Eintrag abrufen
getPoolEntry(poolId: string): SimulatorPoolEntry | null

// Ergebnisse senden
sendResultsToLIS(poolId: string): void
```

### Pool-State im SimulatorState

Ergänze `SimulatorState`:

```ts
interface SimulatorState {
  // ... bestehende Felder
  pool: SimulatorPoolEntry[];
}
```

---

## Konfiguration Auto-Send vs. Manual

In `CobasE411Config` folgendes Feld ergänzen:

```ts
simulation: {
  // ...
  autoSendResults: true,         // Ergebnisse automatisch senden wenn fertig
  autoSendDelayMs: 2000,         // Kurze Pause vor automatischem Senden
  autoStartAnalysis: false,      // Analyse automatisch starten wenn im Rack
  autoStartDelayMs: 10000        // Delay vor Auto-Start
}
```

---

## Live-Log Erweiterung

Der Live-Log soll folgende neuen Einträge zeigen:

| Event | FR | AR |
|---|---|---|
| Demande empfangen | `Demande reçue — ACC-2026-000123 — DOE Jean` | `تم استلام الطلب — ACC-2026-000123 — DOE Jean` |
| Im Rack platziert | `Placée — RACK 01 Slot 1 — ACC-2026-000123` | `تم الوضع — رف 01 موضع 1 — ACC-2026-000123` |
| Analyse gestartet | `Analyse démarrée — ACC-2026-000123` | `بدأ التحليل — ACC-2026-000123` |
| Fortschritt | `En cours — 45% — Test: TSH` | `جارٍ — 45% — تحليل: TSH` |
| Fertig | `Terminé — ACC-2026-000123 — 3 résultats` | `اكتمل — ACC-2026-000123 — 3 نتائج` |
| Gesendet | `Résultats transmis — ACC-2026-000123` | `تم إرسال النتائج — ACC-2026-000123` |
| Fehler | `Erreur — ACC-2026-000123 — Caillot détecté` | `خطأ — ACC-2026-000123 — تم اكتشاف جلطة` |

---

## Implementierungsreihenfolge

Arbeite in genau dieser Reihenfolge:

1. **i18n einrichten**: i18next installieren und konfigurieren, Übersetzungsdateien für FR + AR anlegen, RTL-Unterstützung einbauen, Sprachumschalter im Header

2. **Alle bestehenden Komponenten übersetzen**: Jeden hardcodierten Text durch `t('key')` ersetzen, für jeden Text FR + AR Übersetzung ergänzen

3. **DB-Migration**: Tabelle `analyzer_pool` erstellen, `instrument_order_outbox` um Snapshots erweitern

4. **Backend**: 
   - `AnalyzerPoolService` implementieren
   - Neue API-Endpunkte implementieren
   - WebSocket-Events für Pool erweitern

5. **Simulator erweitern**:
   - Pool-Management implementieren
   - `receiveOrderFromLIS` verwirklicht
   - `placeInRack`, `startAnalysis`, `sendResultsToLIS` implementieren
   - Pool-State in WebSocket-Events einbauen
   - Auto-Send / Manual-Send Logik

6. **Frontend — Pool-Seite**:
   - `AnalyzerPoolPage` aufbauen
   - `PoolCard` mit echten Patientendaten
   - `RackPlacementModal`
   - `AnalysisProgressIndicator`
   - `ResultsPreviewTable`
   - WebSocket-Events einbinden

7. **Frontend — Ergebnisanzeige im Auftrags-Dashboard**: 
   - Ergebnistabelle zweisprachig
   - Abnormal-Markierungen
   - Status-Übergänge in Echtzeit

8. **Tests** für den gesamten Ablauf

---

## Konkreter Arbeitsauftrag

Bitte führe folgende Schritte aus:

1. Analysiere alle bestehenden Komponenten, Seiten und Services auf hardcodierte Texte.

2. Richte i18n mit FR + AR vollständig ein, inklusive RTL-Unterstützung für Arabisch.

3. Ersetze alle hardcodierten Texte durch i18n-Schlüssel.

4. Implementiere die Tabelle `analyzer_pool` und alle nötigen Migrations.

5. Implementiere den vollständigen Pool-Workflow:
   - Demande in Pool empfangen
   - Pool-Ansicht mit echten Patientendaten
   - Probe im Rack platzieren
   - Analyse starten
   - Fortschritt anzeigen
   - Ergebnisse anzeigen und senden
   - Ergebnisse im MLMS-Dashboard anzeigen

6. Stelle sicher, dass **alle Daten** in der Pool-Ansicht aus der echten Demande kommen.

7. Zeige am Ende:
   - Welche Dateien geändert wurden
   - Welche Dateien neu angelegt wurden
   - Wie der vollständige Ablauf von "Envoyer à l'analyseur" bis Ergebnisanzeige funktioniert
   - Screenshot-Beschreibung der Pool-Ansicht auf FR und AR

---

## Harte Regeln

- Keine fiktiven oder hardcodierten Patientendaten in der Pool-Ansicht
- Alle Texte müssen in FR und AR vorliegen, keine Ausnahmen
- RTL muss korrekt für alle Pool- und Rack-Komponenten funktionieren
- Patientensnapshot muss zum Sendezeitpunkt gespeichert werden
- Ergebnisse werden erst angezeigt wenn sie wirklich vom Simulator zurückgekommen sind
- Auto-Send und Manual-Send müssen beide vollständig implementiert sein
- Jeder Rack-Slot muss den echten Patientennamen und Barcode zeigen (kein "Sample 1")
- Pool-Status muss in Echtzeit per WebSocket aktualisiert werden

---

## Erwartetes Endergebnis

Nach der Implementierung soll ein Technicien folgendes tun können:

1. Im Dashboard eine freigegebene Demande sehen mit echten Patientendaten
2. Auf "Envoyer à l'analyseur" klicken
3. Im Analyzer-Pool sofort die Demande mit Patientendaten, Barcode, Tests sehen
4. Auf "Placer dans le rack" klicken und einen freien Slot wählen
5. Den Slot im Rack-Visualizer mit Patientenkürzel belegt sehen
6. Die Analyse starten und den Fortschrittsring am Slot sehen
7. Die Ergebnisse in der Pool-Karte sehen sobald die Messung fertig ist
8. Die Ergebnisse automatisch oder manuell ans MLMS senden
9. Die Ergebnisse sofort in der Auftrags-Detailansicht sehen, bereit für technische Validierung

Das alles auf Französisch und Arabisch, mit RTL-Unterstützung bei Arabisch.
