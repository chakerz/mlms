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
- [ ] Monorepo-Struktur vorhanden
- [ ] `backend/` vorhanden
- [ ] `frontend/` vorhanden
- [ ] `contracts/` vorhanden
- [ ] `docs/` vorhanden
- [ ] `.env.example` vorhanden
- [ ] `docker-compose.yml` vorhanden
- [ ] `Makefile` vorhanden
- [ ] Git Repository initialisiert
- [ ] `.gitignore` vorhanden

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
- [ ] `contracts/` Package angelegt
- [ ] Common DTOs vorhanden
- [ ] Auth DTOs vorhanden
- [ ] Patient DTOs vorhanden
- [ ] Order DTOs vorhanden
- [ ] Specimen DTOs vorhanden
- [ ] Result DTOs vorhanden
- [ ] Report DTOs vorhanden
- [ ] Reagent DTOs vorhanden
- [ ] Portal DTOs vorhanden
- [ ] alle `index.ts` Exporte vorhanden

## Erfolgskriterium
Frontend und Backend können gemeinsame Typen importieren.

---

## Phase 3 – Prisma Schema & Persistenzmodell

## Pflicht
- [ ] `backend/prisma/schema.prisma` vorhanden
- [ ] PostgreSQL Provider konfiguriert
- [ ] alle Kern-Enums vorhanden
- [ ] User Modell vorhanden
- [ ] Patient Modell vorhanden
- [ ] Order Modell vorhanden
- [ ] TestOrder Modell vorhanden
- [ ] Specimen Modell vorhanden
- [ ] Result Modell vorhanden
- [ ] Report Modell vorhanden
- [ ] Reagent Modell vorhanden
- [ ] ReagentLot Modell vorhanden
- [ ] StorageLocation Modell vorhanden
- [ ] AuditEntry Modell vorhanden
- [ ] TestDefinition Modell vorhanden
- [ ] Relationen korrekt gesetzt
- [ ] Unique Constraints korrekt gesetzt
- [ ] wichtige Indizes gesetzt
- [ ] `prisma format` läuft
- [ ] `prisma validate` läuft
- [ ] erste Migration erzeugbar
- [ ] Prisma Client generierbar
- [ ] `prisma/seed.ts` Grundlage vorhanden

## Erfolgskriterium
Das Datenmodell ist mit Domain Model und Contracts konsistent und migrationsfähig.

---

## Phase 4 – OpenAPI & Swagger

## Pflicht
- [ ] `backend/openapi/mlms.openapi.yaml` vorhanden oder gleichwertige generierte Swagger-Doku vorhanden
- [ ] OpenAPI Version definiert
- [ ] Bearer JWT Security dokumentiert
- [ ] Standard Error Model dokumentiert
- [ ] Standard Response Envelopes dokumentiert
- [ ] gemeinsame Enums dokumentiert
- [ ] Auth Endpunkte dokumentiert
- [ ] Patient Endpunkte dokumentiert
- [ ] Order Endpunkte dokumentiert
- [ ] Specimen Endpunkte dokumentiert
- [ ] Result Endpunkte dokumentiert
- [ ] Report Endpunkte dokumentiert
- [ ] Reagent Endpunkte dokumentiert
- [ ] Portal Endpunkte dokumentiert
- [ ] Request/Response Examples für Hauptpfade vorhanden
- [ ] Swagger UI erreichbar

## Erfolgskriterium
API ist für Frontend, Testing und spätere Integrationen nachvollziehbar dokumentiert.

---

## Phase 5 – Backend Grundsystem

## Pflicht
- [ ] NestJS Projekt läuft
- [ ] `main.ts` vorhanden
- [ ] `app.module.ts` vorhanden
- [ ] Config Module vorhanden
- [ ] Prisma Module vorhanden
- [ ] Global Validation Pipe vorhanden
- [ ] Global Exception Filter vorhanden
- [ ] Language Middleware vorhanden
- [ ] JWT Grundsystem vorhanden
- [ ] RBAC Grundsystem vorhanden

## Erfolgskriterium
Backend startet sauber und besitzt Fundament für Module.

---

## Phase 6 – Auth Modul

