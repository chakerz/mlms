# Claude-Auftrag: Vollständiger Labor-Workflow im MLMS Dashboard

## Kontext

Wir entwickeln ein MLMS (Medical Laboratory Management System) mit Node.js Backend, React/Vue Frontend, PostgreSQL Datenbank und Docker Containerisierung.

Wir haben bereits:
- Patientenverwaltung
- Auftragsmanagement (Orders/Samples)
- Analyzer-Simulator (Cobas e 411) mit ASTM/TCP Kommunikation
- Instrument-Interface-Layer (Outbox, Inbox, Raw Results)
- Dashboard mit Visualisierung

## Ziel

Baue einen **vollständigen, durchgängigen Labor-Workflow** von der Patientenaufnahme bis zur Übergabe des validierten PDF-Befundes.

Dieser Workflow soll:
- Im Dashboard als **visueller Prozessfortschritt** sichtbar sein
- Jeden Schritt als **klaren Status** abbilden
- Für Laborpersonal und Arzt **rollenbasiert** zugänglich sein
- Am Ende ein **professionelles PDF** mit Ergebnissen erzeugen
- Den Patienten oder Auftraggeber über Ergebnisverfügbarkeit informieren

---

## Gesamtübersicht des Workflows

Der Workflow besteht aus **sechs Hauptphasen**:

```
Phase 1          Phase 2          Phase 3          Phase 4          Phase 5          Phase 6
AUFNAHME    →    PRÉ-ANALYTIK →   ANALYTIK    →    VALIDATION  →    VALIDATION  →    LIVRAISON
Patient          Probe            Maschine         Technique        Médicale         PDF + Info
Registrierung    Barcode          Messung          Technicien        Médecin          Patient
Auftrag          Röhrchen         Ergebnis         Prüfung           Freigabe         Archiv
```

---

## Phase 1 — Patientenaufnahme (Accueil / Admission)

### Beschreibung

Der Patient betritt das Labor oder es wird ein externer Auftrag empfangen.

### Schritte

1. Patient wird gesucht oder neu angelegt
2. Demographische Daten werden erfasst oder bestätigt
3. Auftraggeber / Prescripteur wird erfasst (Arzt, Klinik, intern)
4. Prescriptionsformular wird erfasst oder importiert
5. Analyseauftrag wird erstellt
6. Auftragsnummer / Accession Number wird generiert
7. Auftrag bekommt initialen Status

### Daten die erfasst werden

**Patient:**
- Vorname, Nachname
- Geburtsdatum
- Geschlecht
- ID-Nummer oder Versicherungsnummer
- Adresse optional
- Kontakt (Telefon, E-Mail) optional

**Auftrag:**
- Prescripteur (zuweisender Arzt)
- Auftragsdatum
- Dringlichkeit (ROUTINE / URGENT / STAT)
- Angeforderte Analysen (Testliste)
- Klinische Angaben optional
- Diagnose-Hinweis optional

### Statuses

- `DRAFT`: Aufnahme begonnen
- `REGISTERED`: Auftrag vollständig angelegt

### UI-Anforderungen

- Schnellsuche Patient (Name, ID, Geburtsdatum)
- Formular in Schritte aufgeteilt (Wizard)
- Testauswahl aus Katalog (Suchbar nach Name, Code, Profil)
- Klinische Angaben Freitextfeld
- Anzeige vorheriger Aufträge für denselben Patienten

---

## Phase 2 — Prä-Analytik (Pré-analytique)

### Beschreibung

Probe wird vorbereitet, beschriftet, registriert und dem Analyzer zugeordnet.

### Schritte

1. Probe wird registriert (Sample-Erstellung)
2. Röhrchen-Typ wird bestimmt (je nach Test: Serum, EDTA, Citrat...)
3. Barcode/Accession-Label wird gedruckt
4. Probe wird beim Empfang gescannt und bestätigt
5. Entnahmezeit, Empfangszeit werden gespeichert
6. Probe wird einem Analyzer oder Arbeitsbereich zugeordnet
7. Worklist wird für den Analyzer erstellt
8. Optional: Aliquotierung, Zentrifugation, Vorbereitung

