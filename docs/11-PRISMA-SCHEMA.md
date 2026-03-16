# 11-PRISMA-SCHEMA.md

# Prisma Schema – MLMS

## Ziel

Dieses Dokument definiert das **Prisma Schema** für das MLMS.

Es ist die verbindliche Grundlage für:

- PostgreSQL Datenmodell
- Prisma `schema.prisma`
- Migrationen
- Repositories
- Backend Persistence Layer
- Testdaten / Seeds

Das Schema muss konsistent sein mit:

- `04-DOMAIN-MODEL.md`
- `05-API-CONTRACTS.md`
- `02-BACKEND-STRUCTURE.md`

---

## Grundprinzipien

### 1. Domain zuerst
Das Prisma Schema folgt dem Domain Model und nicht umgekehrt.

### 2. Prisma ist Persistence, nicht Business-Logik
Geschäftsregeln wie Statusübergänge werden in Use Cases durchgesetzt, nicht nur in der Datenbank.

### 3. Explizite Relationen
Alle wichtigen Relationen werden explizit modelliert.

### 4. Stabile Enums
Feste Statuswerte werden als Prisma Enums modelliert.

### 5. Auditierbarkeit
Kritische Aktionen müssen in persistente Audit-Tabellen geschrieben werden.

### 6. Keine unnötigen Extras
Es werden nur Modelle aufgenommen, die für MVP und Kern-Domäne nötig sind.

---

## Dateipfad

Empfohlener Pfad:

```text
backend/prisma/schema.prisma
```

---

## Datenbankannahmen

- Datenbank: PostgreSQL 16
- ORM: Prisma
- Provider: `postgresql`

---

## Wichtige Modellierungsentscheidungen

### IDs
Alle Primärschlüssel sind `String` mit `cuid()`.

### Datumsfelder
- `createdAt` = `DateTime @default(now())`
- `updatedAt` = `DateTime @updatedAt`

### Birth / Expiry Dates
Wo es fachlich ein Datum ohne Uhrzeit ist, wird `@db.Date` verwendet.

### JSON Audit
`beforeJson` und `afterJson` werden als `Json` gespeichert.

### Snapshot-Prinzip bei Tests
`TestOrder` und `Result` speichern Testnamen FR/AR als Snapshot, damit spätere Katalogänderungen alte Befunde nicht verfälschen.

---

## Enthaltene Modelle

Pflichtmodelle:

- User
- Patient
- Order
- TestOrder
- Specimen
- Result
- Report
- Reagent
- ReagentLot
- StorageLocation
- AuditEntry
- TestDefinition

---

## Nicht in diesem MVP-Schema

Noch nicht enthalten:

- HL7 Tabellen
- FHIR Ressourcenpersistenz
- Billing / Insurance
- Multi-tenant Tabellen
- komplexe QC Tabellen
- Geräte-Importlogs
- dediziertes Patientenportal-Auth-Modell

Hinweis:
Das Patientenportal kann im MVP zunächst auf bestehender Backend-Logik aufsetzen.
Falls später persistente Portal-Credentials gebraucht werden, kommt dafür eine eigene Migration.

---

## Vollständige Datei: `backend/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider     = "postgresql"
  url          = env("DATABASE_URL")
  relationMode = "foreignKeys"
}

enum Language {
  FR
  AR
}

enum UserRole {
  RECEPTION
  TECHNICIAN
  PHYSICIAN
  ADMIN
}

enum Gender {
  M
  F
  O
}

enum OrderPriority {
  ROUTINE
  URGENT
  STAT
}

enum TestOrderPriority {
  ROUTINE
  URGENT
}

enum OrderStatus {
  PENDING
  COLLECTED
  ANALYZED
  VALIDATED
  PUBLISHED
  CANCELLED
}

enum SpecimenType {
  BLOOD
  URINE
  STOOL
  TISSUE
}

enum SpecimenStatus {
  COLLECTED
  RECEIVED
  PROCESSED
  DISPOSED
  REJECTED
}

enum ResultFlag {
  N
  H
  L
  HH
  LL
  CRITICAL
}

