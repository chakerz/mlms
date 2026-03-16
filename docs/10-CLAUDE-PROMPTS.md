# 10-CLAUDE-PROMPTS.md

# Claude Code Prompts – MLMS

## Ziel

Dieses Dokument sammelt die **besten Arbeits-Prompts** für Claude Code, um das MLMS sauber, reproduzierbar und ohne Strukturabweichungen umzusetzen.

Die Prompts sind so aufgebaut, dass Claude Code:

- zuerst die Dokumentation liest
- dann nur den geforderten Scope umsetzt
- keine Architekturregeln verletzt
- in kleinen, kontrollierbaren Schritten arbeitet
- lauffähige Ergebnisse liefert
- Prisma Schema und OpenAPI immer synchron hält

Dieses Dokument ist die zentrale Arbeitsgrundlage für:

- Initial-Setup
- Backend-Implementierung
- Frontend-Implementierung
- Contracts
- Prisma
- OpenAPI
- i18n
- Docker
- Debugging
- Refactoring
- Sprint-Arbeit
- finalen MVP-Feinschliff

---

## Grundprinzipien für gute Prompts

### 1. Immer mit Dokumenten arbeiten
Claude Code soll nie frei improvisieren, wenn bereits Projekt-Dokumente existieren.

### 2. Scope klar begrenzen
Jeder Prompt soll genau sagen, was umgesetzt werden darf und was nicht.

### 3. Konkrete Deliverables nennen
Jeder Prompt muss genaue Dateien, Module oder Endpunkte benennen.

### 4. Lauffähigkeit verlangen
Claude Code soll nicht nur Code erzeugen, sondern ein ausführbares Ergebnis.

### 5. Keine stillen Architekturänderungen
Ordnerstruktur, Feldnamen, Statusmodelle, Prisma-Schema und OpenAPI dürfen nicht ohne ausdrückliche Anweisung verändert werden.

### 6. Dokumente mit Abhängigkeiten lesen
Wenn ein Bereich Persistenz betrifft, muss `11-PRISMA-SCHEMA.md` gelesen werden.
Wenn ein Bereich Endpunkte betrifft, muss `12-OPENAPI.md` gelesen werden.

---

## Globale Arbeitsregeln

Diesen Block kannst du als Präambel vor fast jeden Claude-Code-Prompt setzen.

```text
Du arbeitest an einem Projekt namens MLMS (Medical Laboratory Management System).

WICHTIGE REGELN:
1. Lies zuerst die relevanten Dateien unter `docs/`.
2. Halte dich strikt an die dort definierten Strukturen, Feldnamen und Statusmodelle.
3. Erfinde keine alternativen Ordnernamen.
4. Ändere keine API-Feldnamen.
5. Implementiere keine neuen Features außerhalb des angeforderten Scopes.
6. Halte Backend, Frontend, Contracts, Prisma und OpenAPI konsistent.
7. Wenn du Persistenz änderst, prüfe `11-PRISMA-SCHEMA.md` und aktualisiere Prisma bei Bedarf.
8. Wenn du Endpunkte oder DTOs änderst, prüfe `12-OPENAPI.md` und aktualisiere die API-Doku.
9. Achte darauf, dass das Projekt lokal in Docker lauffähig bleibt.
10. Bevorzuge kleine, klare, überprüfbare Änderungen.
11. Wenn etwas unklar ist, orientiere dich an den vorhandenen Dokumenten statt neue Architektur zu erfinden.
12. Am Ende liefere eine kurze Liste:
   - Welche Dateien erstellt/geändert wurden
   - Was jetzt funktioniert
   - Was noch offen ist
   - Ob Prisma Schema oder OpenAPI angepasst wurden
```

---

## Empfohlene Dokument-Reihenfolge

Diese Reihenfolge ist die logische Lesereihenfolge für Claude Code:

```text
1. 01-PROJECT-OVERVIEW.md
2. 02-BACKEND-STRUCTURE.md
3. 03-FRONTEND-STRUCTURE.md
4. 04-DOMAIN-MODEL.md
5. 05-API-CONTRACTS.md
6. 06-I18N.md
7. 07-DOCKER.md
8. 08-MEDICAL-TERMS.md
9. 11-PRISMA-SCHEMA.md
10. 12-OPENAPI.md
11. 09-MVP-CHECKLIST.md
12. 10-CLAUDE-PROMPTS.md
```

---

## 1. Master Prompt – komplettes Projekt

Diesen Prompt verwendest du, wenn Claude Code das Projekt von Grund auf aufbauen soll.

