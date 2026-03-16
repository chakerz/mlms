# 08-MEDICAL-TERMS.md

# Medical Terms – FR / AR Glossary for MLMS

## Ziel

Dieses Dokument definiert die medizinischen Kernbegriffe für das MLMS in:

- Französisch (`fr`)
- Arabisch (`ar`)

Es dient als zentrale Referenz für:

- UI-Texte
- Testnamen
- Einheiten
- Flags
- Specimen-Typen
- Reagenzien-Kategorien
- Report-Darstellung
- Patientenportal
- API/Frontend Mapping

WICHTIG:
- Codes bleiben technisch stabil, z. B. `GLU`, `HGB`, `WBC`
- sichtbare Namen werden übersetzt
- Referenzwerte können je Labor unterschiedlich sein
- dieses Dokument liefert Terminologie, nicht die endgültigen medizinischen Grenzwerte je Labor

---

## Grundprinzipien

### 1. Code bleibt stabil
Beispiel:
- `GLU`
- `HGB`
- `CRE`

Der Code wird nicht übersetzt.

### 2. Sichtbare Begriffe werden übersetzt
Beispiel:
- `GLU` → `Glycémie` / `سكر الدم`

### 3. Fachbegriffe müssen konsistent sein
Ein Begriff darf im System nicht einmal so und einmal anders erscheinen.

### 4. UI und API haben unterschiedliche Rollen
- API liefert Codes und neutrale Werte
- Frontend übersetzt die Anzeige

### 5. Patientenportal darf einfacher formulieren
Fachbegriffe bleiben erhalten, können aber durch kurze verständliche Beschreibungen ergänzt werden.

---

## Verzeichnisbezug

Dieses Dokument ist die Grundlage für:

```text
frontend/src/i18n/locales/fr/medical.json
frontend/src/i18n/locales/ar/medical.json
```

Optional später zusätzlich:

```text
backend/src/domain/catalog/TestDefinition.ts
contracts/src/catalog/test-definition.dto.ts
```

---

## Standardstruktur für medizinische Begriffe

Empfohlene JSON-Struktur:

```json
{
  "tests": {},
  "units": {},
  "flags": {},
  "specimens": {},
  "departments": {},
  "reagents": {},
  "interpretation": {}
}
```

---

## 1. Hämatologie – Grundbegriffe

## Testcodes und Begriffe

| Code | FR | AR | Kurzbeschreibung |
|------|----|----|------------------|
| HGB | Hémoglobine | الهيموغلوبين | Sauerstofftragender Bestandteil der Erythrozyten |
| WBC | Globules blancs | خلايا الدم البيضاء | Leukozytenzahl |
| RBC | Globules rouges | خلايا الدم الحمراء | Erythrozytenzahl |
| HCT | Hématocrite | الهيماتوكريت | Volumenanteil roter Blutkörperchen |
| PLT | Plaquettes | الصفائح الدموية | Blutplättchen |
| MCV | Volume globulaire moyen | متوسط حجم الكرية | Mittleres Erythrozytenvolumen |
| MCH | Teneur corpusculaire moyenne en hémoglobine | متوسط هيموغلوبين الكرية | Mittlere Hämoglobinmasse |
| MCHC | Concentration corpusculaire moyenne en hémoglobine | متوسط تركيز هيموغلوبين الكرية | Mittlere Hämoglobinkonzentration |
| RDW | Indice de distribution des globules rouges | تباين حجم الكريات الحمراء | Variabilität der Erythrozytengröße |

---

## 2. Biochemie – Grundbegriffe