### Daten die gespeichert werden

**Probe:**
- `sample_id`
- `accession_number`
- `barcode`
- `sample_type` (Serum, EDTA, Plasma, Urin, LCR...)
- `tube_color` (Röhrchen-Typ)
- `collected_at`
- `received_at`
- `collected_by`
- `received_by`
- `volume`
- `condition` (Hämolyse, Lipämie, Ikterie)
- `status`

### Statuses

- `EXPECTED`: Probe erwartet
- `RECEIVED`: Probe eingegangen
- `PREPARED`: Probe aufbereitet
- `ASSIGNED_TO_INSTRUMENT`: Analyzer zugewiesen
- `NON_CONFORM`: Probe nicht akzeptabel

### Non-Conformités (Probenmängel)

Folgende Mängel müssen erfasst und entschieden werden können:

- Hämolyse (leicht / mittel / stark)
- Lipämie
- Ikterie
- Falsche Röhrchenfarbe
- Unzureichendes Volumen
- Beschädigung
- Verwechslungsverdacht
- Gerinnsel

Entscheidung pro Non-Conformité:
- Akzeptiert mit Vorbehalt
- Abgelehnt + neue Probe anfordern
- Abgelehnt + Auftrag stornieren

### UI-Anforderungen

- Barcode-Scanner-Unterstützung (Tastatureingabe oder Kamera)
- Label-Druck-Button (PDF oder ZPL für Zebra-Drucker)
- Non-Conformité-Dialog mit Auswahl und Entscheidung
- Übersicht aller empfangenen Proben pro Tag
- Ampel-Anzeige (grün/orange/rot) für Probe-Qualität

---

## Phase 3 — Analytik / Maschinenmessung

### Beschreibung

Die Probe wird in den Analyzer eingelegt, gemessen und das Ergebnis kommt zurück.

### Schritte

1. MLMS sendet Worklist an Analyzer (ASTM bidirektional)
2. Analyzer bestätigt Empfang (ACK)
3. Probe wird physisch in den Analyzer eingelegt
4. Dashboard zeigt Analyzer-Status in Echtzeit (Racks, blinkende Slots)
5. Analyzer misst und sendet Ergebnisse zurück
6. MLMS empfängt Rohresultate
7. Rohresultate werden in `instrument_raw_results` gespeichert
8. Rohresultate werden internen Tests zugeordnet
9. Validierungs-Queue wird befüllt

### Statuses (Analyseauftrag)

- `PENDING_ANALYSIS`: Wartet auf Messung
- `IN_PROGRESS`: Wird gerade gemessen
- `RESULTS_RECEIVED`: Rohresultate eingegangen
- `RESULTS_PARTIAL`: Teilergebnisse eingegangen

### Statuses (Einzelresultat)

- `RAW_RECEIVED`: Rohdaten eingegangen
- `MAPPED`: Internem Test zugeordnet
- `PENDING_TECHNICAL_REVIEW`: Wartet auf technische Prüfung

### UI-Anforderungen

- Echtzeit-Analyzer-Visualisierung (Cobas e 411 Rack, Slot-Fortschritt)
- Tabelle "In Messung" mit Sample-ID, Tests, Progress
- Eingehende Rohresultate in Echtzeit anzeigen
- Fehlerhafte Rohdaten sofort markieren (rote Zeile, Fehlertext)

---

## Phase 4 — Technische Validierung (Validation Technique)

### Beschreibung

Ein Laborant / Technicien prüft die Rohresultate auf technische Plausibilität, bevor ein Arzt sie sieht.

### Schritte

1. Ergebnis landet in technischer Review-Queue
2. Technicien sieht Rohwert, Einheit, Flag vom Gerät
3. Technicien prüft:
   - Messwert plausibel?
   - Referenzbereich?
   - Flag korrekt?
   - Gerät kalibriert?
   - QC akzeptabel?
4. Technicien validiert oder lehnt ab
5. Bei Ablehnung: Ursache angeben, Repeat anfordern oder manuelle Eingabe
6. Nach Akzeptanz: Ergebnis geht in medizinische Validierung

