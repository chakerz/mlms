# 05-API-CONTRACTS.md

# API Contracts – MLMS

## Ziel

Dieses Dokument definiert die **API Contracts** zwischen Backend und Frontend.

Es beschreibt:

- Request DTOs
- Response DTOs
- Feldnamen
- Namensregeln
- Endpunkte
- Statuswerte
- Fehlerformate
- Konventionen für Pagination, Filter und Sortierung

Dieses Dokument ist die verbindliche Grundlage für:

- Backend DTOs
- Frontend Types
- RTK Query APIs
- OpenAPI Schema
- Validierung
- Integrationstests

---

## Grundprinzipien

### 1. Eine Quelle der Wahrheit
Die API Contracts müssen im gesamten Projekt identisch verwendet werden.

### 2. Konsistente Feldnamen
Dasselbe Feld muss überall denselben Namen haben.

Beispiel:
- immer `firstName`
- nie einmal `first_name` und einmal `firstname`

### 3. JSON only
Alle API Antworten und Requests verwenden JSON.

### 4. Saubere Ressourcen
Ressourcen werden als Nomen modelliert.

Beispiele:
- `/patients`
- `/orders`
- `/reports`

Nicht als Verben:
- `/createPatient`
- `/validateReportNow`

### 5. IDs sind Strings
Alle IDs sind Strings.

### 6. Datumswerte sind ISO Strings
Alle Daten und Zeitstempel werden als ISO-Strings übertragen.

Beispiel:
```text
2026-03-15T21:30:00.000Z
```

---

## Namensregeln

### Feldnamen
- camelCase
- englische technische Feldnamen
- fachliche Übersetzungen nur im Inhalt, nicht im Feldnamen

### Beispiele
Korrekt:
- `firstName`
- `birthDate`
- `createdAt`
- `currentQuantity`

Nicht korrekt:
- `first_name`
- `BirthDate`
- `created_at`

### Response Keys
Root Responses sollen möglichst klar und stabil sein.

Beispiele:
- `{ "data": ... }`
- `{ "data": [...], "meta": {...} }`
- `{ "error": {...} }`

---

## Standard Response Wrapper

## Erfolgsantwort – einzelnes Objekt

```json
{
  "data": {
    "id": "pat_001",
    "firstName": "Ahmed"
  }
}
```

## Erfolgsantwort – Liste

```json
{
  "data": [
    {
      "id": "pat_001",
      "firstName": "Ahmed"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

## Fehlerantwort

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "details": [
      {
        "field": "firstName",
        "message": "firstName is required"
      }
    ]
  }
}
```

---

## Gemeinsame Basistypen

```typescript
export type Id = string;
export type IsoDateString = string;

export type Language = 'FR' | 'AR';
export type UserRole = 'RECEPTION' | 'TECHNICIAN' | 'PHYSICIAN' | 'ADMIN';
export type Gender = 'M' | 'F' | 'O';

export type OrderPriority = 'ROUTINE' | 'URGENT' | 'STAT';
export type OrderStatus =
  | 'PENDING'
  | 'COLLECTED'
  | 'ANALYZED'
  | 'VALIDATED'
  | 'PUBLISHED'
  | 'CANCELLED';

export type SpecimenType = 'BLOOD' | 'URINE' | 'STOOL' | 'TISSUE';
export type SpecimenStatus =
  | 'COLLECTED'
  | 'RECEIVED'
  | 'PROCESSED'
  | 'DISPOSED'
  | 'REJECTED';

export type ResultFlag = 'N' | 'H' | 'L' | 'HH' | 'LL' | 'CRITICAL';

export type ReportStatus =
  | 'DRAFT'
  | 'VALIDATED'
  | 'FINAL'
  | 'CORRECTED'
  | 'PUBLISHED';

export type ReagentCategory =
  | 'CHEMISTRY'
  | 'HEMATOLOGY'
  | 'IMMUNOLOGY'
  | 'MICROBIOLOGY';
```

---

## Standard Meta DTO

```typescript
export interface PaginationMetaDto {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
```

---

## Standard Wrapper DTOs

```typescript
export interface ApiSuccessResponse<T> {
  data: T;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: PaginationMetaDto;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ApiFieldError[];
  };
}
```

---

## AUTH CONTRACTS

## Login Request

```typescript
export interface LoginRequestDto {
  email: string;
  password: string;
}
```

## Login Response

```typescript
export interface LoginResponseDto {
  accessToken: string;
  user: CurrentUserDto;
}
```

## Current User

```typescript
export interface CurrentUserDto {
  id: Id;
  email: string;
  role: UserRole;
  language: Language;
  isActive: boolean;
  createdAt: IsoDateString;
}
```

## Register User Request

```typescript
export interface RegisterUserRequestDto {
  email: string;
  password: string;
  role: UserRole;
  language: Language;
}
```

## Endpoints

```text
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
```

---

## PATIENT CONTRACTS

## Patient DTO

```typescript
export interface PatientDto {
  id: Id;
  firstName: string;
  lastName: string;
  birthDate: IsoDateString;
  gender: Gender;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
  orderCount?: number;
}
```

## Create Patient Request

```typescript
export interface CreatePatientRequestDto {
  firstName: string;
  lastName: string;
  birthDate: IsoDateString;
  gender: Gender;
  phone?: string;
  email?: string;
  address?: string;
}
```

## Update Patient Request

```typescript
export interface UpdatePatientRequestDto {
  firstName?: string;
  lastName?: string;
  birthDate?: IsoDateString;
  gender?: Gender;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}
```

## Patient List Query