| Code | FR | AR | Kurzbeschreibung |
|------|----|----|------------------|
| GLU | Glycémie | سكر الدم | Glukose im Blut |
| CRE | Créatinine | الكرياتينين | Marker für Nierenfunktion |
| UREA | Urée | اليوريا | Harnstoff |
| CHOL | Cholestérol total | الكوليسترول الكلي | Gesamtcholesterin |
| TG | Triglycérides | الدهون الثلاثية | Triglyceride |
| HDL | HDL cholestérol | الكوليسترول الحميد | High Density Lipoprotein |
| LDL | LDL cholestérol | الكوليسترول الضار | Low Density Lipoprotein |
| AST | ASAT (Aspartate aminotransférase) | ناقلة أمين الأسبارتات | Leberenzym |
| ALT | ALAT (Alanine aminotransférase) | ناقلة أمين الألانين | Leberenzym |
| ALP | Phosphatase alcaline | الفوسفاتاز القلوية | Enzym für Leber/Knochen |
| GGT | Gamma GT | غاما جي تي | Leber-/Gallenmarker |
| CRP | Protéine C-réactive | البروتين المتفاعل C | Entzündungsmarker |
| ALB | Albumine | الألبومين | Serumprotein |
| BIL | Bilirubine | البيليروبين | Abbauprodukt des Hämoglobins |
| CA | Calcium | الكالسيوم | Mineralstoff |
| NA | Sodium | الصوديوم | Elektrolyt |
| K | Potassium | البوتاسيوم | Elektrolyt |
| CL | Chlorure | الكلوريد | Elektrolyt |

---

## 3. Diabetes / Endokrinologie

| Code | FR | AR | Kurzbeschreibung |
|------|----|----|------------------|
| HBA1C | Hémoglobine glyquée | الهيموغلوبين السكري | Durchschnittlicher Blutzucker |
| TSH | TSH | الهرمون المنبه للدرقية | Schilddrüsensteuerung |
| FT4 | T4 libre | T4 الحر | Freies Thyroxin |
| FT3 | T3 libre | T3 الحر | Freies Trijodthyronin |
| INS | Insuline | الأنسولين | Hormon des Glukosestoffwechsels |

---

## 4. Nierenfunktion

| Code | FR | AR | Kurzbeschreibung |
|------|----|----|------------------|
| CRE | Créatinine | الكرياتينين | Serumkreatinin |
| EGFR | Débit de filtration glomérulaire estimé | معدل الترشيح الكبيبي المقدر | Geschätzte Nierenfunktion |
| UREA | Urée | اليوريا | Stickstoffwechsel |
| PCR | Rapport protéine/créatinine | نسبة البروتين إلى الكرياتينين | Proteinurie-Bewertung |
| ACR | Rapport albumine/créatinine | نسبة الألبومين إلى الكرياتينين | Albuminurie-Bewertung |

---

## 5. Leberfunktion

| Code | FR | AR | Kurzbeschreibung |
|------|----|----|------------------|
| AST | ASAT | ناقلة أمين الأسبارتات | Leberenzym |
| ALT | ALAT | ناقلة أمين الألانين | Leberenzym |
| ALP | Phosphatase alcaline | الفوسفاتاز القلوية | Cholestase-/Knochenmarker |
| GGT | Gamma GT | غاما جي تي | Gallen-/Lebermarker |
| BIL | Bilirubine | البيليروبين | Bilirubin |
| ALB | Albumine | الألبومين | Leber-Syntheseleistung |

---

## 6. Gerinnung

| Code | FR | AR | Kurzbeschreibung |
|------|----|----|------------------|
| PT | Temps de prothrombine | زمن البروثرومبين | Gerinnungszeit |
| INR | INR | النسبة المعيارية الدولية | Standardisierte Gerinnung |
| APTT | TCA / Temps de céphaline activée | زمن الثرومبوبلاستين الجزئي المنشط | Intrinsischer Gerinnungsweg |
| FIB | Fibrinogène | الفيبرينوجين | Gerinnungsprotein |

---

## 7. Urinanalytik

| Code | FR | AR | Kurzbeschreibung |
|------|----|----|------------------|
| U-GLU | Glucose urinaire | سكر البول | Glukose im Urin |
| U-PROT | Protéines urinaires | بروتينات البول | Protein im Urin |
| U-BLD | Sang urinaire | دم في البول | Blut im Urin |
| U-KET | Corps cétoniques urinaires | كيتونات البول | Ketone im Urin |
| U-NIT | Nitrites urinaires | نيتريت البول | Hinweis auf bakterielle Aktivität |
| U-LEU | Leucocytes urinaires | كريات الدم البيضاء في البول | Hinweis auf Entzündung |

---

## 8. Mikrobiologie – Basisbegriffe

