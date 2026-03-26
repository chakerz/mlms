# 04-DOMAIN-MODEL.md

# Domain Model – MLMS

## Ziel

Dieses Dokument definiert das **fachliche Domänenmodell** des MLMS.

Es beschreibt:

- die zentralen fachlichen Entitäten
- ihre Felder
- Statusmodelle
- Beziehungen
- Geschäftsregeln
- Use Cases
- Validierungsregeln
- Verantwortlichkeiten

Dieses Dokument ist die fachliche Grundlage für Backend, Frontend, Datenbank und API Contracts.

---

## Grundprinzipien

### 1. Die Domäne ist fachlich, nicht technisch
Dieses Dokument beschreibt das Geschäft des medizinischen Labor-Management-Systems.

### 2. Die Domäne ist framework-unabhängig
Keine NestJS-, React- oder Prisma-spezifischen Regeln gehören in die Domäne.

### 3. Die Domäne ist die zentrale Wahrheit
Alle anderen Schichten müssen sich an dieses Modell halten.

### 4. Änderungen an Entities müssen bewusst erfolgen
Wenn Felder oder Status angepasst werden, müssen Backend, Frontend, DTOs und Übersetzungen synchron nachgezogen werden.

---

## Fachliche Hauptbereiche

Das MLMS besteht fachlich aus folgenden Bereichen:

1. User / Auth
2. Patient
3. Order
4. Specimen
5. Result
6. Report
7. Reagent
8. Inventory
9. Patient Portal
10. Audit / Traceability

---

## 1. User

## Zweck
Ein User ist ein Mitarbeiter oder Systemnutzer mit einer klaren Rolle.

## Entity: User

```typescript
type UserRole = 'RECEPTION' | 'TECHNICIAN' | 'PHYSICIAN' | 'ADMIN';
type Language = 'FR' | 'AR';

interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  language: Language;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Regeln
- `email` muss eindeutig sein.
- `passwordHash` darf niemals im Frontend sichtbar sein.
- `role` bestimmt die erlaubten Aktionen.
- `language` steuert FR oder AR.
- deaktivierte User dürfen sich nicht anmelden.

---

## 2. Patient

## Zweck
Ein Patient ist die Person, für die Laboranalysen angefordert und Befunde erstellt werden.

## Entity: Patient

```typescript
type Gender = 'M' | 'F' | 'O';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: Gender;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## Pflichtfelder
- id
- firstName
- lastName
- birthDate
- gender
- createdAt
- updatedAt

## Optionale Felder
- phone
- email
- address

## Regeln
- `firstName` und `lastName` dürfen nicht leer sein.
- `birthDate` darf nicht in der Zukunft liegen.
- `phone`, wenn vorhanden, soll für Marokko gültig sein.
- `email`, wenn vorhanden, muss ein gültiges Format haben.
- ein Patient kann mehrere Orders haben.

---

## 3. Order

## Zweck
Eine Order ist ein Laborauftrag für einen Patienten.

## Entity: Order

```typescript
type OrderPriority = 'ROUTINE' | 'URGENT' | 'STAT';
type OrderStatus =
  | 'PENDING'
  | 'COLLECTED'
  | 'ANALYZED'
  | 'VALIDATED'
  | 'PUBLISHED'
  | 'CANCELLED';

interface Order {
  id: string;
  patientId: string;
  status: OrderStatus;
  priority: OrderPriority;
  createdBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
  tests: TestOrder[];
}
```

## Entity: TestOrder

```typescript
interface TestOrder {
  id: string;
  orderId: string;
  testCode: string;
  testNameFr: string;
  testNameAr: string;
  priority: 'ROUTINE' | 'URGENT';
  notes?: string | null;
}
```

## Regeln
- eine Order gehört genau einem Patient.
- eine Order muss mindestens einen Test enthalten.
- `status` startet immer mit `PENDING`.
- `priority` muss gesetzt sein.
- `createdBy` enthält optional den Mitarbeiter.
- eine stornierte Order darf nicht weiter verarbeitet werden.

---

