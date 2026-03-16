# 03-FRONTEND-STRUCTURE.md

# Frontend Structure – MLMS

## Ziel

Dieses Dokument definiert die **exakte Frontend-Struktur** für das MLMS.

Das Frontend wird mit folgenden Prinzipien aufgebaut:

- React 18 + Vite
- TypeScript
- Feature-based Architecture
- Wiederverwendbare UI-Komponenten
- RTK Query für API-Kommunikation
- react-i18next für FR/AR
- RTL-Unterstützung für Arabisch
- Rollenbasierte Navigation
- Klare Trennung zwischen App, Features, Shared und i18n

---

## Technologie-Stack

- Framework: React 18
- Build Tool: Vite
- Sprache: TypeScript
- Styling: TailwindCSS
- Routing: React Router
- Data Fetching: RTK Query
- State: Redux Toolkit + lokale Component States
- Formulare: React Hook Form
- Validation: Zod
- i18n: react-i18next
- Icons: lucide-react oder heroicons
- Tabellen: Eigene DataTable-Komponente
- PDF Anzeige: Browser PDF/HTML Viewer
- Tests: Vitest + Testing Library

---

## Hauptprinzipien

### 1. Feature zuerst
Jede fachliche Funktion lebt in `features/`.

### 2. App-Level Dinge in `app/`
Provider, Layouts und Routing gehören nicht in Features.

### 3. Wiederverwendbares in `shared/`
Buttons, Inputs, Modals, Tabellen und Utilities liegen in `shared/`.

### 4. Übersetzungen getrennt in `i18n/`
Sprachdateien werden sauber nach Sprache und Bereich getrennt.

### 5. Portal getrennt vom Labor-UI
Patientenportal hat eigenes Layout und eigene Routen.

---

## Exakte Projektstruktur