```typescript
export interface ListPatientsQueryDto {
  page?: number;
  pageSize?: number;
  search?: string;
  gender?: Gender;
}
```

## Patient Endpoints

```text
POST  /api/patients
GET   /api/patients
GET   /api/patients/:id
PATCH /api/patients/:id
```

## Beispiel Response – einzelner Patient

```json
{
  "data": {
    "id": "pat_001",
    "firstName": "Ahmed",
    "lastName": "El Mansouri",
    "birthDate": "1990-04-01T00:00:00.000Z",
    "gender": "M",
    "phone": "+212600000000",
    "email": "ahmed@example.com",
    "address": "Casablanca, Morocco",
    "createdAt": "2026-03-15T20:00:00.000Z",
    "updatedAt": "2026-03-15T20:00:00.000Z",
    "orderCount": 2
  }
}
```

---

## ORDER CONTRACTS

## Test Order Item DTO

```typescript
export interface TestOrderItemDto {
  id: Id;
  orderId: Id;
  testCode: string;
  testNameFr: string;
  testNameAr: string;
  priority: 'ROUTINE' | 'URGENT';
  notes?: string | null;
}
```

## Order DTO

```typescript
export interface OrderDto {
  id: Id;
  patientId: Id;
  status: OrderStatus;
  priority: OrderPriority;
  createdBy?: Id | null;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
  tests: TestOrderItemDto[];
}
```

## Create Order Request

```typescript
export interface CreateOrderRequestDto {
  patientId: Id;
  priority: OrderPriority;
  tests: Array<{
    testCode: string;
    priority: 'ROUTINE' | 'URGENT';
    notes?: string;
  }>;
}
```

## Update Order Status Request

```typescript
export interface UpdateOrderStatusRequestDto {
  status: OrderStatus;
}
```

## List Orders Query

```typescript
export interface ListOrdersQueryDto {
  page?: number;
  pageSize?: number;
  patientId?: Id;
  status?: OrderStatus;
  priority?: OrderPriority;
}
```

## Order Endpoints

```text
POST  /api/orders
GET   /api/orders
GET   /api/orders/:id
PATCH /api/orders/:id/status
POST  /api/orders/:id/cancel
```

---

## SPECIMEN CONTRACTS

## Specimen DTO

```typescript
export interface SpecimenDto {
  id: Id;
  orderId: Id;
  barcode: string;
  type: SpecimenType;
  status: SpecimenStatus;
  collectionTime: IsoDateString;
  receivedAt?: IsoDateString | null;
  notes?: string | null;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}
```

## Create Specimen Request

```typescript
export interface CreateSpecimenRequestDto {
  orderId: Id;
  barcode: string;
  type: SpecimenType;
  collectionTime: IsoDateString;
  notes?: string;
}
```

## Update Specimen Status Request

```typescript
export interface UpdateSpecimenStatusRequestDto {
  status: SpecimenStatus;
  receivedAt?: IsoDateString | null;
}
```

## Specimen Endpoints

```text
POST  /api/specimens
GET   /api/specimens/:id
GET   /api/orders/:id/specimens
PATCH /api/specimens/:id/status
```

---

## RESULT CONTRACTS

## Result DTO

```typescript
export interface ResultDto {
  id: Id;
  specimenId: Id;
  testCode: string;
  testNameFr: string;
  testNameAr: string;
  value: string;
  unit?: string | null;
  referenceLow?: number | null;
  referenceHigh?: number | null;
  flag: ResultFlag;
  measuredAt: IsoDateString;
  measuredBy?: Id | null;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}
```

## Record Result Request

```typescript
export interface RecordResultRequestDto {
  specimenId: Id;
  testCode: string;
  testNameFr: string;
  testNameAr: string;
  value: string;
  unit?: string;
  referenceLow?: number;
  referenceHigh?: number;
  flag: ResultFlag;
  measuredAt: IsoDateString;
}
```

## Update Result Request

```typescript
export interface UpdateResultRequestDto {
  value?: string;
  unit?: string | null;
  referenceLow?: number | null;
  referenceHigh?: number | null;
  flag?: ResultFlag;
  measuredAt?: IsoDateString;
}
```

## Result Endpoints

```text
POST   /api/results
PATCH  /api/results/:id
GET    /api/specimens/:id/results
GET    /api/orders/:id/results
```

---

## REPORT CONTRACTS

## Report DTO

```typescript
export interface ReportDto {
  id: Id;
  orderId: Id;
  status: ReportStatus;
  commentsFr?: string | null;
  commentsAr?: string | null;
  validatedBy?: Id | null;
  validatedAt?: IsoDateString | null;
  signedBy?: Id | null;
  signedAt?: IsoDateString | null;
  publishedAt?: IsoDateString | null;
  templateVersion: string;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}
```

## Report Detail DTO

```typescript
export interface ReportDetailDto {
  report: ReportDto;
  patient: PatientDto;
  order: OrderDto;
  results: ResultDto[];
}
```

## Generate Report Request

```typescript
export interface GenerateReportRequestDto {
  orderId: Id;
  templateVersion: string;
}
```

## Validate Report Request

```typescript
export interface ValidateReportRequestDto {
  commentsFr?: string;
  commentsAr?: string;
}
```

## Sign Report Request

```typescript
export interface SignReportRequestDto {
  signedBy: Id;
}
```

## Publish Report Request

```typescript
export interface PublishReportRequestDto {
  publishToPortal: boolean;
}
```

## Report Endpoints

```text
POST /api/reports/generate
GET  /api/reports
GET  /api/reports/:id
POST /api/reports/:id/validate
POST /api/reports/:id/sign
POST /api/reports/:id/publish
POST /api/reports/:id/correct
```

