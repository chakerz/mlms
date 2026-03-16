# 00-DOCS-INDEX.md

# MLMS Docs Index

## Ziel

Dieses Dokument ist das zentrale Inhaltsverzeichnis für alle Projekt-Dokumente des MLMS.

Es definiert:

- die empfohlene Lesereihenfolge
- die logische Abhängigkeit zwischen den Dokumenten
- den Zweck jeder Datei
- die Reihenfolge für Implementierung mit Claude Code

WICHTIG:
- Die Reihenfolge ist **nicht nur numerisch**, sondern **fachlich und technisch logisch**.
- Spätere Dokumente dürfen auf frühere Dokumente aufbauen.
- Wenn neue Dokumente ergänzt werden, muss dieser Index mitgepflegt werden.

---

## Empfohlene Lesereihenfolge

Die Dokumente sollen in dieser Reihenfolge gelesen werden:

1. `01-PROJECT-OVERVIEW.md`
2. `02-BACKEND-STRUCTURE.md`
3. `03-FRONTEND-STRUCTURE.md`
4. `04-DOMAIN-MODEL.md`
5. `05-API-CONTRACTS.md`
6. `06-I18N.md`
7. `07-DOCKER.md`
8. `08-MEDICAL-TERMS.md`
9. `11-PRISMA-SCHEMA.md`
10. `12-OPENAPI.md`
11. `09-MVP-CHECKLIST.md`
12. `10-CLAUDE-PROMPTS.md`

---

## Warum diese Reihenfolge

Die Reihenfolge folgt diesem Prinzip:

1. Erst Produktverständnis
2. Dann technische Struktur
3. Dann Domäne und Daten
4. Dann Verträge und Sprache
5. Dann Infrastruktur
6. Dann medizinische Terminologie
7. Dann Persistenzmodell
8. Dann API-Dokumentation
9. Dann MVP-Abnahme
10. Dann Arbeits-Prompts für Claude Code

Dadurch entstehen keine Dokumente, die auf noch nicht definierte Grundlagen verweisen.

---

## Dokumentübersicht

## 01 – Project Overview

**Datei:** `01-PROJECT-OVERVIEW.md`

Beschreibt:
- Ziel des MLMS
- Systemidee
- Hauptrollen
- Hauptmodule
- MVP-Rahmen
- allgemeine Architekturziele

Lesen als:
- Einstiegspunkt für Menschen
- Produkt- und Kontextverständnis

---

## 02 – Backend Structure

**Datei:** `02-BACKEND-STRUCTURE.md`

Beschreibt:
- Backend-Ordnerstruktur
- Modulgrenzen
- Schichtung
- Architekturregeln
- Verantwortlichkeiten von Domain, Application, Infrastructure und Interfaces

Lesen als:
- Grundlage für NestJS-Struktur
- Referenz für Backend-Dateien

---

## 03 – Frontend Structure

**Datei:** `03-FRONTEND-STRUCTURE.md`

Beschreibt:
- Frontend-Ordnerstruktur
- Feature-Schnitt
- Shared/UI Regeln
- Routing-Organisation
- State-Organisation

Lesen als:
- Grundlage für React/Vite-Struktur
- Referenz für Pages, Features und Shared Components

---

## 04 – Domain Model

**Datei:** `04-DOMAIN-MODEL.md`

Beschreibt:
- zentrale fachliche Entities
- Beziehungen
- Statusmodelle
- Regeln und Verantwortlichkeiten
- fachliche Kernlogik

Lesen als:
- wichtigste fachliche Referenz
- Ausgangspunkt für Prisma, DTOs und Use Cases

---

## 05 – API Contracts

**Datei:** `05-API-CONTRACTS.md`

Beschreibt:
- DTOs
- Request- und Response-Formate
- gemeinsame Types
- Frontend/Backend-Verträge
- Namenskonventionen

Lesen als:
- verbindliche Vertragsgrundlage
- Referenz für `contracts/`, Controller und Frontend API Layer

---

## 06 – I18N

**Datei:** `06-I18N.md`

Beschreibt:
- Internationalisierung
- FR/AR Sprachstruktur
- RTL-Regeln
- Übersetzungsdateien
- Frontend-Sprachverhalten

Lesen als:
- Grundlage für UI-Texte
- Referenz für Sprachumschaltung und RTL

---

## 07 – Docker

**Datei:** `07-DOCKER.md`