```text
frontend/
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── robots.txt
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   │
│   ├── app/
│   │   ├── providers/
│   │   │   ├── AppProviders.tsx
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── QueryProvider.tsx
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── I18nProvider.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── MainLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Content.tsx
│   │   │   ├── PageContainer.tsx
│   │   │   └── PatientPortalLayout.tsx
│   │   │
│   │   ├── routes/
│   │   │   ├── AppRoutes.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── RoleProtectedRoute.tsx
│   │   │   ├── PortalRoutes.tsx
│   │   │   └── route-config.ts
│   │   │
│   │   └── store/
│   │       ├── store.ts
│   │       ├── rootReducer.ts
│   │       └── listeners.ts
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── ForgotPasswordPage.tsx
│   │   │   │   └── UnauthorizedPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── PasswordInput.tsx
│   │   │   │   └── LanguageSwitcher.tsx
│   │   │   ├── api/
│   │   │   │   └── authApi.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useCurrentUser.ts
│   │   │   ├── model/
│   │   │   │   ├── authSlice.ts
│   │   │   │   └── authSelectors.ts
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── pages/
│   │   │   │   └── DashboardPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── DashboardStats.tsx
│   │   │   │   ├── QuickActions.tsx
│   │   │   │   └── RecentOrdersCard.tsx
│   │   │   └── api/
│   │   │       └── dashboardApi.ts
│   │   │
│   │   ├── patient/
│   │   │   ├── pages/
│   │   │   │   ├── PatientListPage.tsx
│   │   │   │   ├── PatientCreatePage.tsx
│   │   │   │   ├── PatientEditPage.tsx
│   │   │   │   └── PatientDetailPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── PatientTable.tsx
│   │   │   │   ├── PatientForm.tsx
│   │   │   │   ├── PatientSearchBar.tsx
│   │   │   │   ├── PatientSummaryCard.tsx
│   │   │   │   └── PatientInfoSection.tsx
│   │   │   ├── api/
│   │   │   │   └── patientApi.ts
│   │   │   ├── hooks/
│   │   │   │   ├── usePatients.ts
│   │   │   │   └── usePatientFilters.ts
│   │   │   ├── model/
│   │   │   │   └── patientSelectors.ts
│   │   │   └── types/
│   │   │       └── patient.types.ts
│   │   │
│   │   ├── order/
│   │   │   ├── pages/
│   │   │   │   ├── OrderListPage.tsx
│   │   │   │   ├── OrderCreatePage.tsx
│   │   │   │   └── OrderDetailPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── OrderForm.tsx
│   │   │   │   ├── OrderTable.tsx
│   │   │   │   ├── OrderStatusBadge.tsx
│   │   │   │   ├── PriorityBadge.tsx
│   │   │   │   ├── TestSelectionTable.tsx
│   │   │   │   └── SelectedPatientBanner.tsx
│   │   │   ├── api/
│   │   │   │   └── orderApi.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useOrders.ts
│   │   │   │   └── useOrderFilters.ts
│   │   │   └── types/
│   │   │       └── order.types.ts
│   │   │
│   │   ├── specimen/
│   │   │   ├── pages/
│   │   │   │   ├── SpecimenListPage.tsx
│   │   │   │   ├── SpecimenCreatePage.tsx
│   │   │   │   └── SpecimenDetailPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── SpecimenForm.tsx
│   │   │   │   ├── SpecimenTable.tsx
│   │   │   │   ├── SpecimenStatusBadge.tsx
│   │   │   │   ├── BarcodePreview.tsx
│   │   │   │   └── BarcodePrintButton.tsx
│   │   │   ├── api/
│   │   │   │   └── specimenApi.ts
│   │   │   └── hooks/
│   │   │       └── useSpecimens.ts
│   │   │
│   │   ├── result/
│   │   │   ├── pages/
│   │   │   │   ├── ResultEntryPage.tsx
│   │   │   │   ├── ResultReviewPage.tsx
│   │   │   │   └── ResultHistoryPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── ResultForm.tsx
│   │   │   │   ├── ResultTable.tsx
│   │   │   │   ├── ResultFlagBadge.tsx
│   │   │   │   ├── ReferenceRange.tsx
│   │   │   │   └── CriticalAlert.tsx
│   │   │   ├── api/
│   │   │   │   └── resultApi.ts
│   │   │   ├── hooks/
│   │   │   │   └── useResults.ts
│   │   │   └── types/
│   │   │       └── result.types.ts
│   │   │
│   │   ├── report/
│   │   │   ├── pages/
│   │   │   │   ├── ReportValidationQueue.tsx
│   │   │   │   ├── ReportDetailPage.tsx
│   │   │   │   ├── ReportPreviewPage.tsx
│   │   │   │   └── ReportHistoryPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── ReportHeader.tsx
│   │   │   │   ├── ReportPatientInfo.tsx
│   │   │   │   ├── ReportResultTable.tsx
│   │   │   │   ├── ReportCommentEditor.tsx
│   │   │   │   ├── ValidationActions.tsx
│   │   │   │   ├── SignaturePanel.tsx
│   │   │   │   ├── PublishButton.tsx
│   │   │   │   └── AiSuggestionPanel.tsx
│   │   │   ├── api/
│   │   │   │   └── reportApi.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useReports.ts
│   │   │   │   └── useReportActions.ts
│   │   │   └── types/
│   │   │       └── report.types.ts
│   │   │
│   │   ├── reagent/
│   │   │   ├── pages/
│   │   │   │   ├── ReagentListPage.tsx
│   │   │   │   ├── ReagentCreatePage.tsx
│   │   │   │   ├── ReagentLotPage.tsx
│   │   │   │   └── InventoryDashboardPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── ReagentTable.tsx
│   │   │   │   ├── ReagentForm.tsx
│   │   │   │   ├── ReagentLotTable.tsx
│   │   │   │   ├── LotForm.tsx
│   │   │   │   ├── StockAlertBanner.tsx
│   │   │   │   ├── ExpiryAlertBanner.tsx
│   │   │   │   └── ConsumptionHistoryTable.tsx
│   │   │   ├── api/
│   │   │   │   └── reagentApi.ts
│   │   │   ├── hooks/
│   │   │   │   └── useReagents.ts
│   │   │   └── types/
│   │   │       └── reagent.types.ts
│   │   │
│   │   ├── users/
│   │   │   ├── pages/
│   │   │   │   ├── UserListPage.tsx
│   │   │   │   └── UserCreatePage.tsx
│   │   │   ├── components/
│   │   │   │   ├── UserTable.tsx
│   │   │   │   ├── UserForm.tsx
│   │   │   │   └── RoleBadge.tsx
│   │   │   ├── api/
│   │   │   │   └── userApi.ts
│   │   │   └── hooks/
│   │   │       └── useUsers.ts
│   │   │
│   │   └── portal/
│   │       ├── pages/
│   │       │   ├── PortalLoginPage.tsx
│   │       │   ├── MyReportsPage.tsx
│   │       │   ├── MyReportDetailPage.tsx
│   │       │   └── MyProfilePage.tsx
│   │       ├── components/
│   │       │   ├── ReportCard.tsx
│   │       │   ├── ReportList.tsx
│   │       │   ├── PortalHeader.tsx
│   │       │   ├── PortalLanguageToggle.tsx
│   │       │   └── ReportPdfViewer.tsx
│   │       ├── api/
│   │       │   └── portalApi.ts
│   │       ├── hooks/
│   │       │   └── usePortalReports.ts
│   │       └── types/
│   │           └── portal.types.ts
│   │
│   ├── shared/
│   │   ├── ui/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── IconButton.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── TextArea.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── DateInput.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Table/
│   │   │   │   ├── DataTable.tsx
│   │   │   │   ├── TableToolbar.tsx
│   │   │   │   ├── TablePagination.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Modal/
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── ConfirmDialog.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Badge/
│   │   │   │   ├── Badge.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Card/
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── CardHeader.tsx
│   │   │   │   └── index.ts
│   │   │   ├── EmptyState/
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Loader/
│   │   │   │   ├── PageLoader.tsx
│   │   │   │   ├── InlineLoader.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Alert/
│   │   │   │   ├── Alert.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── icons/
│   │   │   ├── PatientIcon.tsx
│   │   │   ├── OrderIcon.tsx
│   │   │   ├── ReportIcon.tsx
│   │   │   ├── ReagentIcon.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   │   ├── useDisclosure.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── usePagination.ts
│   │   │   └── useDirection.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts
│   │   │   ├── formatDate.ts
│   │   │   ├── formatDateTime.ts
│   │   │   ├── formatResult.ts
│   │   │   ├── formatName.ts
│   │   │   ├── downloadFile.ts
│   │   │   ├── buildQueryParams.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── lib/
│   │   │   ├── apiClient.ts
│   │   │   ├── zod.ts
│   │   │   └── permissions.ts
│   │   │
│   │   └── types/
│   │       ├── app.types.ts
│   │       ├── ui.types.ts
│   │       └── api.types.ts
│   │
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── rtl.ts
│   │   ├── locales/
│   │   │   ├── fr/
│   │   │   │   ├── common.json
│   │   │   │   ├── auth.json
│   │   │   │   ├── dashboard.json
│   │   │   │   ├── patient.json
│   │   │   │   ├── order.json
│   │   │   │   ├── specimen.json
│   │   │   │   ├── result.json
│   │   │   │   ├── report.json
│   │   │   │   ├── reagent.json
│   │   │   │   ├── portal.json
│   │   │   │   ├── users.json
│   │   │   │   └── medical.json
│   │   │   └── ar/
│   │   │       ├── common.json
│   │   │       ├── auth.json
│   │   │       ├── dashboard.json
│   │   │       ├── patient.json
│   │   │       ├── order.json
│   │   │       ├── specimen.json
│   │   │       ├── result.json
│   │   │       ├── report.json
│   │   │       ├── reagent.json
│   │   │       ├── portal.json
│   │   │       ├── users.json
│   │   │       └── medical.json
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── theme.css
│   │   └── utilities.css
│   │
│   └── vite-env.d.ts
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── Dockerfile
└── README.md
```