```text
LIES ALLE DOKUMENTE unter `docs/` vollständig.

Wichtige Dateien in dieser Reihenfolge:
- 01-PROJECT-OVERVIEW.md
- 02-BACKEND-STRUCTURE.md
- 03-FRONTEND-STRUCTURE.md
- 04-DOMAIN-MODEL.md
- 05-API-CONTRACTS.md
- 06-I18N.md
- 07-DOCKER.md
- 08-MEDICAL-TERMS.md
- 11-PRISMA-SCHEMA.md
- 12-OPENAPI.md
- 09-MVP-CHECKLIST.md

AUFGABE:
Erstelle das MLMS als monorepo-artiges Projekt mit:
- `backend/`
- `frontend/`
- `contracts/`
- `docs/`

REGELN:
1. Implementiere zuerst das MVP.
2. Halte dich exakt an die definierte Struktur.
3. Verwende:
   - Backend: Node.js + NestJS + Prisma + PostgreSQL
   - Frontend: React 18 + Vite + TypeScript
   - Contracts: gemeinsames TypeScript DTO Package
   - i18n: FR + AR mit RTL
   - Auth: JWT + RBAC
   - OpenAPI / Swagger für API-Dokumentation
4. Implementiere nur Features, die im MVP enthalten sind.
5. Arbeite phasenweise gemäß `09-MVP-CHECKLIST.md`.
6. Stelle sicher, dass Docker lokal funktioniert.
7. Erzeuge keine alternative Architektur.
8. Halte `backend/prisma/schema.prisma` und `backend/openapi/mlms.openapi.yaml` konsistent mit dem Code.

ARBEITSREIHENFOLGE:
1. Docker + Grundstruktur
2. Contracts
3. Prisma Schema
4. OpenAPI Grundstruktur
5. Backend Fundament
6. Frontend Fundament
7. Auth
8. Patient
9. Order
10. Specimen
11. Result
12. Report
13. Portal
14. Reagent Basic
15. Audit + Tests + Feinschliff

LIEFERE AM ENDE:
- vollständige Projektstruktur
- lauffähige Docker-Umgebung
- MVP Module
- Prisma Schema
- OpenAPI Spec
- kurze Statusübersicht pro Phase
```

---

## 2. Projekt-Setup Prompt

Diesen Prompt verwendest du nur für die Basisstruktur.

```text
LIES:
- `docs/02-BACKEND-STRUCTURE.md`
- `docs/03-FRONTEND-STRUCTURE.md`
- `docs/05-API-CONTRACTS.md`
- `docs/07-DOCKER.md`
- `docs/11-PRISMA-SCHEMA.md`
- `docs/12-OPENAPI.md`

AUFGABE:
Erstelle nur das Grundgerüst des Projekts, noch ohne vollständige Fachlogik.

ERZEUGE:
- Root-Struktur
- `backend/`
- `frontend/`
- `contracts/`
- `backend/prisma/`
- `backend/openapi/`
- `docker-compose.yml`
- `.env.example`
- `Makefile`

REGELN:
1. Erzeuge alle Ordner exakt wie dokumentiert.
2. Erzeuge Platzhalterdateien dort, wo nötig.
3. Stelle sicher, dass `docker compose up -d` grundsätzlich ausführbar vorbereitet ist.
4. Implementiere noch keine vollständigen Business-Use-Cases.
5. Lege package.json Dateien so an, dass spätere Erweiterung sauber möglich ist.

LIEFERE:
- vollständige Grundstruktur
- alle Basis-Konfigurationsdateien
- kurze Erklärung, was bereits bootfähig ist
```

---

## 3. Docker Prompt

```text
LIES:
- `docs/07-DOCKER.md`

AUFGABE:
Erstelle die komplette lokale Docker-Entwicklungsumgebung exakt nach Dokumentation.

ERZEUGE:
- `.env.example`
- `docker-compose.yml`
- `backend/Dockerfile`
- `backend/.dockerignore`
- `frontend/Dockerfile`
- `frontend/.dockerignore`
- `Makefile`

REGELN:
1. Nutze PostgreSQL, Backend und Frontend.
2. Aktiviere Hot Reload.
3. Nutze Volumes für Source Code.
4. Nutze `postgres` als DB Host im Container-Netzwerk.
5. Stelle sicher, dass Ports 3000, 5173 und 5432 korrekt gemappt sind.
6. Mache keine Produktionsoptimierung, nur saubere lokale Entwicklung.

AKZEPTANZKRITERIEN:
- `docker compose up -d` funktioniert
- PostgreSQL ist healthy
- Backend startet
- Frontend startet
```

---

## 4. Contracts Prompt