## Beispiel Response – Report Detail

```json
{
  "data": {
    "report": {
      "id": "rep_001",
      "orderId": "ord_001",
      "status": "VALIDATED",
      "commentsFr": "Profil standard validé.",
      "commentsAr": "تمت مراجعة الملف.",
      "validatedBy": "usr_003",
      "validatedAt": "2026-03-15T20:30:00.000Z",
      "signedBy": null,
      "signedAt": null,
      "publishedAt": null,
      "templateVersion": "v1",
      "createdAt": "2026-03-15T20:20:00.000Z",
      "updatedAt": "2026-03-15T20:30:00.000Z"
    },
    "patient": {
      "id": "pat_001",
      "firstName": "Ahmed",
      "lastName": "El Mansouri",
      "birthDate": "1990-04-01T00:00:00.000Z",
      "gender": "M",
      "phone": null,
      "email": null,
      "address": null,
      "createdAt": "2026-03-15T20:00:00.000Z",
      "updatedAt": "2026-03-15T20:00:00.000Z",
      "orderCount": 1
    },
    "order": {
      "id": "ord_001",
      "patientId": "pat_001",
      "status": "ANALYZED",
      "priority": "ROUTINE",
      "createdBy": "usr_001",
      "createdAt": "2026-03-15T20:05:00.000Z",
      "updatedAt": "2026-03-15T20:10:00.000Z",
      "tests": [
        {
          "id": "to_001",
          "orderId": "ord_001",
          "testCode": "GLU",
          "testNameFr": "Glycémie",
          "testNameAr": "سكر الدم",
          "priority": "ROUTINE",
          "notes": null
        }
      ]
    },
    "results": [
      {
        "id": "res_001",
        "specimenId": "spc_001",
        "testCode": "GLU",
        "testNameFr": "Glycémie",
        "testNameAr": "سكر الدم",
        "value": "112",
        "unit": "mg/dL",
        "referenceLow": 70,
        "referenceHigh": 110,
        "flag": "H",
        "measuredAt": "2026-03-15T20:15:00.000Z",
        "measuredBy": "usr_002",
        "createdAt": "2026-03-15T20:15:00.000Z",
        "updatedAt": "2026-03-15T20:15:00.000Z"
      }
    ]
  }
}
``Hier ist **File 5** vollständig in **einem** Codeblock, damit du es direkt als `docs/05-API-CONTRACTS.md` kopieren kannst.[1]
Die Struktur ist design-first und nutzt konsistente, ressourcenorientierte Benennung, weil API-Best-Practice-Quellen vorhersehbare Pfade, JSON/OpenAPI-Schemas und Nomen für Ressourcen empfehlen.[3][4][5]

````markdown
# 05-API-CONTRACTS.md

# API Contracts – MLMS

## Ziel

Dieses Dokument definiert die **API Contracts** für das MLMS.

Es beschreibt:

- Request DTOs
- Response DTOs
- Feldnamen
- Standard-Response-Formate
- Pagination
- Fehlerformate
- REST-Endpunkte
- Rollenbezug
- Regeln für Benennung und Konsistenz

Dieses Dokument ist die verbindliche Grundlage für:

- Backend DTOs
- Frontend Types
- RTK Query Endpoints
- OpenAPI Dokumentation
- Validierung
- API Tests

---

## Grundprinzipien

### 1. Design-first
Die API wird zuerst als Vertrag definiert, danach implementiert.

### 2. Eine Sprache für alle Schichten
Feldnamen in:
- Backend
- Frontend
- Contracts
- OpenAPI
- Tests

müssen identisch sein.

### 3. Ressourcenorientiert
URLs beschreiben Ressourcen, nicht Aktionen.

### 4. JSON als Standard
Alle Request- und Response-Bodies sind JSON.

### 5. Konsistente Namensgebung
- Felder: `camelCase`
- DTOs: PascalCase
- Pfade: pluralisierte Ressourcen
- IDs: `string`

### 6. Keine UI-spezifischen Sonderformate
Die API liefert neutrale Daten.
Darstellung, Farben und Icons sind Frontend-Aufgabe.

---

## Basisregeln

## Content Type

```http
Content-Type: application/json
Accept: application/json
```

## Auth Header

```http
Authorization: Bearer <jwt-token>
```

## Sprache

Die Sprache kann über Header oder User-Profil bestimmt werden.

Unterstützt:

```text
FR
AR
```

Optionaler Header:

```http
X-Language: FR
X-Language: AR
```

Wenn kein Header gesetzt ist:
1. User.language
2. Default = FR

---

## Standard API Prefix

```text
/api
```

Alle Endpunkte beginnen mit `/api`.

---

## Standard Response Envelope

Alle erfolgreichen Responses sollen dieses Standardformat verwenden:

```json
{
  "success": true,
  "data": {},
  "meta": null,
  "error": null
}
```

### Erklärung
- `success`: boolean
- `data`: eigentliche Nutzdaten
- `meta`: Pagination oder Zusatzinfos
- `error`: bei Erfolg immer `null`

---

## Standard Error Envelope

Alle Fehlerresponses sollen dieses Format nutzen:

```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": []
  }
}
```

### Felder
- `code`: technischer Fehlercode
- `message`: lesbare Kurzbeschreibung
- `details`: optionale Liste mit Feldfehlern oder Zusatzinfos

---

## Standard Pagination Format

Für Listen mit Pagination:

```json
{
  "success": true,
  "data": [
    {}
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 120,
    "totalPages": 6
  },
  "error": null
}
```

---

## Feldkonventionen

## IDs
Alle IDs sind Strings.

Beispiel:
```json
{
  "id": "clx123abc456"
}
```

## Timestamps
Alle Zeitstempel sind ISO-8601 Strings.

Beispiel:
```json
{
  "createdAt": "2026-03-15T21:30:00.000Z"
}
```

## Nullable Felder
Wenn ein optionales Feld leer ist, wird `null` bevorzugt statt `undefined`.

---

## Gemeinsame Typen

## Language

```ts
export type Language = 'FR' | 'AR';
```

## UserRole

```ts
export type UserRole = 'RECEPTION' | 'TECHNICIAN' | 'PHYSICIAN' | 'ADMIN';
```

## Gender

```ts
export type Gender = 'M' | 'F' | 'O';
```

## OrderPriority

```ts
export type OrderPriority = 'ROUTINE' | 'URGENT' | 'STAT';
```

## OrderStatus

```ts
export type OrderStatus =
  | 'PENDING'
  | 'COLLECTED'
  | 'ANALYZED'
  | 'VALIDATED'
  | 'PUBLISHED'
  | 'CANCELLED';