---

## Verantwortlichkeiten pro Bereich

## app/
Enthält nur Dinge, die für die gesamte App gelten.

Beispiele:
- globale Provider
- globale Layouts
- Router
- Store

---

## features/
Enthält fachliche Module.

Jede Feature-Struktur enthält möglichst:
- `pages/`
- `components/`
- `api/`
- `hooks/`
- `types/`

Ein Feature darf eigene kleine UI-Bausteine besitzen, wenn sie nur dort gebraucht werden.

---

## shared/
Enthält nur wiederverwendbare Dinge.

Beispiele:
- Button
- Table
- Modal
- allgemeine Hooks
- Formatierungsfunktionen
- generische Berechtigungslogik

`shared/` darf keine fachliche Laborlogik enthalten.

---

## i18n/
Enthält:
- Konfiguration
- Sprachdateien
- RTL-Hilfslogik

---

## styles/
Enthält globale CSS-Dateien.

---

## Regeln für Features

Jedes Feature folgt dieser Regel:

```text
feature/
├── pages/        -> komplette Seiten
├── components/   -> Feature-spezifische Komponenten
├── api/          -> RTK Query Endpoints
├── hooks/        -> Custom Hooks
└── types/        -> Feature-spezifische Typen
```

---

## Root-Dateien

### main.tsx
Startpunkt der React App.

Pflichten:
- ReactDOM.createRoot
- AppProviders wrappen
- App rendern

### App.tsx
Lädt die Routenstruktur.