### Validierungsregeln (automatisch prüfen)

Das System soll folgende Regeln automatisch anwenden und markieren:

- Delta-Check: Vergleich mit letztem Resultat desselben Tests
- Panik-Werte: Kritische Grenzwerte (z. B. Kalium > 6.5 mmol/L)
- Plausibilitätsprüfung: Physiologisch möglicher Bereich
- QC-Status des Geräts zum Messzeitpunkt
- Instrument-Flag auswerten

### Aktionen des Techniciens

- `ACCEPT_TECHNICALLY`: Technisch akzeptiert
- `REJECT_TECHNICALLY`: Technisch abgelehnt
- `REQUEST_REPEAT`: Wiederholungsmessung anfordern
- `ENTER_MANUALLY`: Wert manuell eingeben (mit Kommentar)
- `ADD_COMMENT`: Kommentar anfügen

### Statuses nach technischer Validierung

- `TECHNICALLY_ACCEPTED`: Freigegeben für Arzt
- `TECHNICALLY_REJECTED`: Zurückgewiesen
- `REPEAT_REQUESTED`: Wiederholung beantragt
- `MANUALLY_ENTERED`: Manuell erfasst

### UI-Anforderungen

- Validierungs-Tabelle mit allen Ergebnissen in Prüfung
- Spalten: Sample-ID, Patient, Test, Wert, Einheit, Flag, Referenzbereich, Delta-Check, QC-Status
- Markierung kritischer Werte (fett, rot)
- Delta-Check-Differenz direkt anzeigen
- Inline-Kommentarfeld
- Sammelvalidierung möglich (alle akzeptieren, wenn alles grün)
- Einzelvalidierung möglich

---

## Phase 5 — Medizinische Validierung (Validation Médicale)

### Beschreibung

Ein Arzt / Biologiste prüft die technisch validierten Ergebnisse, interpretiert sie und gibt den Befund frei.

### Schritte

1. Arzt sieht Befundliste in Freigabe-Queue
2. Arzt öffnet Befund eines Patienten
3. Arzt sieht:
   - Alle Analyseergebnisse des Auftrags
   - Referenzbereiche
   - Vorherige Ergebnisse zum Vergleich (Historique)
   - Patientenkontext (Alter, Geschlecht, klinische Angaben)
   - Kritische Werte und Flags
4. Arzt kann:
   - Kommentare zu einzelnen Ergebnissen ergänzen
   - Einen allgemeinen Befundkommentar schreiben
   - Einzelne Ergebnisse kommentieren
5. Arzt gibt den Befund frei (Signature / Validation)
6. Status ändert sich auf VALIDATED
7. PDF-Generierung wird angestoßen

### Aktionen des Arztes

- `VALIDATE`: Befund freigeben
- `REJECT_FOR_REVIEW`: An Technicien zurücksenden
- `ADD_GENERAL_COMMENT`: Allgemeiner Kommentar zum Befund
- `ADD_RESULT_COMMENT`: Kommentar zu einzelnem Testergebnis
- `FLAG_CRITICAL`: Kritischen Befund eskalieren

### Statuses

- `PENDING_MEDICAL_REVIEW`: Wartet auf Arzt
- `MEDICALLY_VALIDATED`: Befund freigegeben
- `REJECTED_BACK_TO_TECH`: Zurück an Technicien
- `CRITICAL_FLAGGED`: Kritischer Befund eskaliert

### UI-Anforderungen

- Befundliste mit Filtern: Patient, Datum, Dringlichkeit, Auftragsstatus
- Detailseite pro Auftrag:
  - Patientenheader (Name, Geburtsdatum, Geschlecht, Accession)
  - Prescripteur
  - Tabellarische Ergebnisse mit Referenzbereichen, Flags, Kommentaren
  - Historik-Vergleich (letzter Wert, Datum)
  - Freitextblock für allgemeinen Kommentar
- Freigebetaste prominent
- Eskalations-Button für Panikwerte

---

## Phase 6 — Befunderstellung und Lieferung

### Beschreibung

Nach medizinischer Freigabe wird ein PDF-Befund erstellt und dem Patienten, Prescripteur oder Auftraggeber zur Verfügung gestellt.