enum ReportStatus {
  DRAFT
  VALIDATED
  FINAL
  CORRECTED
  PUBLISHED
}

enum ReagentCategory {
  CHEMISTRY
  HEMATOLOGY
  IMMUNOLOGY
  MICROBIOLOGY
}

model User {
  id               String       @id @default(cuid())
  email            String       @unique
  passwordHash     String
  role             UserRole
  language         Language     @default(FR)
  isActive         Boolean      @default(true)
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  createdOrders    Order[]      @relation("OrderCreatedBy")
  measuredResults  Result[]     @relation("ResultMeasuredBy")
  validatedReports Report[]     @relation("ReportValidatedBy")
  signedReports    Report[]     @relation("ReportSignedBy")
  auditEntries     AuditEntry[] @relation("AuditActor")

  @@index([role])
  @@index([isActive])
}

model Patient {
  id         String    @id @default(cuid())
  firstName  String
  lastName   String
  birthDate  DateTime  @db.Date
  gender     Gender
  phone      String?
  email      String?
  address    String?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  orders     Order[]

  @@index([lastName])
  @@index([birthDate])
  @@index([email])
}

model Order {
  id            String      @id @default(cuid())
  patientId     String
  status        OrderStatus @default(PENDING)
  priority      OrderPriority
  createdBy     String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  patient       Patient     @relation(fields: [patientId], references: [id], onDelete: Restrict, onUpdate: Cascade)
  createdByUser User?       @relation("OrderCreatedBy", fields: [createdBy], references: [id], onDelete: SetNull, onUpdate: Cascade)

  tests         TestOrder[]
  specimens     Specimen[]
  reports       Report[]

  @@index([patientId])
  @@index([status])
  @@index([priority])
  @@index([createdBy])
  @@index([createdAt])
}