## Pflicht
- [ ] `POST /api/auth/login` implementiert
- [ ] `POST /api/auth/register` implementiert
- [ ] `GET /api/auth/me` implementiert
- [ ] User Entity vorhanden
- [ ] Passwort-Hashing vorhanden
- [ ] JWT Token Erstellung vorhanden
- [ ] JWT Guard vorhanden
- [ ] Rollenprüfung vorhanden
- [ ] deaktivierte User werden blockiert

## UI Pflicht
- [ ] LoginPage vorhanden
- [ ] LoginForm vorhanden
- [ ] Fehleranzeige bei falschem Login
- [ ] User Session im Frontend gespeichert
- [ ] Logout möglich

## Doku Pflicht
- [ ] Auth Endpunkte in OpenAPI aktuell
- [ ] Auth DTOs und Swagger Schemas konsistent

## Erfolgskriterium
Ein User kann sich anmelden und rollenbasiert ins System kommen.

---

## Phase 7 – i18n Grundsystem

## Pflicht
- [ ] `frontend/src/i18n/index.ts` vorhanden
- [ ] `frontend/src/i18n/rtl.ts` vorhanden
- [ ] FR Übersetzungen vorhanden
- [ ] AR Übersetzungen vorhanden
- [ ] `common.json` vorhanden
- [ ] `auth.json` vorhanden
- [ ] `patient.json` vorhanden
- [ ] `statuses.json` vorhanden
- [ ] `medical.json` vorhanden
- [ ] Fallback Sprache ist FR

## UI Pflicht
- [ ] Sprachumschalter vorhanden
- [ ] FR Ansicht funktioniert
- [ ] AR Ansicht funktioniert
- [ ] RTL wird korrekt gesetzt
- [ ] Sidebar/Layout funktioniert in RTL
- [ ] Formulare funktionieren in RTL

## Erfolgskriterium
App kann vollständig zwischen FR und AR umschalten.

---

## Phase 8 – Patient Modul

## Backend Pflicht
- [ ] `POST /api/patients` implementiert
- [ ] `GET /api/patients` implementiert
- [ ] `GET /api/patients/:id` implementiert
- [ ] `PATCH /api/patients/:id` implementiert
- [ ] Patient Entity vorhanden
- [ ] Patient Repository vorhanden
- [ ] RegisterPatient Use Case vorhanden
- [ ] UpdatePatient Use Case vorhanden
- [ ] GetPatientById Use Case vorhanden
- [ ] ListPatients Use Case vorhanden

## Frontend Pflicht
- [ ] PatientListPage vorhanden
- [ ] PatientCreatePage vorhanden
- [ ] PatientDetailPage vorhanden
- [ ] PatientForm vorhanden
- [ ] PatientTable vorhanden
- [ ] Patientsuche vorhanden
- [ ] Validierungsfehler sichtbar
- [ ] Erfolgsmeldung bei Erstellung

## Daten Pflicht
- [ ] firstName
- [ ] lastName
- [ ] birthDate
- [ ] gender
- [ ] phone optional
- [ ] email optional
- [ ] address optional

## Konsistenz Pflicht
- [ ] Prisma Modell `Patient` stimmt mit Domain Model überein
- [ ] OpenAPI Patient Schemas aktuell
- [ ] Contracts und Frontend Types konsistent

## Erfolgskriterium
Ein Patient kann erstellt, bearbeitet, gefunden und angezeigt werden.

---

## Phase 9 – Order Modul

## Backend Pflicht
- [ ] `POST /api/orders` implementiert
- [ ] `GET /api/orders` implementiert
- [ ] `GET /api/orders/:id` implementiert
- [ ] `PATCH /api/orders/:id/status` implementiert
- [ ] CreateOrder Use Case vorhanden
- [ ] ListOrders Use Case vorhanden
- [ ] GetOrderById Use Case vorhanden
- [ ] UpdateOrderStatus Use Case vorhanden
- [ ] Order Statusmodell implementiert
- [ ] TestOrder Struktur implementiert