Beschreibt:
- lokale Entwicklungsumgebung
- Docker Compose
- Container-Struktur
- Volumes
- ENV-Konventionen
- lokale Startbefehle

Lesen als:
- Grundlage für lokale Entwicklung
- technische Start- und Betriebsbasis

---

## 08 – Medical Terms

**Datei:** `08-MEDICAL-TERMS.md`

Beschreibt:
- medizinische Begriffe in FR und AR
- Testcodes
- Einheiten
- Flags
- Specimen-Typen
- patientenfreundliche Begriffe

Lesen als:
- Terminologie-Referenz
- Grundlage für `medical.json`

---

## 11 – Prisma Schema

**Datei:** `11-PRISMA-SCHEMA.md`

Beschreibt:
- vollständiges Prisma-Datenmodell
- PostgreSQL-Relationen
- Enums
- Indizes
- Unique Constraints
- Persistenzentscheidungen

Abhängigkeiten:
- baut auf `04-DOMAIN-MODEL.md` auf
- muss konsistent zu `05-API-CONTRACTS.md` bleiben

Lesen als:
- Grundlage für `backend/prisma/schema.prisma`
- Referenz für Migrationen und Repositories

---

## 12 – OpenAPI

**Datei:** `12-OPENAPI.md`

Beschreibt:
- OpenAPI-Strategie
- Swagger
- Endpunkt-Dokumentation
- Security
- Schemas
- Error-Modelle
- Examples

Abhängigkeiten:
- baut auf `05-API-CONTRACTS.md` auf
- muss konsistent zu `11-PRISMA-SCHEMA.md` und implementierten Endpunkten bleiben

Lesen als:
- Grundlage für `backend/openapi/mlms.openapi.yaml`
- Referenz für Swagger und API-Dokumentation

---

## 09 – MVP Checklist

**Datei:** `09-MVP-CHECKLIST.md`

Beschreibt:
- Umsetzungsphasen
- MVP Scope
- Akzeptanzkriterien
- End-to-End Workflow
- Definition of Done

Abhängigkeiten:
- darf sich auf vorher definierte Architektur-, Daten- und API-Dokumente beziehen

Lesen als:
- Projektsteuerung
- Sprint- und Abnahmeliste

---

## 10 – Claude Prompts

**Datei:** `10-CLAUDE-PROMPTS.md`

Beschreibt:
- standardisierte Arbeits-Prompts für Claude Code
- Phase-für-Phase Prompts
- Setup-, Debug-, Refactor- und Abschluss-Prompts
- Reihenfolge für die Umsetzung

Abhängigkeiten:
- baut auf allen vorherigen Dokumenten auf
- muss Prisma und OpenAPI explizit mit berücksichtigen

Lesen als:
- operatives Arbeitsbuch
- direkte Ausführungsgrundlage für Claude Code

---

## Abhängigkeitslogik

Die Dokumente hängen fachlich so zusammen:

```text
01-PROJECT-OVERVIEW
 ├─ 02-BACKEND-STRUCTURE
 ├─ 03-FRONTEND-STRUCTURE
 └─ 04-DOMAIN-MODEL
      ├─ 05-API-CONTRACTS
      │   ├─ 12-OPENAPI
      │   └─ 10-CLAUDE-PROMPTS
      ├─ 11-PRISMA-SCHEMA
      │   └─ 10-CLAUDE-PROMPTS
      ├─ 08-MEDICAL-TERMS
      └─ 09-MVP-CHECKLIST
06-I18N
 ├─ 08-MEDICAL-TERMS
 ├─ 09-MVP-CHECKLIST
 └─ 10-CLAUDE-PROMPTS
07-DOCKER
 ├─ 09-MVP-CHECKLIST
 └─ 10-CLAUDE-PROMPTS
```

---

## Reihenfolge für Claude Code

Claude Code soll im Normalfall diese Lesereihenfolge verwenden:

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

## Reihenfolge für die Implementierung

Die empfohlene Umsetzungsreihenfolge im Projekt ist:

1. Projektstruktur
2. Docker
3. Contracts
4. Prisma Schema
5. OpenAPI Grundstruktur
6. Backend Fundament
7. Frontend Fundament
8. i18n
9. Auth
10. Patient
11. Order
12. Specimen
13. Result
14. Report
15. Portal
16. Reagent Basic
17. Audit
18. Tests
19. MVP-Härtung

---