### Schritte

1. PDF-Generierung wird nach Validation automatisch angestoßen
2. PDF wird serverseitig erzeugt
3. PDF wird in der Datenbank oder im File-Storage gespeichert
4. Ergebnis wird als DELIVERED markiert
5. Notification wird ausgelöst (E-Mail, SMS, Portal)
6. Archivspeicherung

### PDF-Inhalt (Befundlayout)

Das PDF soll folgende Sektionen enthalten:

**Header:**
- Labor-Logo
- Laborname, Adresse, Telefon, E-Mail
- Accreditierungsnummer optional
- Befundnummer / Rapport-ID
- Druckdatum

**Patientenblock:**
- Vollständiger Name
- Geburtsdatum und Alter
- Geschlecht
- Patienten-ID
- Adresse optional

**Auftragsblock:**
- Prescripteur Name und Kontakt
- Auftragsdatum
- Entnahmedatum
- Befunddatum
- Dringlichkeit

**Ergebnistabelle:**
Pro Analyse eine Zeile:
- Analysename
- Ergebniswert
- Einheit
- Referenzbereich (alters-/geschlechtsangepasst)
- Flag (H / L / Panik-Markierung)
- Kommentar zum Ergebnis optional

Abnormale oder kritische Werte optisch hervorheben (Fettdruck, Sternchen oder Farbe in Print-Safe).

**Kommentarblock:**
- Allgemeiner Befundkommentar des Arztes
- Hinweise, Empfehlungen

**Signaturblock:**
- Name des validierenden Arztes
- Berufsbezeichnung
- Unterschrift optional oder digitaler Stempel
- Datum der Validierung

**Footer:**
- Hinweis auf Labornorm
- Seitenangabe
- Barcode oder QR-Code für Dokumenten-Identifikation

### Technische Umsetzung des PDFs

Nutze eine der folgenden Bibliotheken (nach Projektstruktur):
- `PDFKit` (Node.js, rein programmatisch)
- `Puppeteer` (HTML → PDF, flexibles Layout)
- `react-pdf` / `@react-pdf/renderer` (React-basiert)

Empfehlung: **Puppeteer mit HTML-Template**, weil:
- HTML/CSS für Layout intuitiver ist
- Tabellen und Formatierungen einfacher zu pflegen
- Templates können im CMS oder per Variable gefüllt werden

Das Template soll in einer separaten HTML-Datei oder als Handlebars/EJS-Template vorliegen.

### Notification

Nach Befundfreigabe soll eine Benachrichtigung ausgelöst werden:

- **E-Mail** an Patient oder Auftraggeber (konfigurierbar)
- **SMS** optional (z. B. per Twilio oder lokaler Provider)
- **Portal-Benachrichtigung** wenn Patientenportal vorhanden

### Delivery Statuses

- `PDF_GENERATING`: PDF wird erstellt
- `PDF_READY`: PDF verfügbar
- `NOTIFIED`: Patient oder Auftraggeber benachrichtigt
- `DELIVERED`: Abgeschlossen
- `ARCHIVED`: Archiviert

### UI-Anforderungen

- Download-Button für PDF pro Befund
- Vorschau-Ansicht (inline PDF-Viewer oder neue Seite)
- Status-Anzeige: PDF bereit / verschickt
- Manuell nochmal senden Button
- Archiv-Ansicht pro Patient

---

## Globaler Workflow-Status

Jeder Auftrag hat zu jedem Zeitpunkt einen klar definierten Gesamtstatus.

### Statusmodell