```

## SpecimenType

```ts
export type SpecimenType = 'BLOOD' | 'URINE' | 'STOOL' | 'TISSUE';
```

## SpecimenStatus

```ts
export type SpecimenStatus =
  | 'COLLECTED'
  | 'RECEIVED'
  | 'PROCESSED'
  | 'DISPOSED'
  | 'REJECTED';
```

## ResultFlag

```ts
export type ResultFlag = 'N' | 'H' | 'L' | 'HH' | 'LL' | 'CRITICAL';
```

## ReportStatus

```ts
export type ReportStatus =
  | 'DRAFT'
  | 'VALIDATED'
  | 'FINAL'
  | 'CORRECTED'
  | 'PUBLISHED';
```

## ReagentCategory

```ts
export type ReagentCategory =
  | 'CHEMISTRY'
  | 'HEMATOLOGY'
  | 'IMMUNOLOGY'
  | 'MICROBIOLOGY';
```

---

## Verzeichnisstruktur für Contracts

```text
contracts/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── common/
    │   ├── api-response.ts
    │   ├── error-response.ts
    │   ├── pagination.ts
    │   └── enums.ts
    ├── auth/
    │   ├── login.dto.ts
    │   ├── register-user.dto.ts
    │   ├── current-user.dto.ts
    │   └── index.ts
    ├── patient/
    │   ├── register-patient.dto.ts
    │   ├── update-patient.dto.ts
    │   ├── patient.dto.ts
    │   ├── patient-search.dto.ts
    │   └── index.ts
    ├── order/
    │   ├── create-order.dto.ts
    │   ├── update-order-status.dto.ts
    │   ├── order.dto.ts
    │   ├── test-order.dto.ts
    │   └── index.ts
    ├── specimen/
    │   ├── create-specimen.dto.ts
    │   ├── update-specimen-status.dto.ts
    │   ├── specimen.dto.ts
    │   └── index.ts
    ├── result/
    │   ├── record-result.dto.ts
    │   ├── update-result.dto.ts
    │   ├── result.dto.ts
    │   └── index.ts
    ├── report/
    │   ├── generate-report.dto.ts
    │   ├── validate-report.dto.ts
    │   ├── sign-report.dto.ts
    │   ├── publish-report.dto.ts
    │   ├── report.dto.ts
    │   ├── report-result.dto.ts
    │   └── index.ts
    ├── reagent/
    │   ├── create-reagent.dto.ts
    │   ├── receive-reagent-lot.dto.ts
    │   ├── consume-reagent.dto.ts
    │   ├── reagent.dto.ts
    │   ├── reagent-lot.dto.ts
    │   └── index.ts
    ├── portal/
    │   ├── patient-portal-report.dto.ts
    │   ├── patient-portal-profile.dto.ts
    │   └── index.ts
    └── audit/
        ├── audit-entry.dto.ts
        └── index.ts
```

---

## Common Contracts

## api-response.ts

```ts
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta: PaginationMeta | null;
  error: null;
}

export interface ApiErrorResponse {
  success: false;
  data: null;
  meta: null;
  error: {
    code: string;
    message: string;
    details?: Array<{
      field?: string;
      message: string;
    }>;
  };
}
```

## pagination.ts

```ts
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginationQueryDto {
  page?: number;
  pageSize?: number;
}
```

## enums.ts

```ts
export type Language = 'FR' | 'AR';
export type UserRole = 'RECEPTION' | 'TECHNICIAN' | 'PHYSICIAN' | 'ADMIN';
export type Gender = 'M' | 'F' | 'O';
export type OrderPriority = 'ROUTINE' | 'URGENT' | 'STAT';
export type OrderStatus =
  | 'PENDING'
  | 'COLLECTED'
  | 'ANALYZED'
  | 'VALIDATED'
  | 'PUBLISHED'
  | 'CANCELLED';
export type SpecimenType = 'BLOOD' | 'URINE' | 'STOOL' | 'TISSUE';
export type SpecimenStatus =
  | 'COLLECTED'
  | 'RECEIVED'
  | 'PROCESSED'
  | 'DISPOSED'
  | 'REJECTED';
export type ResultFlag = 'N' | 'H' | 'L' | 'HH' | 'LL' | 'CRITICAL';
export type ReportStatus =
  | 'DRAFT'
  | 'VALIDATED'
  | 'FINAL'
  | 'CORRECTED'
  | 'PUBLISHED';