| Code | FR | AR | Kurzbeschreibung |
|------|----|----|------------------|
| CULT | Culture | زرع | Mikrobiologische Kultur |
| ABG | Antibiogramme | اختبار الحساسية للمضادات الحيوية | Resistenztest |
| GRAM | Coloration de Gram | صبغة غرام | Bakterielle Erstklassifikation |
| PCR | PCR | تفاعل البوليميراز المتسلسل | Molekulardiagnostik |
| POS | Positif | إيجابي | Positives Resultat |
| NEG | Négatif | سلبي | Negatives Resultat |

---

## 9. Serologie / Immunologie – Basisbegriffe

| Code | FR | AR | Kurzbeschreibung |
|------|----|----|------------------|
| HIV | VIH | فيروس نقص المناعة البشرية | HIV Test |
| HBSAG | Ag HBs | المستضد السطحي لالتهاب الكبد B | Hepatitis-B Marker |
| ANTI-HCV | Ac anti-VHC | الأجسام المضادة لفيروس التهاب الكبد C | HCV Marker |
| IGG | IgG | الغلوبولين المناعي G | Antikörpertyp |
| IGM | IgM | الغلوبولين المناعي M | Antikörpertyp |
| RF | Facteur rhumatoïde | العامل الروماتويدي | Autoimmunmarker |

---

## 10. Probenarten / Specimen Types

| Code | FR | AR |
|------|----|----|
| BLOOD | Sang | دم |
| SERUM | Sérum | مصل |
| PLASMA | Plasma | بلازما |
| URINE | Urine | بول |
| STOOL | Selles | براز |
| TISSUE | Tissu | نسيج |
| SWAB | Écouvillon | مسحة |
| CSF | Liquide céphalo-rachidien | السائل الدماغي الشوكي |

---

## 11. Status- und Ergebnisbegriffe

## Ergebnis-Flags

| Code | FR | AR | Bedeutung |
|------|----|----|-----------|
| N | Normal | طبيعي | Im Referenzbereich |
| H | Élevé | مرتفع | Über Referenzbereich |
| L | Bas | منخفض | Unter Referenzbereich |
| HH | Très élevé | مرتفع جداً | Stark erhöht |
| LL | Très bas | منخفض جداً | Stark erniedrigt |
| CRITICAL | Critique | حرج | Kritischer Wert |

---

## Report-Status Begriffe

| Code | FR | AR |
|------|----|----|
| DRAFT | Brouillon | مسودة |
| VALIDATED | Validé | معتمد |
| FINAL | Final | نهائي |
| CORRECTED | Corrigé | مصحح |
| PUBLISHED | Publié | منشور |

---

## Order-Status Begriffe

| Code | FR | AR |
|------|----|----|
| PENDING | En attente | قيد الانتظار |
| COLLECTED | Prélevé | تم أخذ العينة |
| ANALYZED | Analysé | تم التحليل |
| VALIDATED | Validé | تم الاعتماد |
| PUBLISHED | Publié | تم النشر |
| CANCELLED | Annulé | ملغى |

---

## 12. Einheiten

## Allgemeine Einheiten

| Key | FR | AR |
|-----|----|----|
| g_dL | g/dL | غ/دل |
| g_L | g/L | غ/ل |
| mg_dL | mg/dL | ملغ/دل |
| mmol_L | mmol/L | مليمول/لتر |
| umol_L | µmol/L | ميكرومول/لتر |
| U_L | U/L | وحدة/لتر |
| x10_3_uL | x10³/µL | ألف/ميكرولتر |
| x10_6_uL | x10⁶/µL | مليون/ميكرولتر |
| percent | % | % |
| pg | pg | بيكوغرام |
| fL | fL | فيمتولتر |
| ng_mL | ng/mL | نانوغرام/مل |
| mEq_L | mEq/L | ميلي مكافئ/لتر |

---

## 13. Reagenzien-Kategorien

| Code | FR | AR |
|------|----|----|
| CHEMISTRY | Biochimie | الكيمياء الحيوية |
| HEMATOLOGY | Hématologie | أمراض الدم |
| IMMUNOLOGY | Immunologie | علم المناعة |
| MICROBIOLOGY | Microbiologie | علم الأحياء الدقيقة |

---

## 14. Patientenfreundliche Begriffe

Diese Begriffe können im Patientenportal ergänzend angezeigt werden.