| Status | Phase | Bedeutung |
|---|---|---|
| `DRAFT` | 1 | Aufnahme begonnen |
| `REGISTERED` | 1 | Auftrag vollständig registriert |
| `SAMPLE_EXPECTED` | 2 | Probe noch nicht angekommen |
| `SAMPLE_RECEIVED` | 2 | Probe eingegangen |
| `SAMPLE_PREPARED` | 2 | Probe aufbereitet |
| `NON_CONFORM` | 2 | Probenmangel festgestellt |
| `PENDING_ANALYSIS` | 3 | Wartet auf Maschine |
| `IN_ANALYSIS` | 3 | Maschine misst |
| `RESULTS_RECEIVED` | 3 | Rohresultate vorhanden |
| `PENDING_TECHNICAL_VALIDATION` | 4 | Wartet auf Technicien |
| `TECHNICALLY_VALIDATED` | 4 | Technisch freigegeben |
| `PENDING_MEDICAL_VALIDATION` | 5 | Wartet auf Arzt |
| `MEDICALLY_VALIDATED` | 5 | Ärztlich freigegeben |
| `PDF_GENERATING` | 6 | PDF wird erstellt |
| `PDF_READY` | 6 | PDF verfügbar |
| `DELIVERED` | 6 | Abgeschlossen |
| `ARCHIVED` | 6 | Archiviert |
| `CANCELLED` | — | Storniert |

---

## Rollen und Berechtigungen

### Rollen im Workflow

| Rolle | Phase | Berechtigungen |
|---|---|---|
| `RECEPTIONIST` | 1, 2 | Aufnahme, Probenempfang, Label-Druck |
| `TECHNICIEN` | 2, 3, 4 | Probe vorbereiten, Analyzer-Monitor, technische Validierung |
| `BIOLOGISTE` / `MEDECIN` | 5 | Medizinische Validierung, Freigabe |
| `ADMIN` | Alle | Alle Phasen, Konfiguration |

### Einschränkungen

- Kein Technicien darf medizinisch validieren
- Kein Rezeptionist darf Ergebnisse validieren
- Ein Arzt darf seinen eigenen Auftrag nicht validieren (optional konfigurierbar)
- Jede Statusänderung wird im Audit-Trail mit Benutzer und Zeitstempel gespeichert

---

## Dashboard-Visualisierung des Workflows

### Haupt-Dashboard

Das Dashboard soll eine **Übersicht aller Aufträge** mit aktuellem Status anzeigen.

Elemente:

- Kanban-ähnliche Spalten oder Filterbar-Tabelle nach Phase
- Farbkodierung nach Status
- Dringlichkeitskennzeichnung (STAT, URGENT)
- Countdown für TAT (Turnaround Time)
- Sofortanzeige blockierter Aufträge

### Workflow-Fortschrittsbalken

Pro Auftrag soll ein Fortschrittsbalken sichtbar sein:

```
[●]──[●]──[●]──[○]──[○]──[○]
 1    2    3    4    5    6
 OK   OK   OK   offen ...
```

- Abgeschlossene Phasen: gefüllter Kreis, grün
- Aktuelle Phase: pulsierender Kreis, orange
- Offene Phasen: leerer Kreis, grau
- Fehler: roter Kreis

### Echtzeit-Updates

Alle Statusänderungen sollen per WebSocket in Echtzeit ins Dashboard gepushed werden.

Damit sieht ein Technicien sofort, wenn ein Ergebnis von der Maschine eingetroffen ist, ohne die Seite neu zu laden.

---

## Datenbankschema-Erweiterungen

### Tabelle `orders` (Aufträge)

Ergänze oder erstelle mit mindestens:

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | UUID | Primary Key |
| `accession_number` | VARCHAR | Eindeutige Auftragsnummer |
| `patient_id` | UUID | FK zu patients |
| `prescriber_id` | UUID | FK zu prescribers |
| `priority` | ENUM | ROUTINE, URGENT, STAT |
| `status` | ENUM | Globaler Workflow-Status |
| `clinical_note` | TEXT | Klinische Angaben |
| `registered_at` | TIMESTAMP | Registrierungszeitpunkt |
| `registered_by` | UUID | FK zu users |
| `validated_technically_at` | TIMESTAMP | Zeitpunkt tech. Validierung |
| `validated_technically_by` | UUID | FK zu users |
| `validated_medically_at` | TIMESTAMP | Zeitpunkt med. Validierung |
| `validated_medically_by` | UUID | FK zu users |
| `general_comment` | TEXT | Allgemeiner Arztkommentar |
| `pdf_url` | TEXT | Pfad oder URL zum PDF |
| `pdf_generated_at` | TIMESTAMP | Zeitpunkt PDF-Erstellung |
| `delivered_at` | TIMESTAMP | Lieferzeitpunkt |
| `created_at` | TIMESTAMP | Erstellungszeitpunkt |
| `updated_at` | TIMESTAMP | Letzte Änderung |