export type ReagentCategory =
  | 'CHEMISTRY'
  | 'HEMATOLOGY'
  | 'IMMUNOLOGY'
  | 'MICROBIOLOGY';
```

---

## Auth Contracts

## login.dto.ts

```ts
export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  user: CurrentUserDto;
}
```

## register-user.dto.ts

```ts
import type { Language, UserRole } from '../common/enums';

export interface RegisterUserDto {
  email: string;
  password: string;
  role: UserRole;
  language: Language;
}
```

## current-user.dto.ts

```ts
import type { Language, UserRole } from '../common/enums';

export interface CurrentUserDto {
  id: string;
  email: string;
  role: UserRole;
  language: Language;
  isActive: boolean;
  createdAt: string;
}
```

---

## Patient Contracts

## register-patient.dto.ts

```ts
import type { Gender } from '../common/enums';

export interface RegisterPatientDto {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: Gender;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}
```

## update-patient.dto.ts

```ts
import type { Gender } from '../common/enums';

export interface UpdatePatientDto {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  gender?: Gender;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}
```

## patient.dto.ts

```ts
import type { Gender } from '../common/enums';

export interface PatientDto {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: Gender;
  phone: string | null;
  email: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}
```

## patient-search.dto.ts

```ts
export interface PatientSearchDto {
  query?: string;
  page?: number;
  pageSize?: number;
}
```

---

## Order Contracts

## test-order.dto.ts

```ts
export interface TestOrderDto {
  id: string;
  orderId: string;
  testCode: string;
  testNameFr: string;
  testNameAr: string;
  priority: 'ROUTINE' | 'URGENT';
  notes: string | null;
}
```

## create-order.dto.ts

```ts
import type { OrderPriority } from '../common/enums';

export interface CreateOrderDto {
  patientId: string;
  priority: OrderPriority;
  tests: Array<{
    testCode: string;
    testNameFr: string;
    testNameAr: string;
    priority: 'ROUTINE' | 'URGENT';
    notes?: string | null;
  }>;
}
```

## update-order-status.dto.ts

```ts
import type { OrderStatus } from '../common/enums';

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}
```

## order.dto.ts

```ts
import type { OrderPriority, OrderStatus } from '../common/enums';
import type { TestOrderDto } from './test-order.dto';

export interface OrderDto {
  id: string;
  patientId: string;
  status: OrderStatus;
  priority: OrderPriority;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  tests: TestOrderDto[];
}
```

---

## Specimen Contracts

## create-specimen.dto.ts

```ts
import type { SpecimenType } from '../common/enums';

export interface CreateSpecimenDto {
  orderId: string;
  barcode: string;
  type: SpecimenType;
  collectionTime: string;
  notes?: string | null;
}
```

## update-specimen-status.dto.ts

```ts
import type { SpecimenStatus } from '../common/enums';

export interface UpdateSpecimenStatusDto {
  status: SpecimenStatus;
}
```

## specimen.dto.ts

```ts
import type { SpecimenStatus, SpecimenType } from '../common/enums';