model TestOrder {
  id          String            @id @default(cuid())
  orderId      String
  testCode     String
  testNameFr   String
  testNameAr   String
  priority     TestOrderPriority
  notes        String?

  order        Order             @relation(fields: [orderId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  @@index([orderId])
  @@index([testCode])
  @@unique([orderId, testCode])
}

model Specimen {
  id             String          @id @default(cuid())
  orderId         String
  barcode         String          @unique
  type            SpecimenType
  status          SpecimenStatus  @default(COLLECTED)
  collectionTime  DateTime
  receivedAt      DateTime?
  notes           String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  order           Order           @relation(fields: [orderId], references: [id], onDelete: Restrict, onUpdate: Cascade)
  results         Result[]

  @@index([orderId])
  @@index([status])
  @@index([type])
  @@index([collectionTime])
}

model Result {
  id             String      @id @default(cuid())
  specimenId      String
  testCode        String
  testNameFr      String
  testNameAr      String
  value           String
  unit            String?
  referenceLow    Float?
  referenceHigh   Float?
  flag            ResultFlag
  measuredAt      DateTime
  measuredBy      String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  specimen        Specimen    @relation(fields: [specimenId], references: [id], onDelete: Restrict, onUpdate: Cascade)
  measuredByUser  User?       @relation("ResultMeasuredBy", fields: [measuredBy], references: [id], onDelete: SetNull, onUpdate: Cascade)

  @@index([specimenId])
  @@index([testCode])
  @@index([flag])
  @@index([measuredAt])
  @@index([measuredBy])
  @@unique([specimenId, testCode])
}

model Report {
  id               String       @id @default(cuid())
  orderId           String
  status            ReportStatus @default(DRAFT)
  commentsFr        String?
  commentsAr        String?
  validatedBy       String?
  validatedAt       DateTime?
  signedBy          String?
  signedAt          DateTime?
  publishedAt       DateTime?
  templateVersion   String
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt

  order             Order        @relation(fields: [orderId], references: [id], onDelete: Restrict, onUpdate: Cascade)
  validatedByUser   User?        @relation("ReportValidatedBy", fields: [validatedBy], references: [id], onDelete: SetNull, onUpdate: Cascade)
  signedByUser      User?        @relation("ReportSignedBy", fields: [signedBy], references: [id], onDelete: SetNull, onUpdate: Cascade)

  @@index([orderId])
  @@index([status])
  @@index([validatedBy])
  @@index([signedBy])
  @@index([publishedAt])
}

model Reagent {
  id             String           @id @default(cuid())
  name           String
  manufacturer   String
  catalogNumber  String?
  category       ReagentCategory
  storageTemp    String?
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt

  lots           ReagentLot[]

  @@index([name])
  @@index([manufacturer])
  @@index([category])
}

model ReagentLot {
  id               String     @id @default(cuid())
  reagentId         String
  lotNumber         String
  expiryDate        DateTime   @db.Date
  initialQuantity   Int
  currentQuantity   Int
  isBlocked         Boolean    @default(false)
  storageLocation   String?
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt

  reagent           Reagent    @relation(fields: [reagentId], references: [id], onDelete: Restrict, onUpdate: Cascade)

  @@index([reagentId])
  @@index([expiryDate])
  @@index([isBlocked])
  @@index([storageLocation])
  @@unique([reagentId, lotNumber])
}

model StorageLocation {
  id           String    @id @default(cuid())
  code         String    @unique
  name         String
  description  String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  @@index([name])
}

model AuditEntry {
  id           String    @id @default(cuid())
  actorUserId   String?
  action        String
  entityType    String
  entityId      String
  beforeJson    Json?
  afterJson     Json?
  createdAt     DateTime  @default(now())

  actorUser     User?     @relation("AuditActor", fields: [actorUserId], references: [id], onDelete: SetNull, onUpdate: Cascade)

  @@index([actorUserId])
  @@index([entityType, entityId])
  @@index([action])
  @@index([createdAt])
}

model TestDefinition {
  id             String    @id @default(cuid())
  code           String    @unique
  nameFr         String
  nameAr         String
  category       String
  unit           String?
  referenceLow   Float?
  referenceHigh  Float?
  isActive       Boolean   @default(true)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  @@index([category])
  @@index([isActive])
}
```

---

## Modell-Erklärung

## User
Speichert interne Mitarbeiterkonten.

Pflichtfelder:
- `email`
- `passwordHash`
- `role`
- `language`
- `isActive`

Beziehungen:
- kann Orders erstellen
- kann Results messen
- kann Reports validieren
- kann Reports signieren
- kann Audit-Aktionen auslösen

---

## Patient
Speichert Stammdaten des Patienten.

Pflichtfelder:
- `firstName`
- `lastName`
- `birthDate`
- `gender`

Optionale Felder:
- `phone`
- `email`
- `address`

Beziehung:
- ein Patient hat viele Orders

---

## Order
Repräsentiert einen Laborauftrag.

Pflichtfelder:
- `patientId`
- `status`
- `priority`

Beziehungen:
- gehört zu einem Patient
- kann viele `TestOrder`
- kann viele `Specimen`
- kann viele `Report`

Hinweis:
Mehrere Reports pro Order sind erlaubt, damit Korrekturen oder neue Versionen später sauber modellierbar bleiben.

---

## TestOrder
Speichert die angeforderten Tests innerhalb einer Order.

Warum eigenes Modell:
- eine Order enthält mehrere Tests
- Testnamen werden als Snapshot gespeichert
- Priorität pro Test kann separat gepflegt werden

Wichtige Regel:
- `@@unique([orderId, testCode])`

Damit wird derselbe Test im MVP nicht doppelt in derselben Order angelegt.

---

## Specimen
Speichert die konkrete Probe.

Pflichtfelder:
- `orderId`
- `barcode`
- `type`
- `status`
- `collectionTime`

Wichtige Regel:
- `barcode` ist global eindeutig

---

## Result
Speichert Laborergebnisse je Probe und Test.

Pflichtfelder:
- `specimenId`
- `testCode`
- `value`
- `flag`
- `measuredAt`

Wichtige Regel:
- `@@unique([specimenId, testCode])`

Damit gibt es im MVP pro Probe und Test genau ein Result.
Wenn später Wiederholungsmessungen nötig sind, kann dies über ein separates Revisionsmodell erweitert werden.

---

## Report
Speichert medizinische Befunde.

Pflichtfelder:
- `orderId`
- `status`
- `templateVersion`

Optionale Felder:
- `commentsFr`
- `commentsAr`
- `validatedBy`
- `validatedAt`
- `signedBy`
- `signedAt`
- `publishedAt`

Hinweis:
Die Statuslogik wird fachlich im Use Case durchgesetzt.
Die Datenbank speichert den Zustand, aber validiert nicht die komplette medizinische Prozesslogik.

---

## Reagent
Stammdaten eines Reagenzes.

Pflichtfelder:
- `name`
- `manufacturer`
- `category`

Beziehung:
- ein Reagenz hat viele Lots

---

## ReagentLot
Speichert konkrete Chargen eines Reagenzes.

Pflichtfelder:
- `reagentId`
- `lotNumber`
- `expiryDate`
- `initialQuantity`
- `currentQuantity`

Wichtige Regel:
- `@@unique([reagentId, lotNumber])`

Hinweis:
`currentQuantity >= 0` wird im Use Case geprüft.
Prisma kann diese fachliche Regel nicht allein zuverlässig für alle Mutationen ausdrücken.

---

## StorageLocation
Separates Modell für Lagerorte.

Im MVP ist `ReagentLot.storageLocation` noch ein einfacher String-Snapshot.
`StorageLocation` bleibt trotzdem im Schema, damit spätere Normalisierung ohne Strukturbruch vorbereitet ist.

---

## AuditEntry
Speichert unveränderliche Nachvollziehbarkeit.

Pflichtfelder:
- `action`
- `entityType`
- `entityId`
- `createdAt`

Optionale Felder:
- `actorUserId`
- `beforeJson`
- `afterJson`

Beispiele:
- RESULT_CREATED
- RESULT_UPDATED
- REPORT_VALIDATED
- REPORT_SIGNED
- REPORT_PUBLISHED
- REAGENT_CONSUMED
- USER_ROLE_CHANGED

---

## TestDefinition
Speichert Testkatalog-Daten.

Warum separat:
- Orders und Results speichern Snapshots
- der Katalog kann sich trotzdem weiterentwickeln
- inaktive Tests bleiben historisch erhalten

Pflichtfelder:
- `code`
- `nameFr`
- `nameAr`
- `category`
- `isActive`

---

## Index-Strategie

Die wichtigsten Indizes sind bereits im Schema enthalten.

Besonders wichtig:
- Foreign-Key Felder
- Statusfelder
- Suchfelder
- Audit-Zeitstempel
- Barcode
- E-Mail
- Testcode

---

## Warum keine Soft Deletes im MVP

Für das MVP werden keine `deletedAt` Felder eingeführt.

Gründe:
- medizinische Prozesse sollen primär über Status abgebildet werden
- Orders werden storniert, nicht logisch gelöscht
- geringere Komplexität im ersten Release

Wenn später Soft Deletes nötig werden, kann dies gezielt ergänzt werden.

---

## Warum `Float` für Referenzbereiche

`referenceLow` und `referenceHigh` werden im MVP als `Float` gespeichert.

Gründe:
- ausreichend für typische Labor-Referenzbereiche
- einfaches Mapping zu TypeScript `number`
- geringere Komplexität als Prisma `Decimal`

Wenn später sehr präzise numerische Fachwerte nötig werden, kann auf `Decimal` migriert werden.

---

## Warum Reports nicht per `@unique(orderId)` eingeschränkt sind

Ein Order kann im MVP zwar typischerweise genau einen aktiven Report haben, aber die Domäne erlaubt spätere Korrekturen und Versionen.

Deshalb:
- kein `@unique(orderId)` auf `Report`
- Versionierung und Korrekturen bleiben möglich

Die aktive Reportlogik wird später im Use Case entschieden.

---

## Prisma Migration Reihenfolge

Empfohlen:

1. Schema schreiben
2. Migration erzeugen
3. Prisma Client generieren
4. Seed ausführen
5. Anwendung starten

---

## Empfohlene Commands

```bash
npx prisma format
npx prisma validate
npx prisma migrate dev --name init
npx prisma generate
```

In Docker:

```bash
docker compose exec backend npx prisma format
docker compose exec backend npx prisma validate
docker compose exec backend npx prisma migrate dev --name init
docker compose exec backend npx prisma generate
```

---

## Seed-Empfehlung

Für das MVP sollen mindestens diese Seeds angelegt werden:

### Users
- 1 ADMIN
- 1 RECEPTION
- 1 TECHNICIAN
- 1 PHYSICIAN

### TestDefinitions
- HGB
- WBC
- RBC
- PLT
- GLU
- CRE
- UREA
- CRP
- HBA1C
- CHOL
- TG

### StorageLocations
- FRIDGE-A
- ROOM-SHELF-1

### Reagents
- Beispiel Reagenz Biochemie
- Beispiel Lot

---

## Mapping zu Domain und Contracts

## Direkte 1:1 Modelle
Diese Modelle mappen fast direkt:
- User
- Patient
- Order
- TestOrder
- Specimen
- Result
- Report
- Reagent
- ReagentLot
- AuditEntry
- TestDefinition

## Leicht abweichend in Persistence
### StorageLocation
Im Domain-Modell existiert `StorageLocation` als Entity.
Im MVP bleibt `ReagentLot.storageLocation` trotzdem zunächst ein String-Snapshot.

Das ist bewusst pragmatisch:
- API bleibt einfach
- Lagerorte können später normalisiert werden
- MVP wird nicht unnötig komplex

---

## Validierungen außerhalb von Prisma

Diese Regeln müssen in Use Cases oder Domain Services geprüft werden:

### Patient
- Name nicht leer
- `birthDate` nicht in der Zukunft

### Order
- mindestens ein Test
- gültiger Patient
- erlaubter Statuswechsel

### Specimen
- erlaubter Statuswechsel
- Barcode fachlich korrekt erzeugt

### Result
- `value` vorhanden
- `flag` vorhanden

### Report
- nicht validieren ohne Results
- nicht signieren ohne Validierung
- nicht publizieren ohne Finalisierung

### ReagentLot
- `currentQuantity >= 0`
- Lot nicht abgelaufen
- Lot nicht blockiert beim Verbrauch

---

## Beispiel Seed-Datei Struktur

```text
backend/prisma/
├── schema.prisma
├── migrations/
└── seed.ts
```

---

## Beispiel `package.json` Scripts

```json
{
  "scripts": {
    "prisma:format": "prisma format",
    "prisma:validate": "prisma validate",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:studio": "prisma studio",
    "seed": "ts-node prisma/seed.ts"
  }
}
```

---

## MVP Definition of Done

Dieses Prisma-Dokument ist korrekt umgesetzt, wenn:

- `backend/prisma/schema.prisma` existiert
- alle Enums vorhanden sind
- alle Kernmodelle vorhanden sind
- Relationen korrekt gesetzt sind
- Migration `init` erzeugt werden kann
- Prisma Client generiert werden kann
- Seed-Datei mit Basisdaten laufen kann
- Backend-Repositories auf dieses Schema zugreifen können

---

## Claude Code Prompt für dieses Prisma-File

```text
LIES DIESES KOMPLETTE DOKUMENT `11-PRISMA-SCHEMA.md`.

Erstelle daraus die Datei `backend/prisma/schema.prisma` exakt nach Dokumentation.

WICHTIGE REGELN:
1. Verwende PostgreSQL.
2. Nutze Prisma Enums für feste Statuswerte.
3. Implementiere alle Modelle und Relationen exakt wie beschrieben.
4. Nutze `String @id @default(cuid())` für IDs.
5. Nutze `createdAt` und `updatedAt` konsistent.
6. Füge die definierten Indizes und Unique Constraints hinzu.
7. Erzeuge danach:
   - `prisma format`
   - `prisma validate`
   - eine erste Migration
8. Erzeuge zusätzlich eine einfache `prisma/seed.ts` Grundlage.

Liefere:
- `backend/prisma/schema.prisma`
- ggf. `backend/prisma/seed.ts`
- kurze Liste potenzieller Stellen, an denen Use Cases zusätzliche fachliche Validierung erzwingen müssen
```

---
