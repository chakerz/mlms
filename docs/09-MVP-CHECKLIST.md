# 09-MVP-CHECKLIST.md

# MVP Checklist – MLMS

## Ziel

Dieses Dokument definiert die konkrete MVP-Checkliste für das MLMS.

Es dient als:

- Umsetzungsplan
- Qualitätskontrolle
- Sprint-Kontrolle
- Abnahmeliste
- Claude-Code Arbeitsgrundlage

Das MVP muss einen vollständigen minimalen End-to-End-Laborprozess ermöglichen:

1. User Login
2. Patient anlegen
3. Order anlegen
4. Specimen anlegen
5. Result erfassen
6. Report validieren
7. Report veröffentlichen
8. Patient sieht Report im Portal

---

## Grundregeln

### 1. MVP bedeutet funktional, nicht perfekt
Das System muss nutzbar sein, aber noch nicht alle späteren Funktionen enthalten.

### 2. End-to-End vor Zusatzfeatures
Der vollständige Hauptworkflow ist wichtiger als Nebensysteme.

### 3. Zweisprachigkeit ist Pflicht
FR und AR gehören bereits ins MVP.

### 4. Sicherheit und Rollen sind Pflicht
Kein medizinisches System ohne Auth, Rollen und saubere Rechte.

### 5. Prisma und OpenAPI sind Pflichtbestandteile
Persistenzmodell und API-Dokumentation gehören zur verbindlichen MVP-Basis.

### 6. Reagenzien sind im MVP enthalten
Mindestens Grundfunktionen für Reagenzien und Lots müssen vorhanden sein.

---

## MVP Scope – Pflichtmodule

Folgende Module müssen im MVP enthalten sein:

- Auth
- Users / Roles
- Patient
- Order
- Specimen
- Result
- Report
- Patient Portal
- Reagent / Inventory Basic
- i18n FR/AR
- Audit für kritische Aktionen
- Docker Development Setup
- Prisma Schema
- OpenAPI / Swagger

---

## Phase 0 – Projektbasis

## Pflicht
- [x] Monorepo-Struktur vorhanden
- [x] `backend/` vorhanden
- [x] `frontend/` vorhanden
- [x] `contracts/` vorhanden
- [x] `docs/` vorhanden
- [x] `.env.example` vorhanden
- [x] `docker-compose.yml` vorhanden
- [x] `Makefile` vorhanden
- [x] Git Repository initialisiert
- [x] `.gitignore` vorhanden

## Erfolgskriterium
Projekt kann lokal sauber gestartet werden.

---

## Phase 1 – Docker & lokale Umgebung

## Pflicht
- [ ] PostgreSQL Container läuft
- [ ] Backend Container läuft
- [ ] Frontend Container läuft
- [ ] Hot Reload im Backend funktioniert
- [ ] Hot Reload im Frontend funktioniert
- [ ] Prisma kann mit DB verbinden
- [ ] Migrationen laufen
- [ ] Volumes funktionieren
- [ ] `docker compose up -d` startet alles erfolgreich

## Erfolgskriterium
Lokale Entwicklungsumgebung funktioniert ohne manuelle Sondertricks.

---

## Phase 2 – Contracts & Grundstruktur

## Pflicht
- [x] `contracts/` Package angelegt
- [x] Common DTOs vorhanden
- [x] Auth DTOs vorhanden
- [x] Patient DTOs vorhanden
- [x] Order DTOs vorhanden
- [x] Specimen DTOs vorhanden
- [x] Result DTOs vorhanden
- [x] Report DTOs vorhanden
- [x] Reagent DTOs vorhanden
- [x] Portal DTOs vorhanden
- [x] alle `index.ts` Exporte vorhanden

## Erfolgskriterium
Frontend und Backend können gemeinsame Typen importieren.

---

## Phase 3 – Prisma Schema & Persistenzmodell