| Fachcode | FR – einfach | AR – einfach |
|----------|--------------|--------------|
| GLU | Sucre dans le sang | سكر الدم |
| CRE | Fonction des reins (créatinine) | وظيفة الكلى (الكرياتينين) |
| HGB | Taux d'hémoglobine | نسبة الهيموغلوبين |
| WBC | Globules blancs | كريات الدم البيضاء |
| CRP | Marqueur d'inflammation | مؤشر الالتهاب |

WICHTIG:
- Im ärztlichen UI darf die Fachsprache dominieren.
- Im Patientenportal kann zusätzlich eine einfache Beschreibung angezeigt werden.

---

## 15. Medizinische Kommentare – Standardformulierungen

Diese Texte dienen nur als Terminologie-Vorlage.
Sie sollen später in Report-Kommentaren oder KI-Kommentarvorschlägen genutzt werden.

## Französisch – kurze Standardtexte

```text
Résultat dans les limites de référence.
Résultat légèrement supérieur à la valeur de référence.
Résultat inférieur à la valeur de référence.
Valeur critique nécessitant une attention immédiate.
Interprétation à corréler avec le contexte clinique.
```

## Arabisch – kurze Standardtexte

```text
النتيجة ضمن الحدود المرجعية.
النتيجة أعلى قليلاً من القيمة المرجعية.
النتيجة أقل من القيمة المرجعية.
قيمة حرجة تستدعي انتباهاً فورياً.
يجب تفسير النتيجة حسب السياق السريري.
```

---

## 16. JSON-Struktur für `medical.json`

## Datei: `frontend/src/i18n/locales/fr/medical.json`

```json
{
  "tests": {
    "HGB": "Hémoglobine",
    "WBC": "Globules blancs",
    "RBC": "Globules rouges",
    "HCT": "Hématocrite",
    "PLT": "Plaquettes",
    "MCV": "Volume globulaire moyen",
    "MCH": "Teneur corpusculaire moyenne en hémoglobine",
    "MCHC": "Concentration corpusculaire moyenne en hémoglobine",
    "RDW": "Indice de distribution des globules rouges",
    "GLU": "Glycémie",
    "CRE": "Créatinine",
    "UREA": "Urée",
    "CHOL": "Cholestérol total",
    "TG": "Triglycérides",
    "HDL": "HDL cholestérol",
    "LDL": "LDL cholestérol",
    "AST": "ASAT",
    "ALT": "ALAT",
    "ALP": "Phosphatase alcaline",
    "GGT": "Gamma GT",
    "CRP": "Protéine C-réactive",
    "ALB": "Albumine",
    "BIL": "Bilirubine",
    "CA": "Calcium",
    "NA": "Sodium",
    "K": "Potassium",
    "CL": "Chlorure",
    "HBA1C": "Hémoglobine glyquée",
    "TSH": "TSH",
    "FT4": "T4 libre",
    "FT3": "T3 libre",
    "PT": "Temps de prothrombine",
    "INR": "INR",
    "APTT": "Temps de céphaline activée",
    "FIB": "Fibrinogène"
  },
  "units": {
    "g_dL": "g/dL",
    "g_L": "g/L",
    "mg_dL": "mg/dL",
    "mmol_L": "mmol/L",
    "umol_L": "µmol/L",
    "U_L": "U/L",
    "x10_3_uL": "x10³/µL",
    "x10_6_uL": "x10⁶/µL",
    "percent": "%",
    "pg": "pg",
    "fL": "fL",
    "ng_mL": "ng/mL",
    "mEq_L": "mEq/L"
  },
  "flags": {
    "N": "Normal",
    "H": "Élevé",
    "L": "Bas",
    "HH": "Très élevé",
    "LL": "Très bas",
    "CRITICAL": "Critique"
  },
  "specimens": {
    "BLOOD": "Sang",
    "SERUM": "Sérum",
    "PLASMA": "Plasma",
    "URINE": "Urine",
    "STOOL": "Selles",
    "TISSUE": "Tissu",
    "SWAB": "Écouvillon",
    "CSF": "Liquide céphalo-rachidien"
  },
  "departments": {
    "CHEMISTRY": "Biochimie",
    "HEMATOLOGY": "Hématologie",
    "IMMUNOLOGY": "Immunologie",
    "MICROBIOLOGY": "Microbiologie"
  },
  "patientFriendly": {
    "GLU": "Sucre dans le sang",
    "CRE": "Fonction des reins (créatinine)",
    "HGB": "Taux d'hémoglobine",
    "WBC": "Globules blancs",
    "CRP": "Marqueur d'inflammation"
  },
  "interpretation": {
    "normal": "Résultat dans les limites de référence.",
    "high": "Résultat légèrement supérieur à la valeur de référence.",
    "low": "Résultat inférieur à la valeur de référence.",
    "critical": "Valeur critique nécessitant une attention immédiate.",
    "clinicalContext": "Interprétation à corréler avec le contexte clinique."
  }
}
```