export interface SpecimenDto {
  id: string;
  orderId: string;
  barcode: string;
  type: SpecimenType;
  status: SpecimenStatus;
  collectionTime: string;
  receivedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
```

---

## Result Contracts

## record-result.dto.ts

```ts
import type { ResultFlag } from '../common/enums';

export interface RecordResultDto {
  specimenId: string;
  testCode: string;
  testNameFr: string;
  testNameAr: string;
  value: string;
  unit?: string | null;
  referenceLow?: number | null;
  referenceHigh?: number | null;
  flag: ResultFlag;
  measuredAt: string;
  measuredBy?: string | null;
}
```

## update-result.dto.ts

```ts
import type { ResultFlag } from '../common/enums';

export interface UpdateResultDto {
  value?: string;
  unit?: string | null;
  referenceLow?: number | null;
  referenceHigh?: number | null;
  flag?: ResultFlag;
  measuredAt?: string;
}
```

## result.dto.ts

```ts
import type { ResultFlag } from '../common/enums';

export interface ResultDto {
  id: string;
  specimenId: string;
  testCode: string;
  testNameFr: string;
  testNameAr: string;
  value: string;
  unit: string | null;
  referenceLow: number | null;
  referenceHigh: number | null;
  flag: ResultFlag;
  measuredAt: string;
  measuredBy: string | null;
  createdAt: string;
  updatedAt: string;
}
```

---

## Report Contracts

## report-result.dto.ts

```ts
import type { ResultFlag } from '../common/enums';

export interface ReportResultDto {
  id: string;
  testCode: string;
  testNameFr: string;
  testNameAr: string;
  value: string;
  unit: string | null;
  referenceLow: number | null;
  referenceHigh: number | null;
  flag: ResultFlag;
  measuredAt: string;
}
```

## generate-report.dto.ts

```ts
export interface GenerateReportDto {
  orderId: string;
  templateVersion: string;
}
```

## validate-report.dto.ts

```ts
export interface ValidateReportDto {
  commentsFr?: string | null;
  commentsAr?: string | null;
}
```

## sign-report.dto.ts

```ts
export interface SignReportDto {
  signedBy: string;
}
```

## publish-report.dto.ts

```ts
export interface PublishReportDto {
  publishToPortal: boolean;
}
```

## report.dto.ts

```ts
import type { ReportStatus } from '../common/enums';
import type { ReportResultDto } from './report-result.dto';

export interface ReportDto {
  id: string;
  orderId: string;
  status: ReportStatus;
  commentsFr: string | null;
  commentsAr: string | null;
  validatedBy: string | null;
  validatedAt: string | null;
  signedBy: string | null;
  signedAt: string | null;
  publishedAt: string | null;
  templateVersion: string;
  createdAt: string;
  updatedAt: string;
  results: ReportResultDto[];
}
```

---

## Reagent Contracts

## create-reagent.dto.ts

```ts
import type { ReagentCategory } from '../common/enums';

export interface CreateReagentDto {
  name: string;
  manufacturer: string;
  catalogNumber?: string | null;
  category: ReagentCategory;
  storageTemp?: string | null;
}
```

## receive-reagent-lot.dto.ts

```ts
export interface ReceiveReagentLotDto {
  reagentId: string;
  lotNumber: string;
  expiryDate: string;
  initialQuantity: number;
  currentQuantity: number;
  storageLocation?: string | null;
}
```

## consume-reagent.dto.ts

```ts
export interface ConsumeReagentDto {
  reagentLotId: string;
  quantity: number;
  reason: string;
  orderId?: string | null;
  specimenId?: string | null;
  resultId?: string | null;
}
```

## reagent.dto.ts

```ts
import type { ReagentCategory } from '../common/enums';

export interface ReagentDto {
  id: string;
  name: string;
  manufacturer: string;
  catalogNumber: string | null;
  category: ReagentCategory;
  storageTemp: string | null;
  createdAt: string;
  updatedAt: string;
}
```

## reagent-lot.dto.ts

```ts
export interface ReagentLotDto {
  id: string;
  reagentId: string;
  lotNumber: string;
  expiryDate: string;
  initialQuantity: number;
  currentQuantity: number;
  isBlocked: boolean;
  storageLocation: string | null;
  createdAt: string;
  updatedAt: string;
}
```

---

## Portal Contracts

## patient-portal-report.dto.ts

```ts
import type { ReportStatus, ResultFlag } from '../common/enums';

export interface PatientPortalReportDto {
  id: string;
  orderId: string;
  status: ReportStatus;
  publishedAt: string | null;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
  };
  results: Array<{
    testCode: string;
    testNameFr: string;
    testNameAr: string;
    value: string;
    unit: string | null;
    flag: ResultFlag;
    referenceLow: number | null;
    referenceHigh: number | null;
  }>;
  commentsFr: string | null;
  commentsAr: string | null;
}
```

## patient-portal-profile.dto.ts

```ts
export interface PatientPortalProfileDto {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'M' | 'F' | 'O';
  phone: string | null;
  email: string | null;
  address: string | null;
}
```

---

## Audit Contracts

## audit-entry.dto.ts

```ts
export interface AuditEntryDto {
  id: string;
  actorUserId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  beforeJson: string | null;
  afterJson: string | null;
  createdAt: string;
}
```

---

## HTTP Endpunkte und Contracts

## Auth

### POST /api/auth/login

Request:
```json
{
  "email": "doctor@lab.ma",
  "password": "secret123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt-token",
    "user": {
      "id": "usr_1",
      "email": "doctor@lab.ma",
      "role": "PHYSICIAN",
      "language": "FR",
      "isActive": true,
      "createdAt": "2026-03-15T20:00:00.000Z"
    }
  },
  "meta": null,
  "error": null
}
```

### GET /api/auth/me

Response:
```json
{
  "success": true,
  "data": {
    "id": "usr_1",
    "email": "doctor@lab.ma",
    "role": "PHYSICIAN",
    "language": "FR",
    "isActive": true,
    "createdAt": "2026-03-15T20:00:00.000Z"
  },
  "meta": null,
  "error": null
}
```

---

## Patients

### POST /api/patients

Request:
```json
{
  "firstName": "Amina",
  "lastName": "El Idrissi",
  "birthDate": "1992-05-12",
  "gender": "F",
  "phone": "+212600000000",
  "email": "amina@example.com",
  "address": "Casablanca"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "pat_1",
    "firstName": "Amina",
    "lastName": "El Idrissi",
    "birthDate": "1992-05-12T00:00:00.000Z",
    "gender": "F",
    "phone": "+212600000000",
    "email": "amina@example.com",
    "address": "Casablanca",
    "createdAt": "2026-03-15T20:10:00.000Z",
    "updatedAt": "2026-03-15T20:10:00.000Z"
  },
  "meta": null,
  "error": null
}
```

### GET /api/patients?page=1&pageSize=20&query=amina

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "pat_1",
      "firstName": "Amina",
      "lastName": "El Idrissi",
      "birthDate": "1992-05-12T00:00:00.000Z",
      "gender": "F",
      "phone": "+212600000000",
      "email": "amina@example.com",
      "address": "Casablanca",
      "createdAt": "2026-03-15T20:10:00.000Z",
      "updatedAt": "2026-03-15T20:10:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 1,
    "totalPages": 1
  },
  "error": null
}
```

### GET /api/patients/:id

### PATCH /api/patients/:id

---

## Orders

### POST /api/orders

Request:
```json
{
  "patientId": "pat_1",
  "priority": "ROUTINE",
  "tests": [
    {
      "testCode": "HGB",
      "testNameFr": "Hémoglobine",
      "testNameAr": "الهيموغلوبين",
      "priority": "ROUTINE",
      "notes": null
    },
    {
      "testCode": "GLU",
      "testNameFr": "Glycémie",
      "testNameAr": "سكر الدم",
      "priority": "ROUTINE",
      "notes": null
    }
  ]
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "ord_1",
    "patientId": "pat_1",
    "status": "PENDING",
    "priority": "ROUTINE",
    "createdBy": "usr_2",
    "createdAt": "2026-03-15T20:20:00.000Z",
    "updatedAt": "2026-03-15T20:20:00.000Z",
    "tests": [
      {
        "id": "to_1",
        "orderId": "ord_1",
        "testCode": "HGB",
        "testNameFr": "Hémoglobine",
        "testNameAr": "الهيموغلوبين",
        "priority": "ROUTINE",
        "notes": null
      },
      {
        "id": "to_2",
        "orderId": "ord_1",
        "testCode": "GLU",
        "testNameFr": "Glycémie",
        "testNameAr": "سكر الدم",
        "priority": "ROUTINE",
        "notes": null
      }
    ]
  },
  "meta": null,
  "error": null
}
```