## Pflicht
- [x] `backend/prisma/schema.prisma` vorhanden
- [x] PostgreSQL Provider konfiguriert
- [x] alle Kern-Enums vorhanden
- [x] User Modell vorhanden
- [x] Patient Modell vorhanden
- [x] Order Modell vorhanden
- [x] TestOrder Modell vorhanden
- [x] Specimen Modell vorhanden
- [x] Result Modell vorhanden
- [x] Report Modell vorhanden
- [x] Reagent Modell vorhanden
- [x] ReagentLot Modell vorhanden
- [x] StorageLocation Modell vorhanden
- [x] AuditEntry Modell vorhanden
- [x] TestDefinition Modell vorhanden
- [x] Relationen korrekt gesetzt
- [x] Unique Constraints korrekt gesetzt
- [x] wichtige Indizes gesetzt
- [x] `prisma format` läuft
- [x] `prisma validate` läuft
- [ ] erste Migration erzeugbar
- [x] Prisma Client generierbar
- [x] `prisma/seed.ts` Grundlage vorhanden

## Erfolgskriterium
Das Datenmodell ist mit Domain Model und Contracts konsistent und migrationsfähig.

---

## Phase 4 – OpenAPI & Swagger

## Pflicht
- [x] `backend/openapi/mlms.openapi.yaml` vorhanden oder gleichwertige generierte Swagger-Doku vorhanden
- [x] OpenAPI Version definiert
- [x] Bearer JWT Security dokumentiert
- [x] Standard Error Model dokumentiert
- [x] Standard Response Envelopes dokumentiert
- [x] gemeinsame Enums dokumentiert
- [x] Auth Endpunkte dokumentiert
- [x] Patient Endpunkte dokumentiert
- [x] Order Endpunkte dokumentiert
- [x] Specimen Endpunkte dokumentiert
- [x] Result Endpunkte dokumentiert
- [x] Report Endpunkte dokumentiert
- [x] Reagent Endpunkte dokumentiert
- [x] Portal Endpunkte dokumentiert
- [ ] Request/Response Examples für Hauptpfade vorhanden
- [x] Swagger UI erreichbar

## Erfolgskriterium
API ist für Frontend, Testing und spätere Integrationen nachvollziehbar dokumentiert.

---

## Phase 5 – Backend Grundsystem

## Pflicht
- [x] NestJS Projekt läuft
- [x] `main.ts` vorhanden
- [x] `app.module.ts` vorhanden
- [x] Config Module vorhanden
- [x] Prisma Module vorhanden
- [x] Global Validation Pipe vorhanden
- [x] Global Exception Filter vorhanden
- [x] Language Middleware vorhanden
- [x] JWT Grundsystem vorhanden
- [x] RBAC Grundsystem vorhanden

## Erfolgskriterium
Backend startet sauber und besitzt Fundament für Module.

---

## Phase 6 – Auth Modul

## Pflicht
- [x] `POST /api/auth/login` implementiert
- [x] `POST /api/auth/register` implementiert
- [x] `GET /api/auth/me` implementiert
- [x] User Entity vorhanden
- [x] Passwort-Hashing vorhanden
- [x] JWT Token Erstellung vorhanden
- [x] JWT Guard vorhanden
- [x] Rollenprüfung vorhanden
- [x] deaktivierte User werden blockiert

## UI Pflicht
- [x] LoginPage vorhanden
- [x] LoginForm vorhanden
- [x] Fehleranzeige bei falschem Login
- [x] User Session im Frontend gespeichert
- [x] Logout möglich

## Doku Pflicht
- [x] Auth Endpunkte in OpenAPI aktuell
- [x] Auth DTOs und Swagger Schemas konsistent

## Erfolgskriterium
Ein User kann sich anmelden und rollenbasiert ins System kommen.

---

## Phase 7 – i18n Grundsystem

## Pflicht
- [x] `frontend/src/i18n/index.ts` vorhanden
- [x] `frontend/src/i18n/rtl.ts` vorhanden
- [x] FR Übersetzungen vorhanden
- [x] AR Übersetzungen vorhanden
- [x] `common.json` vorhanden
- [x] `auth.json` vorhanden
- [x] `patient.json` vorhanden
- [x] `statuses.json` vorhanden
- [x] `medical.json` vorhanden
- [x] Fallback Sprache ist FR

## UI Pflicht
- [x] Sprachumschalter vorhanden
- [x] FR Ansicht funktioniert
- [x] AR Ansicht funktioniert
- [x] RTL wird korrekt gesetzt
- [x] Sidebar/Layout funktioniert in RTL
- [x] Formulare funktionieren in RTL

## Erfolgskriterium
App kann vollständig zwischen FR und AR umschalten.

---

## Phase 8 – Patient Modul

