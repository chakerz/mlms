# 01-PROJECT-OVERVIEW.md

# Project Overview – MLMS

## Ziel

MLMS steht für **Medical Laboratory Management System**.

Dieses Projekt ist ein webbasiertes Laborverwaltungssystem für den vollständigen Ablauf in einem medizinischen Labor – von der Patientenaufnahme bis zur Veröffentlichung des Befunds im Patientenportal.

Das System soll:

- Laborprozesse strukturieren
- manuelle Fehler reduzieren
- die Zusammenarbeit zwischen Empfang, Laborpersonal und Ärzten verbessern
- Befunde sicher und nachvollziehbar verwalten
- Französisch und Arabisch unterstützen
- für spätere Erweiterungen sauber vorbereitet sein

---

## Projektidee

MLMS ist als modernes, modulares System gedacht.

Es kombiniert:

- internes Labor-Backoffice
- medizinische Ergebnisverwaltung
- Befundvalidierung
- Patientenportal
- grundlegende Reagenz- und Bestandsverwaltung
- zweisprachige Benutzeroberfläche

Das System ist nicht nur eine Datensammlung, sondern ein klar geführter Arbeitsablauf für Laborprozesse.

---

## Hauptproblem

Viele Laborabläufe sind in kleineren oder mittelgroßen Einrichtungen noch:

- papierlastig
- uneinheitlich dokumentiert
- schwer nachvollziehbar
- technisch nicht integriert
- sprachlich nicht an den lokalen Bedarf angepasst

MLMS soll diese Probleme durch einen strukturierten digitalen Ablauf lösen.

---

## Kernziel des MVP

Das MVP muss einen vollständigen minimalen End-to-End-Laborprozess ermöglichen:

1. Benutzer meldet sich an
2. Patient wird angelegt
3. Order wird erstellt
4. Probe wird registriert
5. Resultate werden erfasst
6. Report wird generiert
7. Report wird validiert und signiert
8. Report wird veröffentlicht
9. Patient sieht den Report im Portal

Wenn dieser Ablauf stabil funktioniert, ist das MVP fachlich erfolgreich.

---

## Zielgruppen

MLMS richtet sich an mehrere Benutzergruppen innerhalb eines Labors.

### Interne Benutzer
- Empfang / Rezeption
- Labortechniker
- Laborarzt / Physician
- Administrator

### Externe Benutzer
- Patienten

---

## Benutzerrollen

## RECEPTION
Verantwortlich für:
- Patientenerfassung
- Suche von Patienten
- Erstellen von Orders
- allgemeine administrative Vorbereitung

## TECHNICIAN
Verantwortlich für:
- Probenregistrierung
- Statuspflege von Proben
- Erfassung von Resultaten
- technische Laborarbeit

## PHYSICIAN
Verantwortlich für:
- fachliche Prüfung
- Validierung von Reports
- Signatur / Finalisierung
- medizinische Freigabe

## ADMIN
Verantwortlich für:
- Benutzerverwaltung
- Rollen
- Systemgrunddaten
- Reagenzien-Grundverwaltung
- technische Konfiguration

## PATIENT
Verantwortlich für:
- Einsicht in veröffentlichte Reports
- Nutzung des Patientenportals

---

## Hauptmodule

Das System besteht im MVP mindestens aus diesen Modulen:

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
- Audit
- Docker Development Setup
- Prisma Schema
- OpenAPI / Swagger

---

## Fachlicher Hauptworkflow

Der typische Ablauf in MLMS ist:

1. Rezeption legt Patient an
2. Rezeption erstellt Order mit einem oder mehreren Tests
3. Techniker registriert Specimen
4. Techniker erfasst Resultate
5. Physician prüft den Fall
6. Physician validiert und signiert den Report
7. Report wird veröffentlicht
8. Patient sieht den Report im Portal

Das ist der wichtigste Kernprozess des gesamten Systems.

---

## Sprachkonzept

Das System muss von Anfang an zweisprachig sein.

Pflichtsprachen:

- Französisch (`fr`)
- Arabisch (`ar`)

Zusätzliche Regeln:

- Arabisch benötigt RTL-Unterstützung
- medizinische Begriffe müssen in beiden Sprachen konsistent gepflegt werden
- patientenfreundliche Begriffe sollen möglich sein
- technische Codes bleiben stabil und werden nicht übersetzt

---

## Technische Grundidee

MLMS wird als Monorepo mit klar getrennten Bereichen aufgebaut:

- `backend/`
- `frontend/`
- `contracts/`
- `docs/`

### Backend
Das Backend stellt API, Authentifizierung, Rollen, Business-Logik, Persistenzzugriff und Audit bereit.

### Frontend
Das Frontend stellt die Benutzeroberfläche für Laborpersonal und Patientenportal bereit.

### Contracts
Das Contracts-Paket enthält gemeinsame TypeScript-Typen und DTOs für Backend und Frontend.

### Docs
Die `docs/`-Struktur definiert Architektur, Domäne, Datenmodell, API und Arbeitsregeln.

---

## Geplanter Technologie-Stack

### Backend
- Node.js
- NestJS
- Prisma
- PostgreSQL
- JWT
- RBAC

### Frontend
- React
- Vite
- TypeScript
- Redux Toolkit / RTK Query
- i18n FR/AR
- RTL Support