---

## Datei: `frontend/src/i18n/locales/ar/medical.json`

```json
{
  "tests": {
    "HGB": "الهيموغلوبين",
    "WBC": "خلايا الدم البيضاء",
    "RBC": "خلايا الدم الحمراء",
    "HCT": "الهيماتوكريت",
    "PLT": "الصفائح الدموية",
    "MCV": "متوسط حجم الكرية",
    "MCH": "متوسط هيموغلوبين الكرية",
    "MCHC": "متوسط تركيز هيموغلوبين الكرية",
    "RDW": "تباين حجم الكريات الحمراء",
    "GLU": "سكر الدم",
    "CRE": "الكرياتينين",
    "UREA": "اليوريا",
    "CHOL": "الكوليسترول الكلي",
    "TG": "الدهون الثلاثية",
    "HDL": "الكوليسترول الحميد",
    "LDL": "الكوليسترول الضار",
    "AST": "ناقلة أمين الأسبارتات",
    "ALT": "ناقلة أمين الألانين",
    "ALP": "الفوسفاتاز القلوية",
    "GGT": "غاما جي تي",
    "CRP": "البروتين المتفاعل C",
    "ALB": "الألبومين",
    "BIL": "البيليروبين",
    "CA": "الكالسيوم",
    "NA": "الصوديوم",
    "K": "البوتاسيوم",
    "CL": "الكلوريد",
    "HBA1C": "الهيموغلوبين السكري",
    "TSH": "الهرمون المنبه للدرقية",
    "FT4": "T4 الحر",
    "FT3": "T3 الحر",
    "PT": "زمن البروثرومبين",
    "INR": "النسبة المعيارية الدولية",
    "APTT": "زمن الثرومبوبلاستين الجزئي المنشط",
    "FIB": "الفيبرينوجين"
  },
  "units": {
    "g_dL": "غ/دل",
    "g_L": "غ/ل",
    "mg_dL": "ملغ/دل",
    "mmol_L": "مليمول/لتر",
    "umol_L": "ميكرومول/لتر",
    "U_L": "وحدة/لتر",
    "x10_3_uL": "ألف/ميكرولتر",
    "x10_6_uL": "مليون/ميكرولتر",
    "percent": "%",
    "pg": "بيكوغرام",
    "fL": "فيمتولتر",
    "ng_mL": "نانوغرام/مل",
    "mEq_L": "ميلي مكافئ/لتر"
  },
  "flags": {
    "N": "طبيعي",
    "H": "مرتفع",
    "L": "منخفض",
    "HH": "مرتفع جداً",
    "LL": "منخفض جداً",
    "CRITICAL": "حرج"
  },
  "specimens": {
    "BLOOD": "دم",
    "SERUM": "مصل",
    "PLASMA": "بلازما",
    "URINE": "بول",
    "STOOL": "براز",
    "TISSUE": "نسيج",
    "SWAB": "مسحة",
    "CSF": "السائل الدماغي الشوكي"
  },
  "departments": {
    "CHEMISTRY": "الكيمياء الحيوية",
    "HEMATOLOGY": "أمراض الدم",
    "IMMUNOLOGY": "علم المناعة",
    "MICROBIOLOGY": "علم الأحياء الدقيقة"
  },
  "patientFriendly": {
    "GLU": "سكر الدم",
    "CRE": "وظيفة الكلى (الكرياتينين)",
    "HGB": "نسبة الهيموغلوبين",
    "WBC": "كريات الدم البيضاء",
    "CRP": "مؤشر الالتهاب"
  },
  "interpretation": {
    "normal": "النتيجة ضمن الحدود المرجعية.",
    "high": "النتيجة أعلى قليلاً من القيمة المرجعية.",
    "low": "النتيجة أقل من القيمة المرجعية.",
    "critical": "قيمة حرجة تستدعي انتباهاً فورياً.",
    "clinicalContext": "يجب تفسير النتيجة حسب السياق السريري."
  }
}
```