## Frontend Pflicht
- [ ] OrderListPage vorhanden
- [ ] OrderCreatePage vorhanden
- [ ] OrderDetailPage vorhanden
- [ ] OrderForm vorhanden
- [ ] TestSelection UI vorhanden
- [ ] Prioritätsauswahl vorhanden
- [ ] Status Badge vorhanden

## Fachlich Pflicht
- [ ] Order muss einen Patienten haben
- [ ] Order muss mindestens einen Test haben
- [ ] PENDING als Startstatus

## Konsistenz Pflicht
- [ ] Prisma Modelle `Order` und `TestOrder` korrekt
- [ ] OpenAPI Order Endpunkte aktuell
- [ ] Statuswerte überall identisch

## Erfolgskriterium
Reception kann für einen Patienten eine Order mit Tests anlegen.

---

## Phase 10 – Specimen Modul

## Backend Pflicht
- [ ] `POST /api/specimens` implementiert
- [ ] `GET /api/specimens/:id` implementiert
- [ ] `PATCH /api/specimens/:id/status` implementiert
- [ ] CreateSpecimen Use Case vorhanden
- [ ] UpdateSpecimenStatus Use Case vorhanden
- [ ] Barcode Feld vorhanden
- [ ] Barcode Eindeutigkeit gewährleistet

## Frontend Pflicht
- [ ] SpecimenListPage vorhanden
- [ ] SpecimenCreatePage vorhanden
- [ ] SpecimenForm vorhanden
- [ ] BarcodePreview vorhanden
- [ ] SpecimenStatusBadge vorhanden

## Fachlich Pflicht
- [ ] Specimen gehört zu Order
- [ ] Typ ist auswählbar
- [ ] CollectionTime vorhanden
- [ ] Status startet korrekt

## Konsistenz Pflicht
- [ ] Prisma Modell `Specimen` korrekt
- [ ] OpenAPI Specimen Endpunkte aktuell

## Erfolgskriterium
Technician kann eine Probe erfassen und ihren Status verwalten.

---

## Phase 11 – Result Modul

## Backend Pflicht
- [ ] `POST /api/results` implementiert
- [ ] `PATCH /api/results/:id` implementiert
- [ ] `GET /api/specimens/:id/results` implementiert
- [ ] `GET /api/orders/:id/results` implementiert
- [ ] RecordResult Use Case vorhanden
- [ ] UpdateResult Use Case vorhanden
- [ ] Result Flag Modell vorhanden

## Frontend Pflicht
- [ ] ResultEntryPage vorhanden
- [ ] ResultReviewPage vorhanden
- [ ] ResultForm vorhanden
- [ ] ResultTable vorhanden
- [ ] ResultFlagBadge vorhanden
- [ ] ReferenceRange Anzeige vorhanden
- [ ] CriticalAlert vorhanden

## Fachlich Pflicht
- [ ] value ist Pflicht
- [ ] flag ist Pflicht
- [ ] measuredAt ist Pflicht
- [ ] Result gehört zu Specimen
- [ ] Result kann H/L/CRITICAL darstellen

## Konsistenz Pflicht
- [ ] Prisma Modell `Result` korrekt
- [ ] OpenAPI Result Endpunkte aktuell
- [ ] medizinische Codes konsistent mit `medical.json`

## Erfolgskriterium
Technician kann Laborwerte eingeben und prüfen.

---

## Phase 12 – Report Modul

## Backend Pflicht
- [ ] `POST /api/reports/generate` implementiert
- [ ] `GET /api/reports/:id` implementiert
- [ ] `POST /api/reports/:id/validate` implementiert
- [ ] `POST /api/reports/:id/sign` implementiert
- [ ] `POST /api/reports/:id/publish` implementiert
- [ ] GenerateReport Use Case vorhanden
- [ ] ValidateReport Use Case vorhanden
- [ ] SignReport Use Case vorhanden
- [ ] PublishReport Use Case vorhanden

## Frontend Pflicht
- [ ] ReportValidationQueue vorhanden
- [ ] ReportDetailPage vorhanden
- [ ] ReportHeader vorhanden
- [ ] ReportResultTable vorhanden
- [ ] ValidationActions vorhanden
- [ ] SignaturePanel vorhanden
- [ ] PublishButton vorhanden
- [ ] Report Comments FR/AR sichtbar