## 4. Specimen

## Zweck
Ein Specimen ist die konkrete Probe, die aus einer Order hervorgeht.

## Entity: Specimen

```typescript
type SpecimenType = 'BLOOD' | 'URINE' | 'STOOL' | 'TISSUE';
type SpecimenStatus =
  | 'COLLECTED'
  | 'RECEIVED'
  | 'PROCESSED'
  | 'DISPOSED'
  | 'REJECTED';

interface Specimen {
  id: string;
  orderId: string;
  barcode: string;
  type: SpecimenType;
  status: SpecimenStatus;
  collectionTime: Date;
  receivedAt?: Date | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## Regeln
- ein Specimen gehört zu genau einer Order.
- `barcode` muss eindeutig sein.
- `collectionTime` ist Pflicht.
- `status` startet typischerweise mit `COLLECTED`.
- ein Specimen kann abgelehnt werden (`REJECTED`), z. B. bei schlechter Qualität.
- ein Specimen kann mehrere Results haben.

---

## 5. Result

## Zweck
Ein Result repräsentiert den Laborwert eines Tests für ein Specimen.

## Entity: Result

```typescript
type ResultFlag = 'N' | 'H' | 'L' | 'HH' | 'LL' | 'CRITICAL';

interface Result {
  id: string;
  specimenId: string;
  testCode: string;
  testNameFr: string;
  testNameAr: string;
  value: string;
  unit?: string | null;
  referenceLow?: number | null;
  referenceHigh?: number | null;
  flag: ResultFlag;
  measuredAt: Date;
  measuredBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## Regeln
- ein Result gehört zu genau einem Specimen.
- `value` ist Pflicht.
- `flag` muss immer gesetzt sein.
- `measuredAt` ist Pflicht.
- `referenceLow` und `referenceHigh` sind optional.
- `testCode` muss eindeutig zum Test passen.
- kritische Werte müssen nachvollziehbar markiert werden.

---

## 6. Report

## Zweck
Ein Report ist der medizinische Befund, der aus den Results einer Order entsteht.

## Entity: Report

```typescript
type ReportStatus =
  | 'DRAFT'
  | 'VALIDATED'
  | 'FINAL'
  | 'CORRECTED'
  | 'PUBLISHED';

interface Report {
  id: string;
  orderId: string;
  status: ReportStatus;
  commentsFr?: string | null;
  commentsAr?: string | null;
  validatedBy?: string | null;
  validatedAt?: Date | null;
  signedBy?: string | null;
  signedAt?: Date | null;
  publishedAt?: Date | null;
  templateVersion: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Regeln
- ein Report gehört zu genau einer Order.
- `status` startet mit `DRAFT`.
- ein Report darf erst validiert werden, wenn Results vorliegen.
- ein Report darf erst signiert werden, wenn er validiert wurde.
- ein Report darf erst publiziert werden, wenn er final ist.
- `commentsFr` und `commentsAr` sind getrennt zu verwalten.
- Änderungen an publizierten Reports müssen nachvollziehbar sein.

---

## 7. Reagent

## Zweck
Ein Reagent ist ein Laborreagenz, das bei Tests verwendet wird.

## Entity: Reagent

```typescript
type ReagentCategory =
  | 'CHEMISTRY'
  | 'HEMATOLOGY'
  | 'IMMUNOLOGY'
  | 'MICROBIOLOGY';

interface Reagent {
  id: string;
  name: string;
  manufacturer: string;
  catalogNumber?: string | null;
  category: ReagentCategory;
  storageTemp?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## Regeln
- Name ist Pflicht.
- Kategorie ist Pflicht.
- Hersteller ist Pflicht.
- ein Reagent kann mehrere Lots haben.

---

## 8. ReagentLot

## Zweck
Ein ReagentLot repräsentiert eine konkrete Charge eines Reagenzes.

## Entity: ReagentLot

```typescript
interface ReagentLot {
  id: string;
  reagentId: string;
  lotNumber: string;
  expiryDate: Date;
  initialQuantity: number;
  currentQuantity: number;
  isBlocked: boolean;
  storageLocation?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## Regeln
- `lotNumber` ist pro Reagenz eindeutig.
- `expiryDate` ist Pflicht.
- `initialQuantity` ist Pflicht.
- `currentQuantity` darf nicht negativ sein.
- blockierte Lots dürfen nicht verbraucht werden.
- abgelaufene Lots dürfen nicht verwendet werden.

---

## 9. StorageLocation

## Zweck
Beschreibt Lagerorte für Reagenzien oder Proben.

## Entity: StorageLocation

```typescript
interface StorageLocation {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## Regeln
- `code` muss eindeutig sein.
- `name` ist Pflicht.

---

## 10. AuditEntry

## Zweck
Audit-Einträge sorgen für Nachvollziehbarkeit medizinisch relevanter Aktionen.

## Entity: AuditEntry

```typescript
interface AuditEntry {
  id: string;
  actorUserId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  beforeJson?: string | null;
  afterJson?: string | null;
  createdAt: Date;
}
```

## Regeln
- Audit-Einträge werden nicht verändert.
- jede kritische Aktion erzeugt einen Audit-Eintrag.
- besonders wichtig bei Results, Reports und Rollenänderungen.

---

## Beziehungen zwischen Entitäten

```text
User
 ├── erstellt Patients, Orders, Results, Reports
 └── validiert/signiert Reports

Patient
 └── hat viele Orders

Order
 ├── gehört zu einem Patient
 ├── hat viele TestOrders
 ├── hat viele Specimens
 └── hat einen oder mehrere Reports

Specimen
 ├── gehört zu einer Order
 └── hat viele Results

Result
 └── gehört zu einem Specimen

Report
 └── gehört zu einer Order

Reagent
 └── hat viele ReagentLots

ReagentLot
 └── gehört zu einem Reagent
```

---

## Statusmaschinen

## OrderStatus

```text
PENDING -> COLLECTED -> ANALYZED -> VALIDATED -> PUBLISHED
PENDING -> CANCELLED
COLLECTED -> CANCELLED
```

## Regeln
- `ANALYZED` nur wenn Results vorliegen
- `VALIDATED` nur wenn Report validiert wurde
- `PUBLISHED` nur wenn Report publiziert wurde
- `CANCELLED` beendet den Prozess

---

## SpecimenStatus

```text
COLLECTED -> RECEIVED -> PROCESSED -> DISPOSED
COLLECTED -> REJECTED
RECEIVED -> REJECTED
```

---

## ReportStatus

```text
DRAFT -> VALIDATED -> FINAL -> PUBLISHED
PUBLISHED -> CORRECTED
```

## Regeln
- `VALIDATED` setzt Laborarztprüfung voraus
- `FINAL` bedeutet signiert/finalisiert
- `PUBLISHED` macht den Report sichtbar
- `CORRECTED` kennzeichnet nachträgliche Korrektur

---

## Fachliche Validierungsregeln

## Patient
- Name darf nicht leer sein
- Geburtsdatum darf nicht in der Zukunft liegen

## Order
- mindestens ein Test
- gültiger Patient
- gültige Priorität

## Specimen
- Barcode eindeutig
- Typ muss bekannt sein
- Statuswechsel nur in erlaubter Richtung

## Result
- Wert muss vorhanden sein
- Flag muss gesetzt sein
- Result darf nicht ohne Specimen existieren

## Report
- darf nicht ohne Order existieren
- darf nicht validiert werden ohne Results
- darf nicht publiziert werden ohne Finalisierung

## ReagentLot
- currentQuantity >= 0
- nicht abgelaufen
- nicht blockiert beim Verbrauch

---

## Katalog-Entitäten

Ein Testkatalog wird für Orders und Results benötigt.

## Entity: TestDefinition

```typescript
interface TestDefinition {
  id: string;
  code: string;
  nameFr: string;
  nameAr: string;
  category: string;
  unit?: string | null;
  referenceLow?: number | null;
  referenceHigh?: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Regeln
- `code` muss eindeutig sein
- FR und AR Namen sind Pflicht
- inaktive Tests dürfen nicht mehr bestellt werden

---

## Zentrale Use Cases

## Auth / User
- RegisterUser
- Login
- GetCurrentUser
- ChangeUserLanguage
- DisableUser

## Patient
- RegisterPatient
- UpdatePatient
- GetPatientById
- ListPatients
- SearchPatients

## Order
- CreateOrder
- GetOrderById
- ListOrders
- UpdateOrderStatus
- CancelOrder

## Specimen
- CreateSpecimen
- GetSpecimenById
- UpdateSpecimenStatus
- PrintBarcode

## Result
- RecordResult
- UpdateResult
- ListResultsBySpecimen
- ListResultsByOrder

## Report
- GenerateReport
- GetReportById
- ListReports
- ValidateReport
- SignReport
- PublishReport
- CorrectReport

## Reagent
- CreateReagent
- ListReagents
- ReceiveReagentLot
- ListReagentLots
- ConsumeReagentForTest
- BlockReagentLot
- UnblockReagentLot

## Portal
- GetPatientPortalReports
- GetPatientPortalReportById
- DownloadPatientReportPdf

---

## Kritische Geschäftsregeln

### 1. Results vor Report
Ein Report darf nicht erzeugt oder validiert werden, wenn noch keine verwertbaren Results vorhanden sind.

### 2. Validation vor Signatur
Nur validierte Reports dürfen signiert werden.

### 3. Signatur vor Publikation
Nur finalisierte Reports dürfen veröffentlicht werden.

### 4. Kritische Werte markieren
`CRITICAL` Ergebnisse müssen sichtbar hervorgehoben werden.

### 5. Reagenzverbrauch prüfen
Nur verfügbare, nicht blockierte und nicht abgelaufene Lots dürfen verbraucht werden.

### 6. Patientensicht nur für publizierte Reports
Patientenportal zeigt nur publizierte Reports.

### 7. Korrekturen nachvollziehbar machen
Jede Report-Korrektur muss als Audit-Ereignis gespeichert werden.

---

## Minimaler Workflow – fachlich

```text
1. User loggt sich ein
2. Reception legt Patient an
3. Reception legt Order mit Tests an
4. Technician legt Specimen an
5. Technician erfasst Results
6. System / Physician generiert Report
7. Physician validiert Report
8. Physician signiert/finalisiert Report
9. System veröffentlicht Report
10. Patient sieht Report im Portal
```

---

## Minimale Pflichtfelder pro MVP

## User
- id
- email
- passwordHash
- role
- language
- isActive

## Patient
- id
- firstName
- lastName
- birthDate
- gender

## Order
- id
- patientId
- status
- priority
- createdAt

## TestOrder
- id
- orderId
- testCode
- testNameFr
- testNameAr

## Specimen
- id
- orderId
- barcode
- type
- status
- collectionTime

## Result
- id
- specimenId
- testCode
- value
- flag
- measuredAt

## Report
- id
- orderId
- status
- templateVersion

## Reagent
- id
- name
- manufacturer
- category

## ReagentLot
- id
- reagentId
- lotNumber
- expiryDate
- currentQuantity

---

## Frontend-Sicht auf die Domäne

Das Frontend muss mindestens diese fachlichen Ansichten besitzen:

- PatientList
- PatientDetail
- OrderCreate
- OrderDetail
- SpecimenList
- ResultEntry
- ReportValidationQueue
- ReportDetail
- ReagentList
- InventoryDashboard
- PatientPortalReports

---

## Backend-Sicht auf die Domäne

Das Backend muss mindestens diese Domänen logisch unterstützen:

- User Auth
- Patientverwaltung
- Orderverwaltung
- Probenverwaltung
- Result-Verwaltung
- Report-Prozess
- Reagenzverwaltung
- Portal-Auslieferung

---

---

## 11. Instrument (Machine Communication)

## Zweck
Die Instrument-Domäne stellt die Integrationsschicht zwischen dem MLMS und Laboranalysegeräten dar. Sie trennt sauber zwischen Business-Logik und maschinenspezifischen Protokollen.

## Entities

### Instrument
Stammdaten eines Analysegeräts.
- `code` — eindeutiger Gerätecode
- `protocolType` — HL7 | ASTM | VENDOR_CUSTOM | FILE_IMPORT | FILE_EXPORT
- `transportType` — TCP | SERIAL | FILE_SYSTEM
- `directionMode` — UNIDIRECTIONAL | BIDIRECTIONAL

### InstrumentConnection
Technische Verbindungsparameter (Host, Port, Serial, Datei-Pfade, Timeouts, Retry-Limit).

### InstrumentTestMapping
Mapping zwischen internen Testcodes (MLMS) und maschinenspezifischen Testcodes.

### InstrumentOrderOutbox
Ausgehende Auftragsqueue an Geräte. Status: PENDING → READY_TO_SEND → SENT → ACK_RECEIVED / FAILED / RETRY_SCHEDULED / CANCELLED.

### InstrumentResultInbox
Eingehende Nachrichten von Geräten (Rohdaten). matchingStatus: UNMATCHED → MATCHED_BY_SAMPLE_ID / MATCHED_BY_BARCODE / MATCHED_BY_FALLBACK_RULE / AMBIGUOUS / FAILED. importStatus: RECEIVED → PARSED → MATCHED → IMPORTED / PARTIALLY_IMPORTED / ERROR / IGNORED.

### InstrumentRawResult
Einzelne Rohresultate nach Parsing und Matching. Status: RAW_RECEIVED → MAPPED → PENDING_REVIEW → ACCEPTED_TECHNICALLY / REJECTED_TECHNICALLY → FOR_VALIDATION → VALIDATED.

### InstrumentMessageAudit
Unveränderlicher Audit-Log aller Kommunikationsschritte (OUTBOUND/INBOUND).

## Regeln
- Maschinenresultate dürfen niemals automatisch als validierte Laborwerte gelten.
- Rohpayloads werden niemals gelöscht.
- Jede Kommunikation erzeugt einen Audit-Eintrag.
- Neue Geräte und Protokolle werden über den Adapter-Mechanismus ergänzt, ohne Kerncode zu ändern.

---

## Dinge, die absichtlich noch nicht im MVP sind

Diese Punkte können später ergänzt werden:

- automatische Geräteintegration HL7 *(Basisarchitektur vorhanden, Protokoll-Adapter ausstehend)*
- komplexe QC-Module
- Abrechnung/Insurance
- Multi-Lab Mandantenfähigkeit
- KI-Kommentare
- externe Arztportale
- SMS / WhatsApp Benachrichtigungen
- fortgeschrittene Statistik

---

## Domain-Definition of Done

Dieses Dokument ist korrekt umgesetzt, wenn:

- alle Entities im Backend vorhanden sind
- Statusmodelle konsistent sind
- Beziehungen sauber modelliert sind
- Backend und Frontend dieselben Feldnamen verwenden
- API Contracts mit diesem Modell übereinstimmen
- Prisma Schema mit diesem Modell kompatibel ist

---

## Claude Code Prompt für dieses Domain-File

```text
LIES DIESES KOMPLETTE DOKUMENT 04-DOMAIN-MODEL.md.

Nutze dieses Dokument als zentrale fachliche Wahrheit.

REGELN:
1. Erstelle keine Felder, die hier nicht definiert sind, außer technisch zwingende IDs oder Timestamps.
2. Nutze dieselben Feldnamen in Backend, Frontend und Contracts.
3. Implementiere Statusmodelle exakt wie beschrieben.
4. Halte alle Beziehungen konsistent.
5. Nutze FR und AR Testnamen dort, wo Tests im UI erscheinen.
6. Berücksichtige die fachlichen Validierungsregeln in Use Cases und Formularen.

Verwende dieses Dokument als Basis für:
- Prisma Schema
- Domain Entities
- DTOs
- Frontend Types
- UI Statusdarstellung
- API Endpoints
```

---