## Pflege-Regeln für neue Dokumente

Wenn ein neues Dokument ergänzt wird, gelten diese Regeln:

1. Es muss in diesem Index eingetragen werden.
2. Seine fachlichen Abhängigkeiten müssen klar sein.
3. Falls es von `09-MVP-CHECKLIST.md` oder `10-CLAUDE-PROMPTS.md` referenziert werden sollte, müssen diese Dateien mit aktualisiert werden.
4. Die numerische Dateinummer darf nicht die logische Reihenfolge verfälschen.
5. Wenn nötig, darf die logische Reihenfolge hier von der Nummernfolge abweichen.

---

## Regeln zur Konsistenz

Folgende Konsistenz muss immer erhalten bleiben:

- `04-DOMAIN-MODEL.md` ↔ `11-PRISMA-SCHEMA.md`
- `05-API-CONTRACTS.md` ↔ `12-OPENAPI.md`
- `08-MEDICAL-TERMS.md` ↔ `06-I18N.md`
- `09-MVP-CHECKLIST.md` ↔ alle MVP-relevanten Grundlagendokumente
- `10-CLAUDE-PROMPTS.md` ↔ alle Dokumente, die Claude Code lesen soll

---

## Mindestregel für Änderungen

Bei Änderungen an einem dieser Bereiche müssen folgende Dateien geprüft werden:

### Wenn Domain geändert wird
- `04-DOMAIN-MODEL.md`
- `05-API-CONTRACTS.md`
- `11-PRISMA-SCHEMA.md`
- `12-OPENAPI.md`
- `09-MVP-CHECKLIST.md`
- `10-CLAUDE-PROMPTS.md`

### Wenn API geändert wird
- `05-API-CONTRACTS.md`
- `12-OPENAPI.md`
- `09-MVP-CHECKLIST.md`
- `10-CLAUDE-PROMPTS.md`

### Wenn Persistenz geändert wird
- `11-PRISMA-SCHEMA.md`
- `04-DOMAIN-MODEL.md`
- ggf. `05-API-CONTRACTS.md`
- `09-MVP-CHECKLIST.md`
- `10-CLAUDE-PROMPTS.md`

### Wenn medizinische Begriffe geändert werden
- `08-MEDICAL-TERMS.md`
- `06-I18N.md`
- `09-MVP-CHECKLIST.md`
- `10-CLAUDE-PROMPTS.md`

---

## Kurzfassung für Menschen

Wenn du neu ins Projekt kommst, lies zuerst:

1. `01-PROJECT-OVERVIEW.md`
2. `04-DOMAIN-MODEL.md`
3. `05-API-CONTRACTS.md`
4. `11-PRISMA-SCHEMA.md`
5. `12-OPENAPI.md`
6. `09-MVP-CHECKLIST.md`

Wenn du mit Claude Code arbeitest, lies zusätzlich:

7. `10-CLAUDE-PROMPTS.md`

---

## Definition of Done

Dieser Docs-Index ist korrekt, wenn:

- alle vorhandenen Kerndokumente enthalten sind
- die logische Reihenfolge klar ist
- Prisma und OpenAPI korrekt einsortiert sind
- die Abhängigkeiten sichtbar sind
- `09-MVP-CHECKLIST.md` und `10-CLAUDE-PROMPTS.md` logisch auf später ergänzte Grundlagen verweisen
- neue Mitwirkende damit die Doku ohne Widerspruch lesen können

---

## Claude Code Prompt für dieses Index-File

```text
LIES DIESES KOMPLETTE DOKUMENT `00-DOCS-INDEX.md`.

Nutze es als verbindlichen Einstiegspunkt für alle Arbeiten am MLMS.

WICHTIGE REGELN:
1. Lies die Dokumente in der hier definierten logischen Reihenfolge.
2. Verwechsle die numerische Reihenfolge nicht mit der fachlichen Abhängigkeit.
3. Wenn du neue Dokumente anlegst, ergänze diesen Index.
4. Wenn ein Dokument neue Grundlage für MVP oder Implementierung wird, aktualisiere auch:
   - `09-MVP-CHECKLIST.md`
   - `10-CLAUDE-PROMPTS.md`
5. Halte Prisma und OpenAPI immer als verbindliche Grundlagen synchron mit dem Rest der Dokumentation.

Nutze dieses Dokument als Startpunkt für jede neue Arbeitssession.
```

---