## Fachlich Pflicht
- [ ] Report startet mit DRAFT
- [ ] Report kann ohne Results nicht validiert werden
- [ ] Nur PHYSICIAN darf validieren
- [ ] Nur validierte Reports dürfen signiert werden
- [ ] Nur finale Reports dürfen publiziert werden

## Konsistenz Pflicht
- [ ] Prisma Modell `Report` korrekt
- [ ] OpenAPI Report Endpunkte aktuell
- [ ] ReportStatus überall identisch

## Erfolgskriterium
Laborarzt kann einen Befund validieren, signieren und publizieren.

---

## Phase 13 – Patient Portal

## Backend Pflicht
- [ ] `GET /api/portal/reports` implementiert
- [ ] `GET /api/portal/reports/:id` implementiert
- [ ] nur publizierte Reports werden ausgeliefert

## Frontend Pflicht
- [ ] PortalLoginPage vorhanden
- [ ] MyReportsPage vorhanden
- [ ] MyReportDetailPage vorhanden
- [ ] ReportCard vorhanden
- [ ] ReportPdfViewer oder HTML View vorhanden
- [ ] Download Button vorhanden
- [ ] Portal in FR und AR verfügbar

## Fachlich Pflicht
- [ ] Patient sieht nur eigene Reports
- [ ] nur veröffentlichte Reports sichtbar
- [ ] medizinische Begriffe korrekt übersetzt
- [ ] patientenfreundliche Anzeige möglich

## Konsistenz Pflicht
- [ ] OpenAPI Portal Endpunkte aktuell
- [ ] Portal DTOs konsistent mit Contracts

## Erfolgskriterium
Patient kann eigene Befunde sicher einsehen.

---

## Phase 14 – Reagent / Inventory Basic

## Backend Pflicht
- [ ] `POST /api/reagents` implementiert
- [ ] `GET /api/reagents` implementiert
- [ ] `POST /api/reagents/lots` implementiert
- [ ] `GET /api/reagents/:id/lots` implementiert
- [ ] `POST /api/reagents/consume` implementiert
- [ ] CreateReagent Use Case vorhanden
- [ ] ReceiveReagentLot Use Case vorhanden
- [ ] ConsumeReagentForTest Use Case vorhanden

## Frontend Pflicht
- [ ] ReagentListPage vorhanden
- [ ] ReagentCreatePage vorhanden
- [ ] ReagentLotPage vorhanden
- [ ] InventoryDashboardPage vorhanden
- [ ] ReagentTable vorhanden
- [ ] ReagentLotTable vorhanden
- [ ] StockAlertBanner vorhanden
- [ ] ExpiryAlertBanner vorhanden

## Fachlich Pflicht
- [ ] LotNumber vorhanden
- [ ] expiryDate vorhanden
- [ ] currentQuantity vorhanden
- [ ] negative Bestände verboten
- [ ] blockierte Lots dürfen nicht verbraucht werden
- [ ] abgelaufene Lots dürfen nicht verbraucht werden

## Konsistenz Pflicht
- [ ] Prisma Modelle `Reagent` und `ReagentLot` korrekt
- [ ] OpenAPI Reagent Endpunkte aktuell

## Erfolgskriterium
Admin kann Reagenzien und Lots verwalten und Verbrauch buchen.

---

## Phase 15 – Dashboard & Navigation

## Pflicht
- [ ] MainLayout vorhanden
- [ ] Sidebar vorhanden
- [ ] Header vorhanden
- [ ] DashboardPage vorhanden
- [ ] Rollenbasierte Menüs vorhanden
- [ ] Logout Button vorhanden
- [ ] Sprachumschalter im Header vorhanden

## Erfolgskriterium
Benutzer navigieren sauber durch das System.

---

## Phase 16 – Rollen & Rechte

## Pflicht
- [ ] RECEPTION Rechte implementiert
- [ ] TECHNICIAN Rechte implementiert
- [ ] PHYSICIAN Rechte implementiert
- [ ] ADMIN Rechte implementiert
- [ ] Backend Guards vorhanden
- [ ] Frontend Route-Schutz vorhanden
- [ ] UI blendet verbotene Aktionen aus