### GET /api/orders

### GET /api/orders/:id

### PATCH /api/orders/:id/status

Request:
```json
{
  "status": "COLLECTED"
}
```

---

## Specimens

### POST /api/specimens

Request:
```json
{
  "orderId": "ord_1",
  "barcode": "LAB-2026-00001",
  "type": "BLOOD",
  "collectionTime": "2026-03-15T20:30:00.000Z",
  "notes": null
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "sp_1",
    "orderId": "ord_1",
    "barcode": "LAB-2026-00001",
    "type": "BLOOD",
    "status": "COLLECTED",
    "collectionTime": "2026-03-15T20:30:00.000Z",
    "receivedAt": null,
    "notes": null,
    "createdAt": "2026-03-15T20:31:00.000Z",
    "updatedAt": "2026-03-15T20:31:00.000Z"
  },
  "meta": null,
  "error": null
}
```

### PATCH /api/specimens/:id/status

Request:
```json
{
  "status": "RECEIVED"
}
```

---

## Results

### POST /api/results

Request:
```json
{
  "specimenId": "sp_1",
  "testCode": "GLU",
  "testNameFr": "Glycémie",
  "testNameAr": "سكر الدم",
  "value": "126",
  "unit": "mg/dL",
  "referenceLow": 70,
  "referenceHigh": 110,
  "flag": "H",
  "measuredAt": "2026-03-15T20:45:00.000Z",
  "measuredBy": "usr_3"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "res_1",
    "specimenId": "sp_1",
    "testCode": "GLU",
    "testNameFr": "Glycémie",
    "testNameAr": "سكر الدم",
    "value": "126",
    "unit": "mg/dL",
    "referenceLow": 70,
    "referenceHigh": 110,
    "flag": "H",
    "measuredAt": "2026-03-15T20:45:00.000Z",
    "measuredBy": "usr_3",
    "createdAt": "2026-03-15T20:46:00.000Z",
    "updatedAt": "2026-03-15T20:46:00.000Z"
  },
  "meta": null,
  "error": null
}
```

### PATCH /api/results/:id

### GET /api/orders/:id/results

---

## Reports

### POST /api/reports/generate

Request:
```json
{
  "orderId": "ord_1",
  "templateVersion": "v1"
}
```

### POST /api/reports/:id/validate

Request:
```json
{
  "commentsFr": "Résultats compatibles avec une hyperglycémie.",
  "commentsAr": "النتائج متوافقة مع ارتفاع سكر الدم."
}
```

### POST /api/reports/:id/sign

Request:
```json
{
  "signedBy": "usr_physician_1"
}
```

### POST /api/reports/:id/publish

Request:
```json
{
  "publishToPortal": true
}
```

### GET /api/reports/:id

Response:
```json
{
  "success": true,
  "data": {
    "id": "rep_1",
    "orderId": "ord_1",
    "status": "PUBLISHED",
    "commentsFr": "Résultats compatibles avec une hyperglycémie.",
    "commentsAr": "النتائج متوافقة مع ارتفاع سكر الدم.",
    "validatedBy": "usr_physician_1",
    "validatedAt": "2026-03-15T21:00:00.000Z",
    "signedBy": "usr_physician_1",
    "signedAt": "2026-03-15T21:02:00.000Z",
    "publishedAt": "2026-03-15T21:03:00.000Z",
    "templateVersion": "v1",
    "createdAt": "2026-03-15T20:58:00.000Z",
    "updatedAt": "2026-03-15T21:03:00.000Z",
    "results": [
      {
        "id": "res_1",
        "testCode": "GLU",
        "testNameFr": "Glycémie",
        "testNameAr": "سكر الدم",
        "value": "126",
        "unit": "mg/dL",
        "referenceLow": 70,
        "referenceHigh": 110,
        "flag": "H",
        "measuredAt": "2026-03-15T20:45:00.000Z"
      }
    ]
  },
  "meta": null,
  "error": null
}
```

---

## Reagents

### POST /api/reagents

Request:
```json
{
  "name": "Glucose Reagent",
  "manufacturer": "BioLab",
  "catalogNumber": "GLU-001",
  "category": "CHEMISTRY",
  "storageTemp": "2-8C"
}
```

### GET /api/reagents

### POST /api/reagents/lots

Request:
```json
{
  "reagentId": "rea_1",
  "lotNumber": "LOT-2026-001",
  "expiryDate": "2026-12-31",
  "initialQuantity": 100,
  "currentQuantity": 100,
  "storageLocation": "FRIDGE-A"
}
```

### GET /api/reagents/:id/lots

### POST /api/reagents/consume

Request:
```json
{
  "reagentLotId": "lot_1",
  "quantity": 2,
  "reason": "GLU test run",
  "orderId": "ord_1",
  "specimenId": "sp_1",
  "resultId": "res_1"
}
```

---

## Portal