```text
LIES:
- `docs/04-DOMAIN-MODEL.md`
- `docs/05-API-CONTRACTS.md`

AUFGABE:
Erstelle das Package `contracts/` exakt nach Dokumentation.

REGELN:
1. Nutze exakt dieselben Feldnamen.
2. Verwende nur TypeScript Interfaces und Types.
3. Keine Business-Logik.
4. Erzeuge alle `index.ts` Dateien sauber.
5. Halte Common, Auth, Patient, Order, Specimen, Result, Report, Reagent, Portal und Audit getrennt.

LIEFERE:
- `contracts/package.json`
- `contracts/tsconfig.json`
- `contracts/src/index.ts`
- alle Moduldateien unter `contracts/src/**`

WICHTIG:
Backend und Frontend sollen dieses Package importieren können.
```

---

## 5. Prisma Prompt

```text
LIES:
- `docs/04-DOMAIN-MODEL.md`
- `docs/05-API-CONTRACTS.md`
- `docs/11-PRISMA-SCHEMA.md`

AUFGABE:
Erstelle das Prisma-Datenmodell für das MLMS.

ERZEUGE:
- `backend/prisma/schema.prisma`
- `backend/prisma/seed.ts`

REGELN:
1. Nutze PostgreSQL.
2. Nutze Prisma Enums für feste Statuswerte.
3. Implementiere alle Modelle und Relationen exakt wie dokumentiert.
4. Verwende `String @id @default(cuid())` für IDs, sofern dokumentiert.
5. Füge die definierten Indizes und Unique Constraints hinzu.
6. Halte die Modelle konsistent mit Domain Model und Contracts.
7. Führe danach aus:
   - `prisma format`
   - `prisma validate`
   - erste Migration
   - `prisma generate`

LIEFERE:
- `schema.prisma`
- Seed-Grundlage
- kurze Liste fachlicher Validierungen, die nicht in Prisma liegen
```

---

## 6. OpenAPI Prompt

```text
LIES:
- `docs/05-API-CONTRACTS.md`
- `docs/11-PRISMA-SCHEMA.md`
- `docs/12-OPENAPI.md`

AUFGABE:
Erstelle die OpenAPI-Dokumentation für das MLMS.

ERZEUGE:
- `backend/openapi/mlms.openapi.yaml`
- optional Swagger Setup in `backend/src/main.ts`

REGELN:
1. Nutze OpenAPI 3.0.3.
2. Halte Schema-Namen in PascalCase.
3. Halte Feldnamen exakt contract-kompatibel.
4. Dokumentiere Bearer JWT Auth global.
5. Dokumentiere alle MVP-Endpunkte.
6. Füge Examples für wichtige Requests und Responses hinzu.
7. Dokumentiere Standard-Errors.
8. Halte Enums exakt konsistent mit Domain Model, Contracts und Prisma.

LIEFERE:
- OpenAPI Spec
- ggf. Swagger Setup
- kurze Liste dokumentierter MVP-Endpunkte
```

---

## 7. Backend Fundament Prompt

```text
LIES:
- `docs/02-BACKEND-STRUCTURE.md`
- `docs/04-DOMAIN-MODEL.md`
- `docs/05-API-CONTRACTS.md`
- `docs/11-PRISMA-SCHEMA.md`
- `docs/12-OPENAPI.md`

AUFGABE:
Erstelle das Backend-Fundament mit NestJS gemäß Dokumentation.

IMPLEMENTIERE:
- `main.ts`
- `app.module.ts`
- Config
- Prisma Integration
- globale Validation Pipe
- globalen Exception Filter
- JWT Grundsystem
- RBAC Grundsystem
- Language Middleware
- Swagger Setup
- Basis Module

REGELN:
1. Keine fachliche Logik in Controllern.
2. Domain, Application, Infrastructure und Interfaces sauber trennen.
3. Prisma als Infrastruktur behandeln.
4. DTOs und Responses müssen contract-kompatibel sein.
5. OpenAPI / Swagger muss verdrahtet sein.
6. Nutze TypeScript strict.
7. Erzeuge nur sauberes Fundament, bevor Feature-Module detailliert kommen.

LIEFERE:
- lauffähiges NestJS Backend
- saubere Modulstruktur
- Prisma/Swagger Verdrahtung
- kurze Liste der bereits verdrahteten Basiskomponenten
```

---

## 8. Frontend Fundament Prompt

```text
LIES:
- `docs/03-FRONTEND-STRUCTURE.md`
- `docs/05-API-CONTRACTS.md`
- `docs/06-I18N.md`

AUFGABE:
Erstelle das Frontend-Fundament mit React + Vite + TypeScript.

IMPLEMENTIERE:
- `src/main.tsx`
- `src/App.tsx`
- Provider-Struktur
- Routing-Struktur
- MainLayout
- Sidebar
- Header
- ProtectedRoute
- Redux Store / RTK Query Basis
- shared/ui Grundkomponenten

REGELN:
1. Feature-based Architecture strikt einhalten.
2. Keine Business-Logik in Shared UI.
3. `shared/` nur für wiederverwendbare Bausteine.
4. `features/` für fachliche Module.
5. FR/AR Umschaltung von Anfang an vorbereiten.

AKZEPTANZKRITERIEN:
- App startet mit `npm run dev`
- Routing funktioniert
- Layout ist sichtbar
- Shared UI Basis existiert
```

---

## 9. Auth Modul Prompt

```text
LIES:
- `docs/04-DOMAIN-MODEL.md`
- `docs/05-API-CONTRACTS.md`
- `docs/11-PRISMA-SCHEMA.md`
- `docs/12-OPENAPI.md`
- `docs/09-MVP-CHECKLIST.md`

AUFGABE:
Implementiere das Auth-Modul in Backend und Frontend.

BACKEND:
- User Entity / Repository
- RegisterUser
- Login
- GetCurrentUser
- JWT Token Erstellung
- Password Hashing
- Auth Controller
- JWT Guard
- Rollenprüfung

FRONTEND:
- LoginPage
- LoginForm
- AuthProvider
- Session Handling
- Logout
- ProtectedRoute

REGELN:
1. Verträge aus `contracts/` verwenden.
2. `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me` implementieren.
3. Deaktivierte User dürfen sich nicht anmelden.
4. Rolle und Sprache müssen im CurrentUser verfügbar sein.
5. Halte Prisma User Modell und OpenAPI Auth-Endpunkte aktuell.

LIEFERE:
- vollständiges Auth-MVP
- aktualisierte OpenAPI Doku
- kurze Testanleitung
```

---

## 10. Patient Modul Prompt

```text
LIES:
- `docs/03-FRONTEND-STRUCTURE.md`
- `docs/04-DOMAIN-MODEL.md`
- `docs/05-API-CONTRACTS.md`
- `docs/11-PRISMA-SCHEMA.md`
- `docs/12-OPENAPI.md`
- `docs/09-MVP-CHECKLIST.md`

AUFGABE:
Implementiere das Patient-Modul end-to-end.

BACKEND:
- Entity
- Repository
- Use Cases:
  - RegisterPatient
  - UpdatePatient
  - GetPatientById
  - ListPatients
- Endpunkte:
  - POST /api/patients
  - GET /api/patients
  - GET /api/patients/:id
  - PATCH /api/patients/:id

FRONTEND:
- PatientListPage
- PatientCreatePage
- PatientDetailPage
- PatientForm
- PatientTable
- patientApi.ts

REGELN:
1. Feldnamen exakt aus Contracts verwenden.
2. Validierungen gemäß Domain Model.
3. FR/AR Labels aus i18n verwenden.
4. Keine harten Texte im UI.
5. Suchfunktion und Listenansicht für MVP vorbereiten.
6. Prisma und OpenAPI nachziehen.

AKZEPTANZKRITERIEN:
- Patient kann erstellt, gelistet, angezeigt und bearbeitet werden.
```

---

## 11. Order Modul Prompt

```text
LIES:
- `docs/04-DOMAIN-MODEL.md`
- `docs/05-API-CONTRACTS.md`
- `docs/11-PRISMA-SCHEMA.md`
- `docs/12-OPENAPI.md`
- `docs/09-MVP-CHECKLIST.md`

AUFGABE:
Implementiere das Order-Modul end-to-end.

BACKEND:
- Order Entity
- TestOrder Struktur
- Repositories
- Use Cases:
  - CreateOrder
  - GetOrderById
  - ListOrders
  - UpdateOrderStatus
  - CancelOrder

FRONTEND:
- OrderListPage
- OrderCreatePage
- OrderDetailPage
- OrderForm
- TestSelectionTable
- orderApi.ts

REGELN:
1. Order braucht gültigen Patienten.
2. Order braucht mindestens einen Test.
3. Startstatus ist `PENDING`.
4. Statusmodell exakt wie dokumentiert.
5. Testnamen FR/AR mitführen.
6. Prisma und OpenAPI nachziehen.

AKZEPTANZKRITERIEN:
- Reception kann für einen Patienten eine Order mit Tests anlegen.
```

---

## 12. Specimen Modul Prompt

```text
LIES:
- `docs/04-DOMAIN-MODEL.md`
- `docs/05-API-CONTRACTS.md`
- `docs/11-PRISMA-SCHEMA.md`
- `docs/12-OPENAPI.md`
- `docs/09-MVP-CHECKLIST.md`

AUFGABE:
Implementiere das Specimen-Modul end-to-end.

BACKEND:
- Specimen Entity
- Repository
- Use Cases:
  - CreateSpecimen
  - GetSpecimenById
  - UpdateSpecimenStatus

FRONTEND:
- SpecimenListPage
- SpecimenCreatePage
- SpecimenDetailPage
- SpecimenForm
- BarcodePreview
- BarcodePrintButton

REGELN:
1. Barcode muss eindeutig sein.
2. Specimen gehört genau zu einer Order.
3. Statusmodell exakt einhalten.
4. Typen und Status aus Contracts verwenden.
5. UI muss Specimen-Typen übersetzt anzeigen.
6. Prisma und OpenAPI nachziehen.

AKZEPTANZKRITERIEN:
- Technician kann eine Probe anlegen und ihren Status verwalten.
```

---

## 13. Result Modul Prompt

```text
LIES:
- `docs/04-DOMAIN-MODEL.md`
- `docs/05-API-CONTRACTS.md`
- `docs/08-MEDICAL-TERMS.md`
- `docs/11-PRISMA-SCHEMA.md`
- `docs/12-OPENAPI.md`
- `docs/09-MVP-CHECKLIST.md`

AUFGABE:
Implementiere das Result-Modul end-to-end.

BACKEND:
- Result Entity
- Repository
- Use Cases:
  - RecordResult
  - UpdateResult
  - ListResultsBySpecimen
  - ListResultsByOrder

FRONTEND:
- ResultEntryPage
- ResultReviewPage
- ResultHistoryPage
- ResultForm
- ResultTable
- ResultFlagBadge
- ReferenceRange
- CriticalAlert

REGELN:
1. Result braucht `value`, `flag`, `measuredAt`.
2. Result gehört zu einem Specimen.
3. Flag-Darstellung muss `N`, `H`, `L`, `HH`, `LL`, `CRITICAL` unterstützen.
4. Medizinische Begriffe aus `medical.json` nutzen.
5. Kritische Werte visuell hervorheben.
6. Prisma und OpenAPI nachziehen.

AKZEPTANZKRITERIEN:
- Technician kann Resultate erfassen und prüfen.
```

---

## 14. Report Modul Prompt

```text
LIES:
- `docs/04-DOMAIN-MODEL.md`
- `docs/05-API-CONTRACTS.md`
- `docs/06-I18N.md`
- `docs/11-PRISMA-SCHEMA.md`
- `docs/12-OPENAPI.md`
- `docs/09-MVP-CHECKLIST.md`

AUFGABE:
Implementiere das Report-Modul end-to-end.

BACKEND:
- Report Entity
- Repository
- Use Cases:
  - GenerateReport
  - ValidateReport
  - SignReport
  - PublishReport
  - GetReportById
  - ListReports

FRONTEND:
- ReportValidationQueue
- ReportDetailPage
- ReportPreviewPage
- ReportHistoryPage
- ReportHeader
- ReportResultTable
- ValidationActions
- SignaturePanel
- PublishButton

REGELN:
1. Report startet mit `DRAFT`.
2. Keine Validierung ohne Results.
3. Nur validierte Reports dürfen signiert werden.
4. Nur finale Reports dürfen publiziert werden.
5. `commentsFr` und `commentsAr` getrennt behandeln.
6. Nur PHYSICIAN darf validieren/signieren.
7. Prisma und OpenAPI nachziehen.

AKZEPTANZKRITERIEN:
- Laborarzt kann einen Report validieren, signieren und publizieren.
```

---

## 15. Portal Prompt

```text
LIES:
- `docs/03-FRONTEND-STRUCTURE.md`
- `docs/04-DOMAIN-MODEL.md`
- `docs/05-API-CONTRACTS.md`
- `docs/06-I18N.md`
- `docs/08-MEDICAL-TERMS.md`
- `docs/12-OPENAPI.md`
- `docs/09-MVP-CHECKLIST.md`

AUFGABE:
Implementiere das Patientenportal für veröffentlichte Reports.

BACKEND:
- GET /api/portal/reports
- GET /api/portal/reports/:id
- nur publizierte Reports ausliefern
- nur patienteneigene Reports ausliefern

FRONTEND:
- PortalLoginPage
- MyReportsPage
- MyReportDetailPage
- MyProfilePage
- ReportCard
- ReportPdfViewer oder HTML Bericht
- Download Button

REGELN:
1. Nur veröffentlichte Reports sichtbar.
2. Nur eigene Reports sichtbar.
3. FR/AR vollständig unterstützen.
4. Patientenfreundliche medizinische Begriffe nutzen, wo sinnvoll.
5. Eigenes Portal-Layout verwenden.
6. OpenAPI nachziehen.

AKZEPTANZKRITERIEN:
- Patient kann eigene veröffentlichte Reports sicher ansehen.
```

---

## 16. Reagent Prompt

```text
LIES:
- `docs/04-DOMAIN-MODEL.md`
- `docs/05-API-CONTRACTS.md`
- `docs/11-PRISMA-SCHEMA.md`
- `docs/12-OPENAPI.md`
- `docs/09-MVP-CHECKLIST.md`

AUFGABE:
Implementiere das Reagent/Inventory Basic Modul.

BACKEND:
- Reagent Entity
- ReagentLot Entity
- Repositories
- Use Cases:
  - CreateReagent
  - ReceiveReagentLot
  - ConsumeReagentForTest
  - ListReagents
  - ListReagentLots

FRONTEND:
- ReagentListPage
- ReagentCreatePage
- ReagentLotPage
- InventoryDashboardPage
- ReagentTable
- ReagentLotTable
- StockAlertBanner
- ExpiryAlertBanner

REGELN:
1. Lots dürfen nicht negativ werden.
2. Blockierte Lots dürfen nicht verbraucht werden.
3. Abgelaufene Lots dürfen nicht verbraucht werden.
4. Alerts für Low Stock und Expiry vorbereiten.
5. Nur MVP Basic umsetzen, kein komplexes Inventory-System.
6. Prisma und OpenAPI nachziehen.

AKZEPTANZKRITERIEN:
- Admin kann Reagenzien und Lots verwalten sowie Verbrauch buchen.
```

---

## 17. i18n Prompt

```text
LIES:
- `docs/06-I18N.md`
- `docs/08-MEDICAL-TERMS.md`

AUFGABE:
Implementiere das vollständige i18n-System für FR und AR mit RTL.

ERZEUGE:
- `frontend/src/i18n/index.ts`
- `frontend/src/i18n/rtl.ts`
- `frontend/src/i18n/helpers/*`
- alle JSON-Dateien für FR und AR

REGELN:
1. Identische Key-Struktur in beiden Sprachen.
2. Fallback = FR.
3. Arabisch muss `dir="rtl"` setzen.
4. Keine harten UI-Texte.
5. Medizinische Begriffe aus `medical.json` bereitstellen.
6. Status- und Rollenbegriffe übersetzen.

AKZEPTANZKRITERIEN:
- Sprache kann live gewechselt werden
- RTL funktioniert korrekt
- kritische MVP Screens sind übersetzt
```

---

## 18. Audit Prompt

```text
LIES:
- `docs/04-DOMAIN-MODEL.md`
- `docs/11-PRISMA-SCHEMA.md`
- `docs/09-MVP-CHECKLIST.md`

AUFGABE:
Implementiere Audit / Traceability für kritische Aktionen.

MINDESTENS LOGGEN:
- Login
- Result Erstellung/Änderung
- Report Validation
- Report Signatur
- Report Publish
- Reagent Consumption
- User Rollenänderung

REGELN:
1. Audit-Einträge sind unveränderlich.
2. Speichere actorUserId, action, entityType, entityId, beforeJson, afterJson, createdAt.
3. Integriere Audit ohne Geschäftslogik in Controllern zu duplizieren.
4. MVP-fähig, aber sauber erweiterbar.
5. Prisma AuditEntry Modell respektieren.

AKZEPTANZKRITERIEN:
- Kritische Aktionen sind nachvollziehbar gespeichert.
```

---

## 19. Tests Prompt

```text
LIES:
- `docs/09-MVP-CHECKLIST.md`
- relevante Modul-Dokumente
- `docs/12-OPENAPI.md`, wenn API-Tests betroffen sind

AUFGABE:
Erstelle minimale, aber sinnvolle Tests für das MVP.

BACKEND:
- Auth E2E
- Patient E2E
- Order E2E
- Report E2E

FRONTEND:
- Login Render Test
- PatientForm Render Test
- Language Switch Test
- RTL Test

API/DOKU:
- Swagger/OpenAPI erreichbar
- dokumentierte Hauptpfade stimmen mit Implementierung überein

REGELN:
1. Teste kritische Hauptflüsse statt irrelevanter Kleinigkeiten.
2. Nutze bestehende Contracts und Feldnamen.
3. Schreibe keine extrem fragilen Tests.
4. Fokus auf MVP-Sicherheit.

AKZEPTANZKRITERIEN:
- Kritische Flows haben Basis-Testabdeckung.
```

---

## 20. Debug Prompt

```text
Analysiere das aktuelle Problem systematisch und behebe es mit minimal-invasiven Änderungen.

PROBLEM:
[HIER PROBLEM BESCHREIBEN]

KONTEXT:
- Projekt: MLMS
- Relevante Doku-Dateien: [HIER LISTE EINFÜGEN]
- Betroffener Bereich: [backend/frontend/contracts/prisma/openapi/docker]

REGELN:
1. Reproduziere zuerst die Ursache logisch aus Code und Struktur.
2. Ändere nur Dateien, die wirklich betroffen sind.
3. Verändere keine Architektur ohne Not.
4. Halte Contracts stabil.
5. Prüfe explizit:
   - Prisma Schema
   - Migrationen
   - OpenAPI Pfade/Schemas
   - DTO Feldnamen
   - ENV Variablen
6. Erkläre am Ende:
   - Root Cause
   - geänderte Dateien
   - konkrete Lösung
   - verbleibende Risiken
```

---

## 21. Refactor Prompt

```text
Refaktoriere den angegebenen Bereich, ohne Verhalten, API-Verträge, Prisma-Modelle oder dokumentierte Endpunkte zu ändern.

BEREICH:
[HIER BEREICH EINFÜGEN]

REGELN:
1. Keine Änderung an externen Feldnamen, Endpunkten oder DTOs.
2. Keine Änderung an Statusmodellen.
3. Fokus auf Lesbarkeit, Trennung von Verantwortlichkeiten und kleinere Funktionen/Klassen.
4. Vorhandene Architektur aus `docs/` strikt respektieren.
5. Wenn Prisma oder OpenAPI betroffen wären, stoppe und markiere das explizit.
6. Am Ende liste:
   - was refaktoriert wurde
   - was bewusst unverändert blieb
   - ob sich Laufzeitverhalten geändert hat (soll: nein)
```

---

## 22. Bugfix nach Fehlerlog Prompt

```text
Ich gebe dir jetzt einen Fehlerlog. Analysiere ihn im Kontext des MLMS-Projekts und behebe nur die tatsächliche Ursache.

WICHTIGE REGELN:
1. Lies die relevanten Dateien unter `docs/`.
2. Nutze die bestehende Architektur.
3. Mache keine spekulativen Großumbauten.
4. Wenn mehrere Ursachen möglich sind, priorisiere die wahrscheinlichste.
5. Prüfe besonders:
   - Importpfade
   - Contracts
   - DTO Feldnamen
   - Prisma Mapping
   - Migrationen
   - OpenAPI Pfade/Schemas
   - Docker/ENV Variablen
   - RTK Query Endpoints
   - i18n Namespace Namen

FEHLERLOG:
[HIER EINFÜGEN]
```

---

## 23. Phase-für-Phase Prompt

Diesen Prompt kannst du immer wiederverwenden.

```text
LIES:
- `docs/09-MVP-CHECKLIST.md`
- alle für die aktuelle Phase relevanten Dokumente

AKTUELLE PHASE:
[HIER PHASE EINFÜGEN, z. B. "Phase 8 – Patient Modul"]

AUFGABE:
Implementiere nur diese Phase vollständig.

REGELN:
1. Bearbeite nur Scope dieser Phase.
2. Berücksichtige Abhängigkeiten zu früheren Phasen.
3. Verändere keine fertiggestellten Module unnötig.
4. Stelle sicher, dass das Projekt weiterhin startet.
5. Wenn Phase Persistenz betrifft, synchronisiere Prisma.
6. Wenn Phase API betrifft, synchronisiere OpenAPI.
7. Markiere am Ende:
   - erledigte Punkte
   - offene Punkte
   - eventuell blockierte Punkte
```

---

## 24. Finaler MVP-Härtungs Prompt

```text
LIES:
- alle Dateien unter `docs/`
- besonders `09-MVP-CHECKLIST.md`

AUFGABE:
Prüfe das gesamte Projekt gegen die MVP-Checkliste und schließe verbleibende Lücken.

PRÜFE SYSTEMATISCH:
- Docker
- Contracts
- Prisma
- OpenAPI / Swagger
- Auth
- Rollen
- i18n FR/AR
- RTL
- Patient
- Order
- Specimen
- Result
- Report
- Portal
- Reagent Basic
- Audit
- Tests

REGELN:
1. Keine neuen Nice-to-have Features.
2. Nur Lücken zum MVP schließen.
3. Halte Contracts und Struktur stabil.
4. Erzeuge am Ende einen echten Restpunkte-Bericht.

LIEFERE:
- Liste aller geschlossenen Lücken
- verbleibende MVP-Blocker
- empfohlene letzte Schritte vor Abnahme
```

---

## 25. Prompt für fehlende Dateien

```text
Vergleiche den aktuellen Projektstand mit den Dateien und Strukturen in `docs/`.

AUFGABE:
Finde fehlende oder falsch benannte Dateien und korrigiere das Projekt.

REGELN:
1. Erzeuge keine Alternativstruktur.
2. Nutze exakt die dokumentierten Namen.
3. Prüfe ausdrücklich auch:
   - `backend/prisma/schema.prisma`
   - `backend/prisma/seed.ts`
   - `backend/openapi/mlms.openapi.yaml`
4. Korrigiere nur Struktur und Dateibenennung, keine unnötigen fachlichen Änderungen.
5. Liste am Ende:
   - fehlende Dateien, die erstellt wurden
   - falsch benannte Dateien, die korrigiert wurden
   - bewusst unberührte Bereiche
```

---

## 26. Prompt für Konsistenzprüfung

```text
Führe eine Konsistenzprüfung über Backend, Frontend, Contracts, Prisma und OpenAPI durch.

PRÜFE:
1. Stimmen DTO-Feldnamen überall überein?
2. Stimmen Statuswerte überall überein?
3. Stimmen Rollenwerte überall überein?
4. Stimmen API-Endpunkte mit den Frontend-Calls überein?
5. Stimmen OpenAPI Pfade und Schemas mit der Implementierung überein?
6. Stimmen Prisma-Felder mit dem Domain Model überein?
7. Stimmen i18n Keys mit der UI-Verwendung überein?

REGELN:
- Nichts unnötig refaktorieren
- Nur Inkonsistenzen beheben
- Am Ende einen klaren Report liefern
```

---

## 27. Prompt für sauberen Abschluss einer Session

```text
Beende diese Arbeitssession sauber.

AUFGABE:
1. Fasse kurz zusammen, was in dieser Session umgesetzt wurde.
2. Liste alle geänderten/erstellten Dateien.
3. Nenne offene Punkte.
4. Schlage den nächsten sinnvollsten Prompt vor.
5. Prüfe, ob aktuelle Änderungen zur Dokumentation passen.
6. Nenne explizit, ob Prisma Schema oder OpenAPI aktualisiert wurden.

WICHTIG:
- Keine langen Erklärungen
- Fokus auf Arbeitsübergabe
- Projektkontext MLMS beibehalten
```

---

## Empfohlene Reihenfolge der Prompts

```text
1. Projekt-Setup Prompt
2. Docker Prompt
3. Contracts Prompt
4. Prisma Prompt
5. OpenAPI Prompt
6. Backend Fundament Prompt
7. Frontend Fundament Prompt
8. i18n Prompt
9. Auth Modul Prompt
10. Patient Modul Prompt
11. Order Modul Prompt
12. Specimen Modul Prompt
13. Result Modul Prompt
14. Report Modul Prompt
15. Portal Prompt
16. Reagent Prompt
17. Audit Prompt
18. Tests Prompt
19. Finaler MVP-Härtungs Prompt
```

---

## Regeln für gute Zusammenarbeit mit Claude Code

### Gute Eingaben
- klarer Scope
- relevante Doku-Dateien genannt
- gewünschte Dateien genannt
- klare Akzeptanzkriterien
- keine Mischaufgaben ohne Priorität

### Schlechte Eingaben
- "Mach alles"
- "Baue das System fertig"
- "Irgendwie ein Backend"
- "Verbessere alles"

---

## Beispiel für einen schlechten Prompt

```text
Erstelle ein Laborprojekt mit Frontend und Backend.
```

## Warum schlecht
- kein Scope
- keine Struktur
- keine Regeln
- keine Deliverables
- hohe Wahrscheinlichkeit für Architekturabweichung

---

## Beispiel für einen guten Prompt

```text
LIES:
- `docs/04-DOMAIN-MODEL.md`
- `docs/05-API-CONTRACTS.md`
- `docs/11-PRISMA-SCHEMA.md`
- `docs/12-OPENAPI.md`
- `docs/09-MVP-CHECKLIST.md`

AUFGABE:
Implementiere nur das Patient-Modul end-to-end.

LIEFERE:
- Backend Endpunkte
- Use Cases
- Repository
- Frontend Pages
- PatientForm
- patientApi.ts
- aktualisierte OpenAPI-Doku

AKZEPTANZKRITERIEN:
- Patient kann erstellt, bearbeitet, angezeigt und gelistet werden.
- FR/AR Labels funktionieren.
- Contracts werden verwendet.
- Prisma und OpenAPI sind synchron.
```

---

## Definition of Done

Dieses Dokument ist korrekt umgesetzt, wenn:

- für jede MVP-Phase ein brauchbarer Prompt vorhanden ist
- ein Master Prompt vorhanden ist
- Prisma- und OpenAPI-Prompts vorhanden sind
- Debug-, Refactor- und Abschluss-Prompts vorhanden sind
- die Prompts auf die vorhandenen `docs/` Dateien verweisen
- die Prompts klare Deliverables und Regeln enthalten
- Claude Code damit kontrolliert und reproduzierbar arbeiten kann

---

## Claude Code Prompt für dieses Prompt-File

```text
LIES DIESES KOMPLETTE DOKUMENT `10-CLAUDE-PROMPTS.md`.

Nutze dieses Dokument als Arbeitsbuch für alle weiteren Claude-Code-Sessions im MLMS-Projekt.

WICHTIGE REGELN:
1. Wähle immer den kleinsten passenden Prompt.
2. Lies immer zuerst die relevanten Doku-Dateien.
3. Halte dich strikt an Struktur, Contracts, Domain Model, Prisma und OpenAPI.
4. Arbeite phasenweise.
5. Halte Änderungen nachvollziehbar und minimal-invasiv.
6. Gib am Ende jeder Session einen kurzen Fortschrittsbericht.
7. Halte `11-PRISMA-SCHEMA.md` und `12-OPENAPI.md` mit dem restlichen Projekt konsistent.

Verwende die Prompts dieses Dokuments als Standard-Arbeitsweise für die weitere Projektumsetzung.
```

---