## Erfolgskriterium
Jede Rolle sieht nur ihre erlaubten Bereiche.

---

## Phase 17 – Audit & Nachvollziehbarkeit

## Pflicht
- [ ] AuditEntry Modell vorhanden
- [ ] Login wird geloggt
- [ ] Result Änderungen werden geloggt
- [ ] Report Validation wird geloggt
- [ ] Report Signatur wird geloggt
- [ ] Report Publish wird geloggt
- [ ] Reagent Consumption wird geloggt
- [ ] User Rollenänderung wird geloggt

## Erfolgskriterium
Kritische Aktionen sind nachvollziehbar.

---

## Phase 18 – Medizinische Begriffe

## Pflicht
- [ ] `medical.json` FR vorhanden
- [ ] `medical.json` AR vorhanden
- [ ] dieselben Keys in FR und AR
- [ ] HGB vorhanden
- [ ] WBC vorhanden
- [ ] RBC vorhanden
- [ ] PLT vorhanden
- [ ] GLU vorhanden
- [ ] CRE vorhanden
- [ ] CRP vorhanden
- [ ] HBA1C vorhanden
- [ ] Flags vorhanden
- [ ] Units vorhanden
- [ ] Specimen Begriffe vorhanden

## Erfolgskriterium
Das System kann Kernanalysen korrekt in FR und AR anzeigen.

---

## Phase 19 – UI Qualität

## Pflicht
- [ ] Buttons aus shared/ui
- [ ] Inputs aus shared/ui
- [ ] Tabellen aus shared/ui
- [ ] Badges aus shared/ui
- [ ] keine wilden Inline Styles
- [ ] konsistente Farben
- [ ] H/L/CRITICAL farbig dargestellt
- [ ] leere Zustände vorhanden
- [ ] Ladezustände vorhanden
- [ ] Fehlerzustände vorhanden

## Erfolgskriterium
Das UI wirkt konsistent und verständlich.

---

## Phase 20 – Tests Minimum

## Backend Tests
- [ ] Auth E2E Test
- [ ] Patient E2E Test
- [ ] Order E2E Test
- [ ] Report E2E Test
- [ ] Prisma-basierte Testdatenstrategie vorhanden

## Frontend Tests
- [ ] Login render test
- [ ] Patient Form render test
- [ ] Language switch test
- [ ] RTL test

## API/Doku Tests
- [ ] Swagger / OpenAPI erreichbar
- [ ] dokumentierte Hauptendpunkte stimmen mit Implementierung überein

## Erfolgskriterium
Kritische MVP-Flows sind testbar abgesichert.

---

## End-to-End Hauptworkflow

Dieser Workflow muss im MVP vollständig funktionieren:

### Schritt 1
- [ ] User loggt sich als RECEPTION ein

### Schritt 2
- [ ] Patient wird angelegt

### Schritt 3
- [ ] Order mit mindestens einem Test wird angelegt

### Schritt 4
- [ ] Technician erstellt Specimen

### Schritt 5
- [ ] Technician erfasst Result

### Schritt 6
- [ ] Physician generiert oder öffnet Report

### Schritt 7
- [ ] Physician validiert Report

### Schritt 8
- [ ] Physician signiert/finalisiert Report

### Schritt 9
- [ ] Report wird publiziert

### Schritt 10
- [ ] Patient sieht den Report im Portal

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
- [ ] OpenAPI / Swagger aktuell und erreichbar ist
- [ ] Auth funktioniert
- [ ] FR/AR funktioniert
- [ ] RTL funktioniert
- [ ] Patient Modul funktioniert
- [ ] Order Modul funktioniert
- [ ] Specimen Modul funktioniert
- [ ] Result Modul funktioniert
- [ ] Report Modul funktioniert
- [ ] Patient Portal funktioniert
- [ ] Reagent Modul Grundfunktionen funktionieren
- [ ] Rollen/Rechte funktionieren
- [ ] Audit für kritische Aktionen funktioniert
- [ ] medizinische Begriffe korrekt erscheinen
- [ ] Hauptworkflow End-to-End funktioniert

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