## Backend Pflicht
- [x] `POST /api/patients` implementiert
- [x] `GET /api/patients` implementiert
- [x] `GET /api/patients/:id` implementiert
- [x] `PATCH /api/patients/:id` implementiert
- [x] Patient Entity vorhanden
- [x] Patient Repository vorhanden
- [x] RegisterPatient Use Case vorhanden
- [x] UpdatePatient Use Case vorhanden
- [x] GetPatientById Use Case vorhanden
- [x] ListPatients Use Case vorhanden

## Frontend Pflicht
- [x] PatientListPage vorhanden
- [x] PatientCreatePage vorhanden
- [x] PatientDetailPage vorhanden
- [x] PatientEditPage vorhanden
- [x] PatientForm vorhanden (shared für Create + Edit)
- [x] PatientTable vorhanden
- [x] Patientsuche vorhanden
- [x] Validierungsfehler sichtbar
- [x] Erfolgsmeldung bei Erstellung
- [x] Edit-Button in PatientDetailPage verdrahtet

## Daten Pflicht
- [x] firstName
- [x] lastName
- [x] birthDate
- [x] gender
- [x] phone optional
- [x] email optional
- [x] address optional

## Konsistenz Pflicht
- [x] Prisma Modell `Patient` stimmt mit Domain Model überein
- [x] OpenAPI Patient Schemas aktuell
- [x] Contracts und Frontend Types konsistent

## Erfolgskriterium
Ein Patient kann erstellt, bearbeitet, gefunden und angezeigt werden.

---

## Phase 9 – Order Modul

## Backend Pflicht
- [x] `POST /api/orders` implementiert
- [x] `GET /api/orders` implementiert
- [x] `GET /api/orders/:id` implementiert
- [x] `PATCH /api/orders/:id/status` implementiert
- [x] CreateOrder Use Case vorhanden
- [x] ListOrders Use Case vorhanden
- [x] GetOrderById Use Case vorhanden
- [x] UpdateOrderStatus Use Case vorhanden
- [x] Order Statusmodell implementiert
- [x] TestOrder Struktur implementiert

## Frontend Pflicht
- [x] OrderListPage vorhanden
- [x] OrderCreatePage vorhanden
- [x] OrderDetailPage vorhanden
- [x] OrderForm vorhanden
- [x] TestSelection UI vorhanden
- [x] Prioritätsauswahl vorhanden
- [x] Status Badge vorhanden

## Fachlich Pflicht
- [x] Order muss einen Patienten haben
- [x] Order muss mindestens einen Test haben
- [x] PENDING als Startstatus

## Konsistenz Pflicht
- [x] Prisma Modelle `Order` und `TestOrder` korrekt
- [x] OpenAPI Order Endpunkte aktuell
- [x] Statuswerte überall identisch

## Erfolgskriterium
Reception kann für einen Patienten eine Order mit Tests anlegen.

---

## Phase 10 – Specimen Modul

## Backend Pflicht
- [x] `POST /api/specimens` implementiert
- [x] `GET /api/specimens/:id` implementiert
- [x] `PATCH /api/specimens/:id/status` implementiert
- [x] CreateSpecimen Use Case vorhanden
- [x] UpdateSpecimenStatus Use Case vorhanden
- [x] Barcode Feld vorhanden
- [x] Barcode Eindeutigkeit gewährleistet

## Frontend Pflicht
- [x] SpecimenListPage vorhanden
- [x] SpecimenCreatePage vorhanden
- [x] SpecimenForm vorhanden
- [x] BarcodePreview vorhanden
- [x] SpecimenStatusBadge vorhanden

## Fachlich Pflicht
- [x] Specimen gehört zu Order
- [x] Typ ist auswählbar
- [x] CollectionTime vorhanden
- [x] Status startet korrekt

## Konsistenz Pflicht
- [x] Prisma Modell `Specimen` korrekt
- [x] OpenAPI Specimen Endpunkte aktuell

## Erfolgskriterium
Technician kann eine Probe erfassen und ihren Status verwalten.

---

## Phase 11 – Result Modul

## Backend Pflicht
- [x] `POST /api/results` implementiert
- [x] `PATCH /api/results/:id` implementiert
- [x] `GET /api/specimens/:id/results` implementiert
- [x] `GET /api/orders/:id/results` implementiert
- [x] RecordResult Use Case vorhanden
- [x] UpdateResult Use Case vorhanden
- [x] Result Flag Modell vorhanden