---

## Provider-Struktur

## AppProviders.tsx
Zentrale Hülle für alle Provider.

Empfohlene Reihenfolge:

```tsx
<QueryProvider>
  <AuthProvider>
    <I18nProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </I18nProvider>
  </AuthProvider>
</QueryProvider>
```

## AuthProvider.tsx
Verwaltet:
- aktueller User
- Login Status
- Logout
- Rollenprüfung

## QueryProvider.tsx
Stellt Redux Store + RTK Query bereit.

## I18nProvider.tsx
Initialisiert:
- Sprache
- RTL/LTR Umschaltung
- `document.documentElement.lang`
- `document.documentElement.dir`

---

## Layout-Struktur

## MainLayout.tsx
Für internes Labor-UI.

Enthält:
- Sidebar
- Header
- Hauptinhalt
- ggf. Breadcrumbs

## PatientPortalLayout.tsx
Für Patientenportal.

Enthält:
- einfachen Header
- Sprachumschalter
- Content Bereich
- keine Admin Sidebar

---

## Routing-Struktur

## AppRoutes.tsx
Interne Routen.

Beispiele:
- `/login`
- `/dashboard`
- `/patients`
- `/orders`
- `/specimens`
- `/results`
- `/reports`
- `/reagents`
- `/users`

## PortalRoutes.tsx
Patientenportal Routen.

Beispiele:
- `/portal/login`
- `/portal/reports`
- `/portal/reports/:id`
- `/portal/profile`

## ProtectedRoute.tsx
Prüft:
- eingeloggt oder nicht

## RoleProtectedRoute.tsx
Prüft:
- Rolle des Users

---

## Rollenbasierte Navigation

### RECEPTION
Menüs:
- Dashboard
- Patients
- Orders

### TECHNICIAN
Menüs:
- Dashboard
- Specimens
- Results
- Orders

### PHYSICIAN
Menüs:
- Dashboard
- Reports
- Results
- Patients

### ADMIN
Menüs:
- Dashboard
- Users
- Reagents
- Inventory
- Reports

---

## Seiten pro Feature

## auth
Pflichtseiten:
- LoginPage
- UnauthorizedPage

## patient
Pflichtseiten:
- PatientListPage
- PatientCreatePage
- PatientDetailPage

## order
Pflichtseiten:
- OrderListPage
- OrderCreatePage
- OrderDetailPage

## specimen
Pflichtseiten:
- SpecimenListPage
- SpecimenCreatePage

## result
Pflichtseiten:
- ResultEntryPage
- ResultReviewPage

## report
Pflichtseiten:
- ReportValidationQueue
- ReportDetailPage

## reagent
Pflichtseiten:
- ReagentListPage
- ReagentLotPage
- InventoryDashboardPage

## portal
Pflichtseiten:
- MyReportsPage
- MyReportDetailPage

---

## RTK Query Struktur

Jedes Feature mit Backend-Kommunikation bekommt eine `api/` Datei.

Beispiele:
- `authApi.ts`
- `patientApi.ts`
- `orderApi.ts`
- `reportApi.ts`

Jede API Datei enthält:
- Query Endpoints
- Mutation Endpoints
- automatisch generierte Hooks

Beispiel:
```ts
useGetPatientsQuery
useCreatePatientMutation
useGetOrdersQuery
useValidateReportMutation
```

---

## Shared UI Komponenten

## Button
Varianten:
- primary
- secondary
- danger
- ghost

## Input
Typen:
- text
- email
- date
- tel
- password
- textarea
- select

## Badge
Einsatz:
- Rollen
- Status
- Flags
- Priorität

## DataTable
Enthält:
- Sortierung
- Paginierung
- Suchleiste
- leere Zustände
- Ladezustände

## Modal
Einsatz:
- Bestätigungen
- Formulare
- Warnungen

---

## Design System

### Farben

```text
primary        #1E40AF
primary-dark   #1D4ED8
success        #10B981
warning        #F59E0B
danger         #EF4444
neutral-900    #111827
neutral-700    #374151
neutral-500    #6B7280
neutral-200    #E5E7EB
neutral-100    #F3F4F6
white          #FFFFFF
```

### Farben für Laborstatus

```text
Order PENDING      -> gray
Order COLLECTED    -> blue
Order ANALYZED     -> yellow
Order VALIDATED    -> green
Order PUBLISHED    -> emerald

Flag N             -> gray
Flag H             -> orange
Flag L             -> blue
Flag HH            -> deep orange
Flag LL            -> deep blue
Flag CRITICAL      -> red

Priority ROUTINE   -> gray
Priority URGENT    -> amber
Priority STAT      -> red
```