### Tabelle `samples` (Proben)

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | UUID | Primary Key |
| `order_id` | UUID | FK zu orders |
| `barcode` | VARCHAR | Barcode / Label |
| `sample_type` | VARCHAR | Probenart |
| `tube_color` | VARCHAR | Röhrchenfarbe |
| `collected_at` | TIMESTAMP | Entnahmezeit |
| `received_at` | TIMESTAMP | Empfangszeit |
| `collected_by` | VARCHAR | Entnehmer optional |
| `received_by` | UUID | FK zu users |
| `volume_ml` | DECIMAL | Volumen |
| `condition` | VARCHAR | Qualitätszustand |
| `status` | ENUM | Probenstatus |
| `non_conform_reason` | TEXT | Grund bei Ablehnung |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

### Tabelle `order_results` (Finale validierte Ergebnisse)

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | UUID | Primary Key |
| `order_id` | UUID | FK zu orders |
| `sample_id` | UUID | FK zu samples |
| `test_code` | VARCHAR | Interner Testcode |
| `test_name` | VARCHAR | Anzeigename |
| `result_value` | VARCHAR | Wert |
| `unit` | VARCHAR | Einheit |
| `reference_min` | DECIMAL | Untere Grenze |
| `reference_max` | DECIMAL | Obere Grenze |
| `flag` | VARCHAR | NORMAL / HIGH / LOW / CRITICAL |
| `result_comment` | TEXT | Kommentar des Arztes |
| `is_abnormal` | BOOLEAN | Abnormal-Flag |
| `is_critical` | BOOLEAN | Panikwert-Flag |
| `technical_status` | ENUM | Technischer Validierungsstatus |
| `medical_status` | ENUM | Medizinischer Validierungsstatus |
| `validated_technically_by` | UUID | FK zu users |
| `validated_medically_by` | UUID | FK zu users |
| `raw_result_id` | UUID | FK zu instrument_raw_results |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

### Tabelle `order_audit_log`

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | UUID | Primary Key |
| `order_id` | UUID | FK zu orders |
| `action` | VARCHAR | Aktionstyp |
| `from_status` | VARCHAR | Vorheriger Status |
| `to_status` | VARCHAR | Neuer Status |
| `performed_by` | UUID | FK zu users |
| `comment` | TEXT | Optionaler Kommentar |
| `details_json` | JSONB | Weitere Details |
| `created_at` | TIMESTAMP | Zeitpunkt |

---

## API-Anforderungen

### Workflow-Endpunkte

```
POST   /orders                                     → Auftrag erstellen
GET    /orders                                     → Aufträge auflisten (Filter nach Status, Datum)
GET    /orders/:id                                 → Auftrag Detailansicht
PATCH  /orders/:id/status                          → Manueller Status-Override (Admin)

POST   /orders/:id/samples                         → Probe registrieren
PATCH  /orders/:id/samples/:sampleId/receive       → Probe empfangen
PATCH  /orders/:id/samples/:sampleId/non-conform   → Non-Conformité melden

POST   /orders/:id/push-to-instrument              → Worklist an Analyzer senden

GET    /orders/:id/results                         → Ergebnisse abrufen
PATCH  /orders/:id/results/:resultId/validate-technical   → Technisch validieren
PATCH  /orders/:id/results/:resultId/reject-technical     → Technisch ablehnen

PATCH  /orders/:id/validate-medical                → Medizinisch freigeben
PATCH  /orders/:id/reject-medical                  → An Technicien zurücksenden

GET    /orders/:id/pdf                             → PDF abrufen
POST   /orders/:id/generate-pdf                    → PDF neu generieren
POST   /orders/:id/notify                          → Benachrichtigung senden

GET    /orders/:id/audit                           → Audit-Log
```

---

## Backend-Services

Implementiere mindestens:

1. `OrderService`
   - Auftrag erstellen
   - Status-Transitionen verwalten
   - Validierungsregeln prüfen