## Frontend Pflicht
- [x] ResultEntryPage vorhanden
- [x] ResultReviewPage vorhanden
- [x] ResultForm vorhanden
- [x] ResultTable vorhanden
- [x] ResultFlagBadge vorhanden
- [x] ReferenceRange Anzeige vorhanden
- [x] CriticalAlert vorhanden

## Fachlich Pflicht
- [x] value ist Pflicht
- [x] flag ist Pflicht
- [x] measuredAt ist Pflicht
- [x] Result gehört zu Specimen
- [x] Result kann H/L/CRITICAL darstellen

## Konsistenz Pflicht
- [x] Prisma Modell `Result` korrekt
- [x] OpenAPI Result Endpunkte aktuell
- [x] medizinische Codes konsistent mit `medical.json`

## Erfolgskriterium
Technician kann Laborwerte eingeben und prüfen.

---

## Phase 12 – Report Modul

## Backend Pflicht
- [x] `POST /api/reports/generate` implementiert
- [x] `GET /api/reports/:id` implementiert
- [x] `POST /api/reports/:id/validate` implementiert
- [x] `POST /api/reports/:id/sign` implementiert
- [x] `POST /api/reports/:id/publish` implementiert
- [x] GenerateReport Use Case vorhanden
- [x] ValidateReport Use Case vorhanden
- [x] SignReport Use Case vorhanden
- [x] PublishReport Use Case vorhanden

## Frontend Pflicht
- [x] ReportValidationQueue vorhanden
- [x] ReportDetailPage vorhanden
- [x] ReportHeader vorhanden
- [x] ReportResultTable vorhanden
- [x] ValidationActions vorhanden
- [x] SignaturePanel vorhanden
- [x] PublishButton vorhanden
- [x] Report Comments FR/AR sichtbar

## Fachlich Pflicht
- [x] Report startet mit DRAFT
- [x] Report kann ohne Results nicht validiert werden
- [x] Nur PHYSICIAN darf validieren
- [x] Nur validierte Reports dürfen signiert werden
- [x] Nur finale Reports dürfen publiziert werden

## Konsistenz Pflicht
- [x] Prisma Modell `Report` korrekt
- [x] OpenAPI Report Endpunkte aktuell
- [x] ReportStatus überall identisch

## Erfolgskriterium
Laborarzt kann einen Befund validieren, signieren und publizieren.

---

## Phase 13 – Patient Portal

## Backend Pflicht
- [x] `GET /api/portal/me` implementiert
- [x] `GET /api/portal/reports` implementiert
- [x] `GET /api/portal/reports/:id` implementiert
- [x] nur publizierte Reports werden ausgeliefert

## Frontend Pflicht
- [x] PortalLoginPage vorhanden
- [x] MyReportsPage vorhanden
- [x] MyReportDetailPage vorhanden
- [x] MyProfilePage vorhanden
- [x] ReportCard vorhanden
- [x] ReportPdfViewer oder HTML View vorhanden
- [x] Download Button vorhanden
- [x] Portal in FR und AR verfügbar

## Fachlich Pflicht
- [x] Patient sieht nur eigene Reports
- [x] nur veröffentlichte Reports sichtbar
- [x] medizinische Begriffe korrekt übersetzt
- [x] patientenfreundliche Anzeige möglich

## Konsistenz Pflicht
- [x] OpenAPI Portal Endpunkte aktuell
- [x] Portal DTOs konsistent mit Contracts

## Erfolgskriterium
Patient kann eigene Befunde sicher einsehen.

---

## Phase 14 – Reagent / Inventory Basic

## Backend Pflicht
- [x] `POST /api/reagents` implementiert
- [x] `GET /api/reagents` implementiert
- [x] `POST /api/reagents/lots` implementiert
- [x] `GET /api/reagents/:id/lots` implementiert
- [x] `POST /api/reagents/consume` implementiert
- [x] CreateReagent Use Case vorhanden
- [x] ReceiveReagentLot Use Case vorhanden
- [x] ConsumeReagentForTest Use Case vorhanden

## Frontend Pflicht
- [x] ReagentListPage vorhanden
- [x] ReagentCreatePage vorhanden
- [x] ReagentLotPage vorhanden
- [x] InventoryDashboardPage vorhanden
- [x] ReagentTable vorhanden
- [x] ReagentLotTable vorhanden
- [x] StockAlertBanner vorhanden
- [x] ExpiryAlertBanner vorhanden