---

## i18n Struktur

### Unterstützte Sprachen
- `fr`
- `ar`

### Fallback
- `fr`

### Dateistruktur
```text
i18n/locales/fr/common.json
i18n/locales/fr/patient.json
i18n/locales/fr/order.json
...
i18n/locales/ar/common.json
i18n/locales/ar/patient.json
i18n/locales/ar/order.json
...
```

### Regeln
- Keys in FR und AR müssen identisch sein
- Keine harten Texte in Komponenten
- Alle Labels kommen aus Translation Files

Beispiel:
```tsx
t('patient.form.firstName')
t('report.actions.validate')
t('portal.myReports.title')
```

---

## RTL Regeln

Wenn Sprache `ar` ist:

- `document.documentElement.dir = 'rtl'`
- `document.documentElement.lang = 'ar'`

Wenn Sprache `fr` ist:

- `document.documentElement.dir = 'ltr'`
- `document.documentElement.lang = 'fr'`

### Zusätzliche Regeln
- Icons mit Richtung beachten
- Tabellen und Badges visuell prüfen
- Formularlabels für RTL korrekt spiegeln
- Text niemals per CSS künstlich spiegeln

---

## Formular-Regeln

Alle Formulare nutzen:
- React Hook Form
- Zod Validation
- Fehler unter dem Feld
- Submit Loading State
- Disabled Submit Button während Request

Beispiele:
- PatientForm
- OrderForm
- SpecimenForm
- ResultForm
- ReagentForm

---

## API Fehlerbehandlung im Frontend

Regeln:
- globale Anzeige für Serverfehler
- feldbezogene Anzeige für Validierungsfehler
- leere Zustände mit klarer Nachricht
- keine rohen JSON Fehler im UI zeigen

---

## Minimaler Route Plan

```text
/login
/dashboard

/patients
/patients/new
/patients/:id
/patients/:id/edit

/orders
/orders/new
/orders/:id

/specimens
/specimens/new
/specimens/:id

/results
/results/review
/results/history

/reports
/reports/:id
/reports/history

/reagents
/reagents/new
/reagents/lots
/inventory

/users
/users/new

/portal/login
/portal/reports
/portal/reports/:id
/portal/profile
```

---

## Dateibenennungsregeln

### Komponenten
PascalCase:
- `PatientForm.tsx`
- `OrderTable.tsx`

### Hooks
camelCase mit `use`:
- `usePatients.ts`
- `useReportActions.ts`

### API Dateien
camelCase mit `Api`:
- `patientApi.ts`
- `reportApi.ts`

### Utility Dateien
camelCase:
- `formatDate.ts`
- `downloadFile.ts`

---

## Was in Pages gehört

Pages dürfen:
- Feature-Komponenten zusammensetzen
- Daten laden
- Layout verwenden
- Navigation auslösen

Pages dürfen nicht:
- große Business-Logik enthalten
- Übersetzungsdaten selbst definieren
- API Logik duplizieren

---

## Was in Components gehört

Components dürfen:
- UI rendern
- Events auslösen
- Props empfangen
- kleine lokale Zustände halten

Components dürfen nicht:
- globale Business-Regeln kennen
- Berechtigungslogik duplizieren
- API Endpoints direkt hardcoden

---

## Was in Hooks gehört

Hooks dürfen:
- Datenlogik kapseln
- Selektion/Filtern kapseln
- UI-Interaktion abstrahieren

Beispiele:
- `usePatients`
- `useOrders`
- `useReportActions`

---

## Was in shared/utils gehört

Beispiele:
- Datum formatieren
- Ergebnis formatieren
- Query Parameter erzeugen
- Dateidownload
- String Hilfsfunktionen

Nicht erlaubt:
- Laborarzt-spezifische Validierungslogik
- Patient-spezifische Domänenregeln

---

## Sprint 1 – Pflichtdateien