2. `SampleService`
   - Probe registrieren
   - Non-Conformité verarbeiten
   - Barcode generieren

3. `ResultService`
   - Rohresultate mappen
   - Delta-Check berechnen
   - Panikwert-Prüfung
   - Technische Validierung
   - Medizinische Validierung

4. `PdfService`
   - PDF aus Template erzeugen
   - Template mit Patientendaten, Ergebnissen, Kommentaren befüllen
   - PDF speichern

5. `NotificationService`
   - E-Mail versenden
   - SMS optional
   - Push-Notification optional

6. `OrderAuditService`
   - Jede Statusänderung protokollieren

7. `WorkflowValidationService`
   - Prüft ob Statusübergang erlaubt ist
   - Prüft Rollenrechte

---

## Frontend-Seiten

Implementiere folgende Seiten und Komponenten:

### Seiten

| Route | Seite | Rolle |
|---|---|---|
| `/reception/new-order` | Neue Aufnahme Wizard | RECEPTIONIST |
| `/reception/pending` | Wartende Proben | RECEPTIONIST |
| `/samples/inbox` | Probeneingang | TECHNICIEN |
| `/analyzer/cobas-e411` | Analyzer Dashboard | TECHNICIEN |
| `/validation/technical` | Technische Validierung | TECHNICIEN |
| `/validation/medical` | Medizinische Validierung | BIOLOGISTE |
| `/orders` | Auftragsübersicht | ALLE |
| `/orders/:id` | Auftrags-Detail + Workflow | ALLE |
| `/reports/:id` | Befund PDF-Vorschau | ALLE |
| `/patients/:id/history` | Patientenhistorie | ALLE |

### Kernkomponenten

- `WorkflowProgressBar`: Fortschrittsbalken 6-Phasen
- `OrderStatusBadge`: Farbiges Status-Badge
- `ResultTable`: Ergebnistabelle mit Flags, Referenzbereichen, Kommentarfeld
- `DeltaCheckIndicator`: Vergleich mit letztem Wert
- `CriticalValueAlert`: Popup/Banner für Panikwerte
- `PdfViewer`: Inline-PDF-Vorschau
- `ValidationActionBar`: Aktions-Buttons je nach Rolle und Phase
- `SampleQualityBadge`: Ampel für Probenqualität
- `NonConformDialog`: Modal für Probenmängel
- `AuditTimeline`: Zeitstrahl aller Workflow-Ereignisse

---

## PDF-Template Anforderungen

Das PDF-Template soll:

- In HTML/CSS definiert sein (für Puppeteer)
- Labor-Logo einbinden (aus Konfiguration)
- Responsive Tabellen für viele Tests
- Abnormale Werte fett oder mit Markierung
- Kritische Werte mit Ausrufezeichen oder Sternchen
- Seitenumbrüche sauber bei vielen Tests
- Barcode oder QR-Code im Footer
- Deutsch und Französisch unterstützen (i18n-fähig)

---

## Qualitätskontrolle (Contrôle Qualité)

Die technische Validierung soll auch QC-Daten berücksichtigen.

### QC-Regeln

Das System soll folgende Westgard-Regeln kennen und automatisch prüfen:

| Regel | Bedeutung |
|---|---|
| `1_2s` | 1 Kontrollwert > 2 SD: Warnung |
| `1_3s` | 1 Kontrollwert > 3 SD: Fehler |
| `2_2s` | 2 aufeinanderfolgende > 2 SD: Fehler |
| `R_4s` | Range > 4 SD zwischen zwei Werten: Fehler |
| `4_1s` | 4 aufeinanderfolgende > 1 SD: Fehler |
| `10x` | 10 aufeinanderfolgende auf einer Seite: Fehler |

Wenn QC zum Messzeitpunkt fehlerhaft war, soll das Ergebnis in der technischen Validierung markiert sein.

### QC-Daten

