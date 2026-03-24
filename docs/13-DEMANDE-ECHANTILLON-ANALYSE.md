# Mapping Demande - Échantillon - Analyse

## Ziel
Dieses Dokument beschreibt die fachliche Beziehung zwischen **Demande**, **Échantillon** und **Analyse** im MLMS.

Es dient nicht nur als Fachbeschreibung, sondern auch als Referenz für:
- Datenmodellierung,
- Backend-Logik,
- Frontend-Flows,
- Formulare und Listen,
- Statuslogik,
- Ergebniszuordnung,
- Dokumentation in `docs/`.

Wenn an dieser Struktur etwas geändert wird, müssen immer auch die betroffenen Dokumente in `docs/` geprüft und bei Bedarf aktualisiert werden.

---

## MLMS-Kontext
Im MLMS gilt fachlich:

### Demande | الطلب
Une **demande** représente l'ordre d'analyses pour un patient.
يمثل **الطلب** أمر التحاليل الخاص بالمريض.

### Échantillon | العينة
Un **échantillon** représente la matière biologique réellement prélevée.
تمثل **العينة** المادة البيولوجية التي تم أخذها من المريض.

### Analyse | التحليل
Une **analyse** représente le test biologique demandé ou réalisé.
يمثل **التحليل** الفحص البيولوجي المطلوب أو المنجز.

Diese Begriffe müssen im gesamten Projekt konsistent verwendet werden.

---

## Allgemeine Regeln
Bevor an der Beziehung zwischen demande, échantillon und analyse etwas geändert wird, müssen diese Regeln eingehalten werden:

1. Zuerst die bestehenden Dateien in `docs/` lesen.
2. Prüfen, ob die aktuelle Beziehung bereits in anderen Dokumenten definiert oder eingeschränkt ist.
3. Neue Regeln nie nur im Code einführen, sondern immer auch dokumentieren.
4. Begriffe fachlich konsistent halten und nicht zwischen UI, Backend und Doku unterschiedlich verwenden.
5. Änderungen immer gegen bestehende Module wie résultats, rapports, workflow patient und types d'échantillons validieren.
6. Wenn neue Entitäten oder Zwischenebenen eingeführt werden, die betroffenen Dokumente in `docs/` ebenfalls aktualisieren.
7. Implizite Logik vermeiden; Beziehungen sollen explizit und nachvollziehbar dokumentiert werden.

---

## Beziehung der Konzepte

## 1. Grundbeziehung

### Französisch
- Un patient peut avoir plusieurs demandes.
- Une demande peut contenir plusieurs analyses.
- Une demande peut nécessiter un ou plusieurs échantillons.
- Un échantillon appartient à une seule demande.
- Plusieurs analyses peuvent parfois être réalisées à partir du même échantillon.

### Arabisch
- يمكن للمريض أن يملك عدة طلبات.
- يمكن للطلب أن يحتوي على عدة تحاليل.
- يمكن للطلب أن يحتاج إلى عينة واحدة أو عدة عينات.
- كل عينة ترتبط بطلب واحد.
- يمكن إجراء عدة تحاليل على نفس العينة في بعض الحالات.

### Zu beachten
Diese Grundlogik darf nicht durch UI- oder Implementierungsdetails verwässert werden.
Wenn das aktuelle Modell vereinfacht ist, muss diese Vereinfachung bewusst dokumentiert bleiben.

---

## 2. Rolle der Demande

### Französisch
La **demande** est le niveau métier principal.
Elle représente ce que le laboratoire doit réaliser pour un patient.

### Arabisch
يمثل **الطلب** المستوى المهني الأساسي.
وهو يحدد ما يجب على المختبر إنجازه للمريض.

### Zu beachten
Die demande ist nicht das gleiche wie der prélèvement.
Sie ist der Auftrag und bildet den fachlichen Container für die Analysen.

---

## 3. Rolle des Échantillon

### Französisch
L'**échantillon** représente la matière biologique effectivement prélevée pour exécuter tout ou partie de la demande.

### Arabisch
تمثل **العينة** المادة البيولوجية التي تم سحبها فعليًا لتنفيذ كل الطلب أو جزء منه.

### Zu beachten
Ein échantillon ist ein operatives Laborobjekt.
Er wird entnommen, identifiziert, empfangen, verarbeitet, analysiert und archiviert oder verworfen.

---

## 4. Rolle der Analyse

### Französisch
L'**analyse** correspond au test biologique demandé ou réalisé dans le cadre d'une demande.

### Arabisch
يمثل **التحليل** الفحص البيولوجي المطلوب أو المنجز في إطار الطلب.

### Zu beachten
Auch wenn das aktuelle Modell noch keine eigene Entität für analyse hat, muss fachlich klar bleiben, dass eine demande mehrere Analysen enthalten kann.
Wenn das System später erweitert wird, ist dies sauber zu dokumentieren.

---

## Beispiele im MLMS

## 1. Beispiel: demande simple

### Français
#### Demande
- NFS
- CRP
- Glycémie

#### Échantillons possibles
- 1 tube EDTA pour la NFS
- 1 tube sec ou sérum pour la CRP et la glycémie

### العربية
#### الطلب
- NFS
- CRP
- Glycémie

#### العينات الممكنة
- أنبوب EDTA واحد لتحليل NFS
- أنبوب جاف أو مصل لتحليل CRP و Glycémie

### Zu beachten
Hier sieht man, dass eine einzige demande mehrere analyses enthalten kann und dafür mehrere échantillons nötig sein können.

---

## 2. Beispiel: sérologies multiples

### Français
#### Demande
- Hépatite B
- Hépatite C
- HIV