## Fachlich Pflicht
- [x] LotNumber vorhanden
- [x] expiryDate vorhanden
- [x] currentQuantity vorhanden
- [x] negative Bestände verboten
- [x] blockierte Lots dürfen nicht verbraucht werden
- [x] abgelaufene Lots dürfen nicht verbraucht werden

## Konsistenz Pflicht
- [x] Prisma Modelle `Reagent` und `ReagentLot` korrekt
- [x] OpenAPI Reagent Endpunkte aktuell

## Erfolgskriterium
Admin kann Reagenzien und Lots verwalten und Verbrauch buchen.

---

## Phase 15 – Dashboard & Navigation

## Pflicht
- [x] MainLayout vorhanden
- [x] Sidebar vorhanden
- [x] Header vorhanden
- [x] DashboardPage vorhanden
- [x] Rollenbasierte Menüs vorhanden
- [x] Logout Button vorhanden
- [x] Sprachumschalter im Header vorhanden
- [x] `/specimens` Sidebar-Link funktioniert (SpecimensAllPage)
- [x] `/results` Sidebar-Link funktioniert (ResultsIndexPage)
- [x] `/users` Sidebar-Link funktioniert (UserListPage, ADMIN only)

## Erfolgskriterium
Benutzer navigieren sauber durch das System.

---

## Phase 16 – Rollen & Rechte

## Pflicht
- [x] RECEPTION Rechte implementiert
- [x] TECHNICIAN Rechte implementiert
- [x] PHYSICIAN Rechte implementiert
- [x] ADMIN Rechte implementiert
- [x] Backend Guards vorhanden
- [x] Frontend Route-Schutz vorhanden
- [x] UI blendet verbotene Aktionen aus
- [x] UserController mit `GET /api/users` (ADMIN only)
- [x] UserController mit `GET /api/users/:id` (ADMIN only)
- [x] UserController mit `PATCH /api/users/:id` (ADMIN only) — Rolle, Sprache, isActive
- [x] ListUsers Use Case vorhanden
- [x] GetUserById Use Case vorhanden
- [x] UpdateUser Use Case vorhanden (inkl. Schutz gegen Selbst-Deaktivierung)
- [x] UserListPage vorhanden (ADMIN only) — mit Edit- und Toggle-Aktionen
- [x] UserCreatePage vorhanden (`/users/new`) — via POST /auth/register
- [x] UserEditPage vorhanden (`/users/:id/edit`) — Rolle, Sprache, Aktivstatus

## Erfolgskriterium
Jede Rolle sieht nur ihre erlaubten Bereiche.

---

## Phase 17 – Audit & Nachvollziehbarkeit

## Pflicht
- [x] AuditEntry Modell vorhanden
- [ ] Login wird geloggt
- [ ] Result Änderungen werden geloggt
- [ ] Report Validation wird geloggt
- [ ] Report Signatur wird geloggt
- [ ] Report Publish wird geloggt
- [x] Reagent Consumption wird geloggt
- [ ] User Rollenänderung wird geloggt

## Erfolgskriterium
Kritische Aktionen sind nachvollziehbar.

---

## Phase 18 – Medizinische Begriffe

## Pflicht
- [x] `medical.json` FR vorhanden
- [x] `medical.json` AR vorhanden
- [x] dieselben Keys in FR und AR
- [x] HGB vorhanden
- [x] WBC vorhanden
- [x] RBC vorhanden
- [x] PLT vorhanden
- [x] GLU vorhanden
- [x] CRE vorhanden
- [x] CRP vorhanden
- [x] HBA1C vorhanden
- [x] Flags vorhanden
- [x] Units vorhanden
- [x] Specimen Begriffe vorhanden

## Erfolgskriterium
Das System kann Kernanalysen korrekt in FR und AR anzeigen.

---

## Phase 19 – UI Qualität

## Pflicht
- [x] Buttons aus shared/ui
- [x] Inputs aus shared/ui
- [x] Tabellen aus shared/ui
- [x] Badges aus shared/ui
- [x] keine wilden Inline Styles
- [x] konsistente Farben
- [x] H/L/CRITICAL farbig dargestellt
- [x] leere Zustände vorhanden
- [x] Ladezustände vorhanden
- [x] Fehlerzustände vorhanden

## Erfolgskriterium
Das UI wirkt konsistent und verständlich.