```text
src/main.tsx
src/App.tsx

src/app/providers/AppProviders.tsx
src/app/providers/AuthProvider.tsx
src/app/providers/QueryProvider.tsx
src/app/providers/I18nProvider.tsx

src/app/layout/MainLayout.tsx
src/app/layout/Sidebar.tsx
src/app/layout/Header.tsx

src/app/routes/AppRoutes.tsx
src/app/routes/ProtectedRoute.tsx

src/app/store/store.ts

src/features/auth/pages/LoginPage.tsx
src/features/auth/components/LoginForm.tsx
src/features/auth/api/authApi.ts
src/features/auth/hooks/useAuth.ts

src/features/dashboard/pages/DashboardPage.tsx

src/features/patient/pages/PatientListPage.tsx
src/features/patient/pages/PatientCreatePage.tsx
src/features/patient/pages/PatientDetailPage.tsx
src/features/patient/components/PatientTable.tsx
src/features/patient/components/PatientForm.tsx
src/features/patient/api/patientApi.ts
src/features/patient/hooks/usePatients.ts

src/shared/ui/Button/Button.tsx
src/shared/ui/Input/Input.tsx
src/shared/ui/Table/DataTable.tsx
src/shared/ui/Badge/Badge.tsx
src/shared/ui/Card/Card.tsx

src/shared/utils/cn.ts
src/shared/utils/formatDate.ts

src/i18n/index.ts
src/i18n/rtl.ts
src/i18n/locales/fr/common.json
src/i18n/locales/fr/auth.json
src/i18n/locales/fr/patient.json
src/i18n/locales/ar/common.json
src/i18n/locales/ar/auth.json
src/i18n/locales/ar/patient.json

src/styles/globals.css
src/styles/theme.css
```

---

## Sprint 2 – Nächste Dateien

```text
src/features/order/**
src/features/specimen/**
src/features/result/**
```

---

## Sprint 3 – Nächste Dateien

```text
src/features/report/**
src/features/portal/**
```

---

## Sprint 4 – Nächste Dateien

```text
src/features/reagent/**
src/features/users/**
```

---

## package.json – empfohlte Dependencies

```json
{
  "name": "mlms-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.51.0",
    "react-i18next": "^14.1.0",
    "react-redux": "^9.1.0",
    "react-router-dom": "^6.22.0",
    "i18next": "^23.10.0",
    "zod": "^3.22.0",
    "lucide-react": "^0.379.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^15.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "vitest": "^1.5.0"
  }
}
```

---

## Tailwind Grundidee

### Ziele
- sauberes Admin UI
- responsive Layout
- gute Tabellen
- klare Statusfarben
- einfacher RTL Support

### Wichtige Regeln
- gemeinsame Spacing Werte
- keine wilden Inline Styles
- Farben nur aus Theme
- Buttons und Badges immer aus shared/ui

---

## Seitenfluss MVP

### Reception
1. Login
2. Patient suchen oder anlegen
3. Order anlegen
4. Orderliste ansehen

### Technician
1. Login
2. Specimen erfassen
3. Result eingeben
4. Result prüfen

### Physician
1. Login
2. Report Queue öffnen
3. Report prüfen
4. Validieren
5. Signieren
6. Publizieren

### Patient
1. Portal Login
2. Eigene Reports sehen
3. Report öffnen
4. PDF anzeigen oder herunterladen

---

## Definition of Done für dieses Frontend-File

Dieses Dokument ist korrekt umgesetzt, wenn:

- Frontend bootet mit `npm run dev`
- Login-Seite erreichbar ist
- Dashboard-Seite erreichbar ist
- Patient-Liste erreichbar ist
- FR/AR Umschaltung funktioniert
- RTL für Arabisch funktioniert
- Layout mit Sidebar und Header vorhanden ist
- Shared UI Komponenten existieren
- Sprint-1 Dateien vorhanden sind

---

## Claude Code Prompt für dieses Frontend-File

```text
LIES DIESES KOMPLETTE DOKUMENT 03-FRONTEND-STRUCTURE.md.

Erstelle das gesamte Frontend exakt nach dieser Struktur.

WICHTIGE REGELN:
1. Keine Abweichung bei Ordnernamen.
2. Nutze React 18 + Vite + TypeScript.
3. Nutze Feature-based Architecture.
4. Nutze RTK Query für API-Kommunikation.
5. Nutze react-i18next für FR/AR.
6. Implementiere RTL Support für Arabisch.
7. Implementiere zuerst Sprint 1 vollständig.
8. Erzeuge alle Pflichtdateien aus dem Abschnitt "Sprint 1 – Pflichtdateien".
9. Stelle sicher, dass `npm run dev` funktioniert.
10. Verwende TypeScript strict mode.

Liefere:
- package.json
- vite.config.ts
- tailwind.config.ts
- tsconfig.json
- alle Sprint-1 Dateien
- lauffähiges Routing
- Login UI
- Patient Liste + Patient Formular
- globale Provider Struktur
```

---