### Entwicklung
- Docker
- Docker Compose
- GitHub
- OpenAPI / Swagger

---

## Architekturprinzipien

Für das Projekt gelten diese Grundprinzipien:

### 1. Domain first
Fachliche Regeln kommen vor technischer Bequemlichkeit.

### 2. Contracts first
API-Feldnamen und DTOs müssen stabil und konsistent sein.

### 3. Dokumentation ist verbindlich
Die Dokumentation in `docs/` ist die Referenz für Struktur und Umsetzung.

### 4. MVP vor Zusatzfeatures
Erst der vollständige Hauptworkflow, dann Erweiterungen.

### 5. Zweisprachigkeit von Anfang an
FR und AR sind kein nachträgliches Add-on.

### 6. Sicherheit ist Pflicht
Auth, Rollen und nachvollziehbare Aktionen sind Grundanforderungen.

### 7. Erweiterbarkeit ohne Chaos
Das System soll später um Schnittstellen, KI-Funktionen und weitere Module erweitert werden können, ohne die Grundstruktur zu brechen.

---

## Was im MVP enthalten ist

Pflicht im MVP:

- Login
- Rollen und Rechte
- Patientenverwaltung
- Order-Erfassung
- Specimen-Erfassung
- Result-Eingabe
- Report-Validierung
- Report-Publikation
- Patientenportal
- medizinische Begriffe FR/AR
- Reagent Basic
- Audit kritischer Aktionen
- Docker-Entwicklungsumgebung
- Prisma-Datenmodell
- OpenAPI-Dokumentation

---

## Was nicht Teil des MVP ist

Diese Punkte sind vorerst bewusst nicht verpflichtend:

- HL7 Geräteschnittstellen
- FHIR Integration
- Abrechnung / Insurance
- Multi-Tenant Architektur
- komplexes Qualitätsmanagement
- fortgeschrittene BI / Analytics
- Offline-Modus
- automatische KI-Kommentare
- komplexe externe Integrationen

---

## Erwartete Vorteile

MLMS soll folgende konkrete Vorteile bringen:

- klarer Laborprozess
- weniger Medienbrüche
- bessere Nachvollziehbarkeit
- zentralisierte Daten
- konsistente Befunddarstellung
- bessere Patientenzugänglichkeit
- sprachlich passende Benutzeroberfläche
- sauber erweiterbare Architektur

---

## Wichtige Projektdokumente

Dieses Dokument ist nur der Einstieg.

Die vollständige Projektdefinition ergibt sich aus den weiteren Dateien in `docs/`.

Empfohlene Lesereihenfolge:

1. `00-DOCS-INDEX.md`
2. `01-PROJECT-OVERVIEW.md`
3. `02-BACKEND-STRUCTURE.md`
4. `03-FRONTEND-STRUCTURE.md`
5. `04-DOMAIN-MODEL.md`
6. `05-API-CONTRACTS.md`
7. `06-I18N.md`
8. `07-DOCKER.md`
9. `08-MEDICAL-TERMS.md`
10. `11-PRISMA-SCHEMA.md`
11. `12-OPENAPI.md`
12. `09-MVP-CHECKLIST.md`
13. `10-CLAUDE-PROMPTS.md`

---

## Projektstatus

Dieses Projekt befindet sich aktuell in der Setup- und Architekturphase.

Die ersten Prioritäten sind:

1. saubere Repository-Struktur
2. vollständige Dokumentation
3. Docker-Entwicklungsumgebung
4. Contracts-Paket
5. Prisma-Schema
6. OpenAPI-Grundlage
7. Backend-Fundament
8. Frontend-Fundament

---

## Erfolgskriterien

Das Projekt ist im ersten Schritt erfolgreich, wenn:

- die Repository-Struktur sauber steht
- die Dokumentation konsistent ist
- Docker lokal funktioniert
- Contracts definiert sind
- Prisma-Schema steht
- OpenAPI dokumentiert ist
- Backend und Frontend sauber starten
- der MVP-Hauptworkflow vollständig umgesetzt werden kann

---

## Definition of Done für dieses Dokument

Dieses Dokument ist korrekt, wenn:

- Ziel und Umfang des Projekts klar beschrieben sind
- Hauptrollen klar benannt sind
- Hauptmodule klar benannt sind
- MVP und Nicht-MVP sauber getrennt sind
- Sprachkonzept definiert ist
- technischer Grundaufbau beschrieben ist
- Zusammenhang zu den restlichen `docs/` klar ist

---

## Claude Code Prompt für dieses Dokument

```text
LIES DIESES KOMPLETTE DOKUMENT `01-PROJECT-OVERVIEW.md`.

Nutze dieses Dokument als Einstieg in das MLMS-Projekt.

WICHTIGE REGELN:
1. Verstehe zuerst das Gesamtziel des Projekts.
2. Halte dich an den beschriebenen MVP-Scope.
3. Behandle FR und AR als Pflichtbestandteil.
4. Respektiere die Rollen und den fachlichen Hauptworkflow.
5. Nutze dieses Dokument als Einstieg, aber nicht als alleinige technische Quelle.
6. Lies danach die weiteren Dokumente in der definierten Reihenfolge.

Nutze dieses Dokument als Projekt-Kontext vor Backend-, Frontend-, Prisma- oder API-Arbeit.
```

---