#### Échantillon possible
- 1 seul tube sec ou sérum peut suffire pour plusieurs sérologies

### العربية
#### الطلب
- Hépatite B
- Hépatite C
- HIV

#### العينة الممكنة
- يمكن لأنبوب جاف واحد أو مصل واحد أن يكفي لعدة تحاليل مصلية

### Zu beachten
Mehrere Analysen können auf demselben échantillon basieren.
Diese Beziehung sollte im Modell und in der Doku nachvollziehbar bleiben.

---

## 3. Beispiel: demande mit unterschiedlichen Probentypen

### Français
#### Demande
- ECBU
- Chlamydia PCR

#### Échantillons possibles
- Urines pour l'ECBU
- Urines premier jet ou écouvillon selon le protocole pour la PCR

### العربية
#### الطلب
- ECBU
- Chlamydia PCR

#### العينات الممكنة
- بول لتحليل ECBU
- بول أولي أو مسحة حسب البروتوكول لتحليل PCR

### Zu beachten
Nicht jede demande führt nur zu einem einheitlichen Probentyp.
Das System muss solche Unterschiede fachlich sauber abbilden können.

---

## Modellierungsregeln im MLMS

## 1. Minimale Struktur (aktuelles MVP)

### Beispiel
- Patient
- Demande
- Echantillon
- Resultat
- Rapport

### Zu beachten
Diese Struktur ist für ein MVP möglich, solange die Logik klar dokumentiert bleibt.
Sie ist jedoch fachlich weniger präzise, wenn viele Analysen pro demande vorkommen.

---

## 2. Erweiterbare Struktur (Zielmodell)

### Beispiel
- Patient
- Demande
- AnalyseDemandee
- Echantillon
- Resultat
- Rapport

### Zu beachten
Diese Struktur ist mittelfristig sauberer, weil sie:
- mehrere Analysen pro demande explizit macht,
- die Zuordnung zu Ergebnissen verbessert,
- die Beziehung zwischen analyse und échantillon klarer macht,
- spätere Erweiterungen leichter wartbar macht.

Wenn diese Struktur eingeführt wird, müssen auch die zugehörigen `docs/`-Dateien aktualisiert werden.

---

## Workflow-Beziehung

## 1. Fachlicher Ablauf

### Français
1. Création du patient.
2. Création de la demande.
3. Ajout des analyses demandées.
4. Détermination des types de prélèvements nécessaires.
5. Création ou enregistrement des échantillons.
6. Réception et identification des échantillons.
7. Traitement pré-analytique.
8. Analyse.
9. Validation des résultats.
10. Édition du rapport.

### العربية
1. إنشاء المريض.
2. إنشاء الطلب.
3. إضافة التحاليل المطلوبة.
4. تحديد أنواع السحب المطلوبة.
5. إنشاء أو تسجيل العينات.
6. استقبال العينات والتأكد من هويتها.
7. المعالجة ما قبل التحليل.
8. إجراء التحليل.
9. اعتماد النتائج.
10. إصدار التقرير.

### Zu beachten
Wenn ein neuer Workflow-Schritt eingeführt wird, muss geprüft werden:
- ob die anderen Workflow-Dokumente angepasst werden müssen,
- ob neue Status nötig sind,
- ob UI und Backend diese Änderung bereits korrekt unterstützen.

---

## Statuslogik

## Beispielhafte Status für Échantillon
- Créé
- Prélevé
- Reçu
- Rejeté
- En analyse
- Validé
- Archivé

### Zu beachten
Status dürfen nicht isoliert in einem Modul geändert werden.
Wenn neue Status eingeführt oder bestehende geändert werden, müssen diese Änderungen auch in:
- `types_echantillons.md`,
- Workflow-Dokumenten,
- UI-Listen,
- Formularen,
- Backend-Validierungen,
- Ergebnis- und Report-Logik
nachgezogen werden.

---

## Was bei Änderungen immer zu prüfen ist
Vor jeder Änderung an demande, échantillon oder analyse muss geprüft werden:

- Ist die Beziehung bereits in anderen `docs/` beschrieben?
- Ist die Änderung nur technisch oder auch fachlich relevant?
- Müssen Frontend und Backend beide angepasst werden?
- Müssen Status, Formulare, Listen oder Filter angepasst werden?
- Muss die Ergebnislogik aktualisiert werden?
- Muss die Dokumentation zu workflow, échantillons oder analyses mit aktualisiert werden?

---

## Dokumentationsregel
Jede neue Entscheidung in diesem Bereich muss nach folgendem Prinzip behandelt werden:

1. Bestehende Dokumentation in `docs/` lesen.
2. Änderung gegen bestehende Fachlogik validieren.
3. Änderung im Code umsetzen.
4. Betroffene Dokumente in `docs/` aktualisieren.
5. Keine neue fachliche Regel ausschließlich im Code lassen.

---

## Zusammenfassung der Fachlogik

### Français
- La demande est l'ordre.
- L'échantillon est la matière biologique prélevée.
- L'analyse est le test demandé ou réalisé.
- Une demande peut contenir plusieurs analyses.
- Une demande peut nécessiter un ou plusieurs échantillons.
- Un échantillon appartient à une seule demande.

### العربية
- الطلب هو أمر التحاليل.
- العينة هي المادة البيولوجية المسحوبة.
- التحليل هو الفحص المطلوب أو المنجز.
- يمكن للطلب أن يحتوي على عدة تحاليل.
- يمكن للطلب أن يحتاج إلى عينة واحدة أو عدة عينات.
- كل عينة ترتبط بطلب واحد.