### GET /api/portal/reports

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "rep_1",
      "orderId": "ord_1",
      "status": "PUBLISHED",
      "publishedAt": "2026-03-15T21:03:00.000Z",
      "patient": {
        "id": "pat_1",
        "firstName": "Amina",
        "lastName": "El Idrissi",
        "birthDate": "1992-05-12T00:00:00.000Z"
      },
      "results": [
        {
          "testCode": "GLU",
          "testNameFr": "Glycémie",
          "testNameAr": "سكر الدم",
          "value": "126",
          "unit": "mg/dL",
          "flag": "H",
          "referenceLow": 70,
          "referenceHigh": 110
        }
      ],
      "commentsFr": "Résultats compatibles avec une hyperglycémie.",
      "commentsAr": "النتائج متوافقة مع ارتفاع سكر الدم."
    }
  ],
  "meta": null,
  "error": null
}
```

### GET /api/portal/reports/:id

---

## HTTP Status Codes

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
500 Internal Server Error
```

---

## Fehlercodes

```text
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
CONFLICT
PATIENT_NOT_FOUND
ORDER_NOT_FOUND
SPECIMEN_NOT_FOUND
RESULT_NOT_FOUND
REPORT_NOT_FOUND
REAGENT_NOT_FOUND
REAGENT_LOT_NOT_FOUND
INVALID_STATUS_TRANSITION
LOT_EXPIRED
LOT_BLOCKED
INSUFFICIENT_STOCK
REPORT_NOT_READY
```

---

## Validierungsdetails Format

Bei Feldfehlern:

```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "firstName",
        "message": "firstName is required"
      },
      {
        "field": "birthDate",
        "message": "birthDate must be a valid date"
      }
    ]
  }
}
```

---

## Frontend Type Imports

Das Frontend soll diese Imports verwenden:

```ts
import type { PatientDto, RegisterPatientDto } from '@mlms/contracts/patient';
import type { OrderDto, CreateOrderDto } from '@mlms/contracts/order';
import type { ReportDto } from '@mlms/contracts/report';
import type { ApiSuccessResponse } from '@mlms/contracts/common';
```

---

## Backend DTO Mapping Regeln

### Controller Input
HTTP Request DTO kann direkt auf Contract DTO gemappt werden.

### Use Case Input
Use Case soll möglichst dieselben Feldnamen verwenden.

### Presenter Output
Response muss exakt Contract-kompatibel sein.

---

## Dateinamen in contracts Package

Regeln:
- alles klein mit Bindestrich
- DTO Datei endet auf `.dto.ts`
- Index pro Modul vorhanden

Beispiele:
```text
register-patient.dto.ts
update-order-status.dto.ts
patient-portal-report.dto.ts
```

---

## index.ts Export Struktur

## src/index.ts

```ts
export * from './common/api-response';
export * from './common/error-response';
export * from './common/pagination';
export * from './common/enums';

export * from './auth';
export * from './patient';
export * from './order';
export * from './specimen';
export * from './result';
export * from './report';
export * from './reagent';
export * from './portal';
export * from './audit';
```

## Beispiel patient/index.ts

```ts
export * from './register-patient.dto';
export * from './update-patient.dto';
export * from './patient.dto';
export * from './patient-search.dto';
```

---

## MVP Pflicht-Contracts

Diese Contracts müssen zuerst implementiert werden:

### Phase 1
- LoginDto
- LoginResponseDto
- CurrentUserDto
- RegisterPatientDto
- UpdatePatientDto
- PatientDto

### Phase 2
- CreateOrderDto
- OrderDto
- TestOrderDto
- CreateSpecimenDto
- SpecimenDto

### Phase 3
- RecordResultDto
- ResultDto
- GenerateReportDto
- ValidateReportDto
- ReportDto

### Phase 4
- CreateReagentDto
- ReceiveReagentLotDto
- ReagentDto
- ReagentLotDto

### Phase 5
- PatientPortalReportDto

---

## OpenAPI Mapping Regeln

Wenn OpenAPI erzeugt wird:

- Schema Namen in PascalCase
- Feldnamen in camelCase
- Arrays korrekt typisieren
- Examples für Requests und Responses hinzufügen
- alle Error Responses dokumentieren
- Security Scheme für Bearer JWT definieren

---

## Beispiel OpenAPI Namensschema

```text
schemas:
  LoginDto
  LoginResponseDto
  PatientDto
  RegisterPatientDto
  CreateOrderDto
  ResultDto
  ReportDto
```

---

## Definition of Done

Dieses Dokument ist korrekt umgesetzt, wenn:

- alle DTOs als TypeScript Interfaces existieren
- Backend und Frontend dieselben Feldnamen verwenden
- Response-Envelope einheitlich ist
- Fehlerformat einheitlich ist
- Pagination konsistent ist
- Endpunkte mit diesem Vertrag kompatibel sind
- OpenAPI daraus erzeugt werden kann

---

## Claude Code Prompt für dieses Contracts-File

```text
LIES DIESES KOMPLETTE DOKUMENT 05-API-CONTRACTS.md.

Erstelle das Package `contracts/` exakt nach dieser Struktur.

WICHTIGE REGELN:
1. Erzeuge alle Dateien unter `contracts/src/`.
2. Nutze exakt dieselben Feldnamen.
3. Implementiere zuerst die MVP Pflicht-Contracts.
4. Exportiere alle DTOs sauber über index.ts Dateien.
5. Nutze nur TypeScript Interfaces und Typen.
6. Keine Business-Logik in diesem Package.
7. Stelle sicher, dass Backend und Frontend dieses Package importieren können.

Liefere:
- package.json
- tsconfig.json
- src/index.ts
- common/*
- auth/*
- patient/*
- order/*
- specimen/*
- result/*
- report/*
- reagent/*
- portal/*
- audit/*
```

---