---

## 17. Regeln für Testanzeige im Frontend

### Ärztliches / internes UI
Anzeige bevorzugt:
- Fachname in aktueller Sprache
- Code optional daneben

Beispiel:
```text
Glycémie (GLU)
سكر الدم (GLU)
```

### Patientenportal
Anzeige bevorzugt:
- einfacher Name
- optional Fachname als Untertitel

Beispiel:
```text
Sucre dans le sang
سكر الدم
```

---

## 18. Regeln für Referenzbereiche

WICHTIG:
- Referenzbereiche sind laborabhängig
- sie dürfen nicht nur aus diesem Dokument abgeleitet werden
- sie müssen im Testkatalog des Labors konfigurierbar sein

Deshalb:
- dieses Dokument definiert Begriffe
- Referenzwerte kommen aus `TestDefinition` oder Labor-Konfiguration

---

## 19. Regeln für neue Tests

Wenn ein neuer Test hinzukommt, müssen immer diese Stellen erweitert werden:

1. `medical.json` in `fr`
2. `medical.json` in `ar`
3. Testkatalog im Backend
4. ggf. Referenzbereiche
5. ggf. Patientenfreundlicher Begriff
6. ggf. Report-Templates

---

## 20. Verbotene Muster

### Nicht erlaubt
- unterschiedliche Übersetzungen für denselben Testcode
- freie Schreibweisen ohne zentralen Key
- Vermischung von FR und AR im selben Textstring
- fachlich falsche Kürzel

### Erlaubt
- stabiler Testcode
- FR/AR Anzeige je Sprache
- vereinfachte Patientenbeschreibung zusätzlich

---

## 21. Mindestumfang für MVP

Diese Begriffe müssen mindestens vorhanden sein:

### Tests
- HGB
- WBC
- RBC
- PLT
- GLU
- CRE
- UREA
- CHOL
- TG
- CRP
- HBA1C

### Specimens
- BLOOD
- SERUM
- PLASMA
- URINE
- STOOL

### Flags
- N
- H
- L
- HH
- LL
- CRITICAL

### Units
- g_dL
- mg_dL
- mmol_L
- umol_L
- U_L
- x10_3_uL

---

## 22. Definition of Done

Dieses Dokument ist korrekt umgesetzt, wenn:

- `medical.json` in FR und AR existiert
- beide Dateien dieselbe Key-Struktur haben
- Kernbegriffe für Hämatologie und Biochemie vorhanden sind
- Specimen-Typen vorhanden sind
- Flags vorhanden sind
- Units vorhanden sind
- Patientenfreundliche Begriffe vorhanden sind
- UI dieselben Codes stabil verwenden kann

---

## Claude Code Prompt für dieses Medical-Terms-File

```text
LIES DIESES KOMPLETTE DOKUMENT 08-MEDICAL-TERMS.md.

Erstelle die medizinischen Übersetzungsdateien exakt nach diesem Dokument.

WICHTIGE REGELN:
1. Erzeuge `frontend/src/i18n/locales/fr/medical.json`.
2. Erzeuge `frontend/src/i18n/locales/ar/medical.json`.
3. Nutze exakt dieselben Keys in beiden Dateien.
4. Verwende stabile Testcodes.
5. Trenne Fachbegriffe und patientenfreundliche Begriffe.
6. Übersetze nur die sichtbaren Namen, nicht die Codes.
7. Bereite die Dateien so vor, dass Frontend-Komponenten direkt `t('medical:tests.GLU')` nutzen können.
8. Halte die Struktur für spätere Erweiterung offen.

Liefere:
- `frontend/src/i18n/locales/fr/medical.json`
- `frontend/src/i18n/locales/ar/medical.json`
- konsistente Key-Struktur
```

---