Lege eine Tabelle `qc_results` an:

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | UUID | |
| `instrument_id` | UUID | FK zu instruments |
| `test_code` | VARCHAR | Test-Code |
| `control_level` | VARCHAR | L1 / L2 / L3 |
| `expected_value` | DECIMAL | Sollwert |
| `measured_value` | DECIMAL | Istwert |
| `sd` | DECIMAL | Standardabweichung |
| `cv_percent` | DECIMAL | Variationskoeffizient |
| `westgard_flags` | TEXT[] | Verletzerte Regeln |
| `is_accepted` | BOOLEAN | Akzeptiert ja/nein |
| `measured_at` | TIMESTAMP | Messzeitpunkt |
| `created_at` | TIMESTAMP | |

---

## Implementierungsreihenfolge

Arbeite in genau dieser Reihenfolge:

1. Datenbankschema analysieren und fehlende Tabellen / Felder ergänzen
2. Migrationen erstellen
3. Statusmodelle und Workflow-Transitions-Logik implementieren
4. `OrderService`, `SampleService`, `ResultService` implementieren
5. API-Endpunkte für alle Workflow-Phasen implementieren
6. Delta-Check, Panikwert-Prüfung, Westgard-QC-Regeln implementieren
7. `PdfService` mit Puppeteer und HTML-Template implementieren
8. `NotificationService` implementieren
9. `OrderAuditService` implementieren
10. Frontend: Aufnahme-Wizard (Phase 1)
11. Frontend: Probeneingang (Phase 2)
12. Frontend: Analyzer-Dashboard (Phase 3)
13. Frontend: Technische Validierung (Phase 4)
14. Frontend: Medizinische Validierung (Phase 5)
15. Frontend: PDF-Vorschau und Delivery (Phase 6)
16. Frontend: Workflow-Fortschrittsbalken auf Auftrags-Detailseite
17. WebSocket-Integration für Echtzeit-Updates
18. Tests für alle Workflow-Übergänge

---

## Konkreter Arbeitsauftrag

Bitte führe folgende Schritte aus:

1. Analysiere unser bestehendes Projekt vollständig:
   - Vorhandene Tabellen und Models
   - Vorhandene APIs
   - Vorhandene Services
   - Vorhandene Frontend-Seiten
   - Vorhandene Rollen und Auth

2. Identifiziere was fehlt und was erweitert werden muss.

3. Erstelle einen Umsetzungsplan mit minimalen Brüchen zur bestehenden Architektur.

4. Implementiere dann Phase für Phase:
   - DB-Schema-Erweiterungen und Migrationen
   - Backend-Services und APIs
   - Frontend-Seiten und Komponenten

5. Zeige am Ende:
   - Vollständige Liste neuer Dateien
   - Vollständige Liste geänderter Dateien
   - Wie ein Auftrag von Phase 1 bis Phase 6 durchläuft
   - Wie das PDF aussieht (Template)
   - Wie Benachrichtigung ausgelöst wird

---

## Harte Regeln

- Kein Ergebnis darf ohne technische Validierung medizinisch freigegeben werden
- Kein Ergebnis darf ohne medizinische Freigabe als PDF ausgegeben werden
- Kein Statussprung außerhalb der definierten Transitionen
- Jede Statusänderung muss im Audit-Log landen
- Rollenrechte müssen serverseitig geprüft werden, nicht nur im Frontend
- PDF-Rohpayload muss gespeichert bleiben
- Panikwerte müssen sofort sichtbar sein, bevor irgendjemand validiert
- Non-Conformités dürfen nie still ignoriert werden

---

## Erwartetes Endergebnis

Nach der Implementierung soll ein Laborant folgendes tun können:

1. Patient empfangen und Auftrag in 2 Minuten aufnehmen
2. Probe empfangen, scannen und Barcode-Label drucken
3. Probe in Cobas e 411 einlegen und im Dashboard den Fortschritt sehen
4. Rohresultate prüfen und technisch validieren
5. Dem Arzt den Befund zur Freigabe vorlegen
6. Nach Arztfreigabe automatisch PDF erhalten
7. PDF dem Patienten schicken oder ausdrucken

Der gesamte Durchlauf von Aufnahme bis PDF soll für eine Routine-Analyse unter 1 Stunde möglich sein, für STAT-Aufträge unter 30 Minuten.