---

## Phase 20 – Tests Minimum

## Backend Tests
- [x] Auth E2E Test
- [x] Patient E2E Test
- [x] Order E2E Test
- [x] Report E2E Test
- [x] Prisma-basierte Testdatenstrategie vorhanden

## Frontend Tests
- [x] Login render test
- [x] Patient Form render test
- [x] Language switch test
- [x] RTL test

## API/Doku Tests
- [x] Swagger / OpenAPI erreichbar
- [x] dokumentierte Hauptendpunkte stimmen mit Implementierung überein

## Erfolgskriterium
Kritische MVP-Flows sind testbar abgesichert.

---

## End-to-End Hauptworkflow

Dieser Workflow muss im MVP vollständig funktionieren:

### Schritt 1
- [x] User loggt sich als RECEPTION ein

### Schritt 2
- [x] Patient wird angelegt

### Schritt 3
- [x] Order mit mindestens einem Test wird angelegt

### Schritt 4
- [x] Technician erstellt Specimen

### Schritt 5
- [x] Technician erfasst Result

### Schritt 6
- [x] Physician generiert oder öffnet Report

### Schritt 7
- [x] Physician validiert Report

### Schritt 8
- [x] Physician signiert/finalisiert Report

### Schritt 9
- [x] Report wird publiziert

### Schritt 10
- [x] Patient sieht den Report im Portal

## Erfolgskriterium
Kompletter Labordurchlauf von Aufnahme bis veröffentlichter Befund funktioniert.

---

## Nicht im MVP

Diese Punkte sind bewusst nicht verpflichtend für Version 1:

- [ ] HL7 Geräteschnittstellen
- [ ] FHIR Integration
- [ ] KI Kommentarvorschläge
- [ ] Mehrmandantenfähigkeit
- [ ] Abrechnung / Versicherung
- [ ] SMS / WhatsApp Benachrichtigungen
- [ ] komplexes Qualitätsmanagement
- [ ] Statistik / BI Dashboards
- [ ] Offline Modus

---

## Finale MVP Abnahme

Das MVP ist abnahmebereit, wenn:

- [ ] Docker lokal stabil läuft
- [ ] Prisma Schema und Migrationen stabil sind
- [x] OpenAPI / Swagger aktuell und erreichbar ist
- [x] Auth funktioniert
- [x] FR/AR funktioniert
- [x] RTL funktioniert
- [x] Patient Modul funktioniert
- [x] Order Modul funktioniert
- [x] Specimen Modul funktioniert
- [x] Result Modul funktioniert
- [x] Report Modul funktioniert
- [x] Patient Portal funktioniert
- [x] Reagent Modul Grundfunktionen funktionieren
- [x] Rollen/Rechte funktionieren
- [ ] Audit für kritische Aktionen funktioniert
- [x] medizinische Begriffe korrekt erscheinen
- [x] Hauptworkflow End-to-End funktioniert

---

## Priorisierung

### Must Have
- Docker
- Contracts
- Prisma Schema
- OpenAPI
- Auth
- Patient
- Order
- Specimen
- Result
- Report
- Portal
- i18n
- Rollen

### Should Have
- Reagent Basic
- Audit
- Dashboard

### Could Have
- PDF schöner machen
- bessere Suche
- Filter
- Export

---

## Claude Code Prompt für diese Checklist

```text
LIES DIESES KOMPLETTE DOKUMENT 09-MVP-CHECKLIST.md.

Nutze dieses Dokument als verbindliche Umsetzungs- und Abnahmeliste.

WICHTIGE REGELN:
1. Implementiere zuerst alle Punkte aus Must Have.
2. Arbeite modulweise in der Reihenfolge der Phasen.
3. Markiere intern, welche Dateien/Funktionen zu welcher Phase gehören.
4. Priorisiere immer den vollständigen End-to-End Hauptworkflow.
5. Implementiere nur dann Should Have, wenn Must Have vollständig ist.
6. Berücksichtige FR/AR und Rollen von Anfang an.
7. Sorge dafür, dass Prisma Schema und OpenAPI immer mitgezogen werden.
8. Sorge dafür, dass das System lokal in Docker startbar bleibt.
9. Halte `11-PRISMA-SCHEMA.md` und `12-OPENAPI.md` synchron mit dem Projektstand.

Nutze diese Checklist als Definition of Done für das MVP.
```

---
