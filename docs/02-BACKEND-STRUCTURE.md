# 02-BACKEND-STRUCTURE.md

# Backend Structure – MLMS

## Ziel

Dieses Dokument definiert die **exakte Backend-Struktur** für das MLMS.

Das Backend wird mit folgenden Prinzipien aufgebaut:

- Node.js + NestJS
- Clean Architecture
- Domain-first
- Modularer Aufbau
- Prisma + PostgreSQL
- JWT + RBAC
- Mehrsprachigkeit FR/AR
- Auditierbarkeit für medizinische Prozesse

---

## Technologie-Stack

- Runtime: Node.js 20
- Framework: NestJS
- Sprache: TypeScript
- Datenbank: PostgreSQL 16
- ORM: Prisma
- Auth: JWT
- Validation: class-validator + class-transformer
- Hashing: bcrypt
- Config: @nestjs/config
- Logging: Nest Logger
- Tests: Jest + Supertest

---

## Hauptprinzipien

### 1. Domain zuerst
Die Fachlogik liegt immer in `domain/`.

### 2. Use Cases in application
Geschäftsabläufe wie `RegisterPatient` oder `CreateOrder` liegen in `application/`.

### 3. Infrastruktur austauschbar
Prisma, JWT, externe Services und Messaging liegen in `infrastructure/`.

### 4. HTTP ist nur ein Interface
Controller dürfen keine Fachlogik enthalten.

### 5. Klare Modulgrenzen
Jede Domäne bekommt eigene Dateien, DTOs, Use Cases und Repositories.

---

## Exakte Projektstruktur

```text
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── config/
│   │   ├── app.config.ts
│   │   ├── auth.config.ts
│   │   ├── database.config.ts
│   │   ├── i18n.config.ts
│   │   └── validation.config.ts
│   │
│   ├── domain/
│   │   ├── common/
│   │   │   ├── base/
│   │   │   │   ├── AggregateRoot.ts
│   │   │   │   ├── Entity.ts
│   │   │   │   └── ValueObject.ts
│   │   │   ├── exceptions/
│   │   │   │   ├── DomainException.ts
│   │   │   │   ├── ValidationException.ts
│   │   │   │   ├── NotFoundException.ts
│   │   │   │   └── UnauthorizedDomainException.ts
│   │   │   ├── types/
│   │   │   │   ├── Language.ts
│   │   │   │   ├── UserRole.ts
│   │   │   │   ├── Gender.ts
│   │   │   │   ├── OrderPriority.ts
│   │   │   │   ├── OrderStatus.ts
│   │   │   │   ├── SpecimenStatus.ts
│   │   │   │   ├── SpecimenType.ts
│   │   │   │   ├── ResultFlag.ts
│   │   │   │   ├── ReportStatus.ts
│   │   │   │   └── ReagentCategory.ts
│   │   │   └── events/
│   │   │       ├── DomainEvent.ts
│   │   │       ├── PatientRegisteredEvent.ts
│   │   │       ├── OrderCreatedEvent.ts
│   │   │       ├── ReportValidatedEvent.ts
│   │   │       └── ReagentLowStockEvent.ts
│   │   │
│   │   ├── user/
│   │   │   ├── entities/
│   │   │   │   └── User.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── UserId.ts
│   │   │   │   ├── Email.ts
│   │   │   │   └── PasswordHash.ts
│   │   │   └── repositories/
│   │   │       └── IUserRepository.ts
│   │   │
│   │   ├── patient/
│   │   │   ├── entities/
│   │   │   │   └── Patient.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── PatientId.ts
│   │   │   │   ├── PhoneNumber.ts
│   │   │   │   └── Address.ts
│   │   │   ├── services/
│   │   │   │   └── PatientDomainService.ts
│   │   │   └── repositories/
│   │   │       └── IPatientRepository.ts
│   │   │
│   │   ├── order/
│   │   │   ├── entities/
│   │   │   │   ├── Order.ts
│   │   │   │   └── TestOrder.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── OrderId.ts
│   │   │   │   └── TestDefinitionId.ts
│   │   │   ├── services/
│   │   │   │   └── OrderDomainService.ts
│   │   │   └── repositories/
│   │   │       ├── IOrderRepository.ts
│   │   │       └── ITestCatalogRepository.ts
│   │   │
│   │   ├── specimen/
│   │   │   ├── entities/
│   │   │   │   └── Specimen.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── SpecimenId.ts
│   │   │   │   └── Barcode.ts
│   │   │   └── repositories/
│   │   │       └── ISpecimenRepository.ts
│   │   │
│   │   ├── result/
│   │   │   ├── entities/
│   │   │   │   └── Result.ts
│   │   │   ├── value-objects/
│   │   │   │   └── ResultId.ts
│   │   │   └── repositories/
│   │   │       └── IResultRepository.ts
│   │   │
│   │   ├── report/
│   │   │   ├── entities/
│   │   │   │   └── Report.ts
│   │   │   ├── value-objects/
│   │   │   │   └── ReportId.ts
│   │   │   ├── services/
│   │   │   │   └── ReportBuilderService.ts
│   │   │   └── repositories/
│   │   │       └── IReportRepository.ts
│   │   │
│   │   ├── reagent/
│   │   │   ├── entities/
│   │   │   │   ├── Reagent.ts
│   │   │   │   └── ReagentLot.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── ReagentId.ts
│   │   │   │   ├── ReagentLotId.ts
│   │   │   │   └── LotNumber.ts
│   │   │   ├── services/
│   │   │   │   └── ReagentStockService.ts
│   │   │   └── repositories/
│   │   │       ├── IReagentRepository.ts
│   │   │       └── IReagentLotRepository.ts
│   │   │
│   │   └── inventory/
│   │       ├── entities/
│   │       │   └── StorageLocation.ts
│   │       └── repositories/
│   │           └── IStorageLocationRepository.ts
│   │
│   ├── application/
│   │   ├── common/
│   │   │   ├── dto/
│   │   │   │   ├── PaginationDto.ts
│   │   │   │   └── PaginatedResponseDto.ts
│   │   │   ├── interfaces/
│   │   │   │   ├── IPasswordHasher.ts
│   │   │   │   ├── ITokenService.ts
│   │   │   │   ├── IClock.ts
│   │   │   │   └── IEventBus.ts
│   │   │   └── services/
│   │   │       └── AuditService.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   │   ├── LoginDto.ts
│   │   │   │   ├── LoginResponseDto.ts
│   │   │   │   ├── RegisterUserDto.ts
│   │   │   │   └── MeDto.ts
│   │   │   └── use-cases/
│   │   │       ├── Login.ts
│   │   │       ├── RegisterUser.ts
│   │   │       └── GetCurrentUser.ts
│   │   │
│   │   ├── patient/
│   │   │   ├── dto/
│   │   │   │   ├── RegisterPatientDto.ts
│   │   │   │   ├── UpdatePatientDto.ts
│   │   │   │   ├── PatientDto.ts
│   │   │   │   └── PatientSearchDto.ts
│   │   │   └── use-cases/
│   │   │       ├── RegisterPatient.ts
│   │   │       ├── UpdatePatient.ts
│   │   │       ├── GetPatientById.ts
│   │   │       ├── ListPatients.ts
│   │   │       └── SearchPatients.ts
│   │   │
│   │   ├── order/
│   │   │   ├── dto/
│   │   │   │   ├── CreateOrderDto.ts
│   │   │   │   ├── OrderDto.ts
│   │   │   │   └── ListOrdersQueryDto.ts
│   │   │   └── use-cases/
│   │   │       ├── CreateOrder.ts
│   │   │       ├── GetOrderById.ts
│   │   │       ├── ListOrders.ts
│   │   │       ├── UpdateOrderStatus.ts
│   │   │       └── CancelOrder.ts
│   │   │
│   │   ├── specimen/
│   │   │   ├── dto/
│   │   │   │   ├── CreateSpecimenDto.ts
│   │   │   │   ├── SpecimenDto.ts
│   │   │   │   └── UpdateSpecimenStatusDto.ts
│   │   │   └── use-cases/
│   │   │       ├── CreateSpecimen.ts
│   │   │       ├── GetSpecimenById.ts
│   │   │       └── UpdateSpecimenStatus.ts
│   │   │
│   │   ├── result/
│   │   │   ├── dto/
│   │   │   │   ├── RecordResultDto.ts
│   │   │   │   ├── UpdateResultDto.ts
│   │   │   │   └── ResultDto.ts
│   │   │   └── use-cases/
│   │   │       ├── RecordResult.ts
│   │   │       ├── UpdateResult.ts
│   │   │       ├── ListResultsBySpecimen.ts
│   │   │       └── ListResultsByOrder.ts
│   │   │
│   │   ├── report/
│   │   │   ├── dto/
│   │   │   │   ├── GenerateReportDto.ts
│   │   │   │   ├── ValidateReportDto.ts
│   │   │   │   ├── SignReportDto.ts
│   │   │   │   ├── PublishReportDto.ts
│   │   │   │   └── ReportDto.ts
│   │   │   └── use-cases/
│   │   │       ├── GenerateReport.ts
│   │   │       ├── ValidateReport.ts
│   │   │       ├── SignReport.ts
│   │   │       ├── PublishReport.ts
│   │   │       ├── GetReportById.ts
│   │   │       └── ListReports.ts
│   │   │
│   │   ├── reagent/
│   │   │   ├── dto/
│   │   │   │   ├── CreateReagentDto.ts
│   │   │   │   ├── ReceiveReagentLotDto.ts
│   │   │   │   ├── ConsumeReagentDto.ts
│   │   │   │   ├── ReagentDto.ts
│   │   │   │   └── ReagentLotDto.ts
│   │   │   └── use-cases/
│   │   │       ├── CreateReagent.ts
│   │   │       ├── ReceiveReagentLot.ts
│   │   │       ├── ConsumeReagentForTest.ts
│   │   │       ├── ListReagents.ts
│   │   │       └── ListReagentLots.ts
│   │   │
│   │   └── portal/
│   │       ├── dto/
│   │       │   ├── PatientPortalReportDto.ts
│   │       │   └── PatientPortalProfileDto.ts
│   │       └── use-cases/
│   │           ├── GetPatientPortalReports.ts
│   │           └── GetPatientPortalReportById.ts
│   │
│   ├── infrastructure/
│   │   ├── persistence/
│   │   │   ├── prisma/
│   │   │   │   ├── prisma.service.ts
│   │   │   │   ├── prisma.module.ts
│   │   │   │   └── schema.prisma
│   │   │   └── repositories/
│   │   │       ├── UserPrismaRepository.ts
│   │   │       ├── PatientPrismaRepository.ts
│   │   │       ├── OrderPrismaRepository.ts
│   │   │       ├── SpecimenPrismaRepository.ts
│   │   │       ├── ResultPrismaRepository.ts
│   │   │       ├── ReportPrismaRepository.ts
│   │   │       ├── ReagentPrismaRepository.ts
│   │   │       ├── ReagentLotPrismaRepository.ts
│   │   │       └── StorageLocationPrismaRepository.ts
│   │   │
│   │   ├── security/
│   │   │   ├── jwt/
│   │   │   │   ├── JwtTokenService.ts
│   │   │   │   └── JwtPayload.ts
│   │   │   ├── hashing/
│   │   │   │   └── BcryptPasswordHasher.ts
│   │   │   └── guards/
│   │   │       └── RolesGuard.ts
│   │   │
│   │   ├── time/
│   │   │   └── SystemClock.ts
│   │   │
│   │   ├── events/
│   │   │   └── InMemoryEventBus.ts
│   │   │
│   │   ├── logging/
│   │   │   └── AppLogger.ts
│   │   │
│   │   ├── integrations/
│   │   │   ├── hl7/
│   │   │   │   └── Hl7Client.ts
│   │   │   ├── fhir/
│   │   │   │   └── FhirClient.ts
│   │   │   └── pdf/
│   │   │       └── ReportPdfGenerator.ts
│   │   │
│   │   └── seed/
│   │       └── seed.ts
│   │
│   ├── interfaces/
│   │   ├── http/
│   │   │   ├── controllers/
│   │   │   │   ├── AuthController.ts
│   │   │   │   ├── PatientController.ts
│   │   │   │   ├── OrderController.ts
│   │   │   │   ├── SpecimenController.ts
│   │   │   │   ├── ResultController.ts
│   │   │   │   ├── ReportController.ts
│   │   │   │   ├── ReagentController.ts
│   │   │   │   └── PatientPortalController.ts
│   │   │   ├── decorators/
│   │   │   │   ├── CurrentUser.ts
│   │   │   │   ├── CurrentLanguage.ts
│   │   │   │   └── Roles.ts
│   │   │   ├── dto/
│   │   │   │   ├── LoginRequest.ts
│   │   │   │   ├── RegisterPatientRequest.ts
│   │   │   │   ├── UpdatePatientRequest.ts
│   │   │   │   ├── CreateOrderRequest.ts
│   │   │   │   ├── CreateSpecimenRequest.ts
│   │   │   │   ├── RecordResultRequest.ts
│   │   │   │   ├── ValidateReportRequest.ts
│   │   │   │   ├── SignReportRequest.ts
│   │   │   │   ├── PublishReportRequest.ts
│   │   │   │   ├── CreateReagentRequest.ts
│   │   │   │   └── ReceiveReagentLotRequest.ts
│   │   │   ├── filters/
│   │   │   │   └── GlobalHttpExceptionFilter.ts
│   │   │   ├── guards/
│   │   │   │   ├── JwtAuthGuard.ts
│   │   │   │   └── RolesHttpGuard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── ResponseTransformInterceptor.ts
│   │   │   │   └── AuditInterceptor.ts
│   │   │   ├── middleware/
│   │   │   │   ├── RequestIdMiddleware.ts
│   │   │   │   ├── LanguageMiddleware.ts
│   │   │   │   └── LoggerMiddleware.ts
│   │   │   └── presenters/
│   │   │       ├── PatientPresenter.ts
│   │   │       ├── OrderPresenter.ts
│   │   │       ├── ReportPresenter.ts
│   │   │       └── ReagentPresenter.ts
│   │   │
│   │   └── cli/
│   │       └── commands/
│   │           └── SeedCommand.ts
│   │
│   └── modules/
│       ├── auth.module.ts
│       ├── patient.module.ts
│       ├── order.module.ts
│       ├── specimen.module.ts
│       ├── result.module.ts
│       ├── report.module.ts
│       ├── reagent.module.ts
│       ├── portal.module.ts
│       ├── persistence.module.ts
│       └── shared.module.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── test/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env
├── .env.example
├── nest-cli.json
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── Dockerfile
└── README.md
```

---

## Verantwortlichkeiten pro Layer

## domain/
Enthält nur Fachlogik.

Darf **nicht** enthalten:
- NestJS Decorators
- Prisma Code
- HTTP Code
- DTO Validation Decorators

Enthält:
- Entities
- Value Objects
- Domain Services
- Repository Interfaces
- Enums
- Domain Events

---

## application/
Enthält Use Cases.

Beispiele:
- Patient registrieren
- Order anlegen
- Result erfassen
- Report validieren
- Reagenzbestand abbuchen

Enthält:
- Use Cases
- Application DTOs
- Interfaces für technische Services

---

## infrastructure/
Enthält technische Implementierungen.

Beispiele:
- Prisma Repository
- JWT Service
- Password Hashing
- PDF Generator
- HL7/FHIR Adapter

---

## interfaces/
Enthält Ein- und Ausgänge.

Beispiele:
- HTTP Controller
- Request DTOs
- Middleware
- Guards
- Filter
- Presenter

---

## modules/
Hier werden NestJS Module zusammengesetzt.

Jedes Modul verbindet:
- Controller
- Use Cases
- Repositories
- technische Services

---

## Root Dateien

### main.ts
Startet die NestJS App.

Pflichten:
- ValidationPipe global aktivieren
- CORS aktivieren
- Prefix `/api` setzen
- Global Filter und Interceptors registrieren

### app.module.ts
Importiert alle Module.

---

## Empfohlene Module

```text
AppModule
├── SharedModule
├── PersistenceModule
├── AuthModule
├── PatientModule
├── OrderModule
├── SpecimenModule
├── ResultModule
├── ReportModule
├── ReagentModule
└── PortalModule
```

---

## Modulinhalt – Standardregel

Jedes fachliche Modul folgt derselben Struktur:

```text
<feature>/
├── domain/
├── application/
├── infrastructure/
└── interfaces/
```

Da wir hier projektweit mit globalen Layern arbeiten, wird diese Logik über die Top-Level-Struktur verteilt.

---

## Backend Konventionen

### Dateinamen
- Klassen: PascalCase
- DTOs: `SomethingDto.ts`
- Use Cases: Verb + Entity, z. B. `RegisterPatient.ts`
- Repository Interfaces: `IEntityRepository.ts`

### Klassennamen
- `RegisterPatient`
- `CreateOrder`
- `ValidateReport`
- `PatientPrismaRepository`

### Methoden
- `execute(...)` für Use Cases
- `findById(...)`, `save(...)`, `list(...)` für Repositories

---

## Import-Regeln

### domain darf importieren
- nur andere domain-Dateien

### application darf importieren
- domain
- application/common

### infrastructure darf importieren
- domain
- application

### interfaces darf importieren
- application
- domain/common types wenn nötig

### Verboten
- domain importiert niemals infrastructure
- domain importiert niemals interfaces
- application importiert niemals HTTP Controller

---

## Rollenmodell

```text
RECEPTION
- Patienten anlegen
- Patienten bearbeiten
- Orders anlegen
- Orders ansehen

TECHNICIAN
- Specimens anlegen
- Specimen Status ändern
- Results erfassen
- Results ändern

PHYSICIAN
- Reports erzeugen
- Reports validieren
- Reports signieren
- Reports veröffentlichen

ADMIN
- Benutzer verwalten
- Rollen verwalten
- Reagenzien verwalten
- Lots verwalten
- Systemkonfiguration
```

---

## Sprachmodell

Unterstützte Sprachen:

```text
FR
AR
```

Regeln:
- Jeder User hat eine bevorzugte Sprache
- Fallback ist `FR`
- Sprache wird über Middleware ermittelt
- Sprache soll in `request.language` verfügbar sein

---

## Statusmodelle

### OrderStatus
```text
PENDING
COLLECTED
ANALYZED
VALIDATED
PUBLISHED
CANCELLED
```

### SpecimenStatus
```text
COLLECTED
RECEIVED
PROCESSED
DISPOSED
REJECTED
```

### ResultFlag
```text
N
H
L
HH
LL
CRITICAL
```

### ReportStatus
```text
DRAFT
VALIDATED
FINAL
CORRECTED
PUBLISHED
```

---

## Zentrale Domain Objekte

## User
Minimale Felder:
- id
- email
- passwordHash
- role
- language
- isActive
- createdAt

## Patient
Minimale Felder:
- id
- firstName
- lastName
- birthDate
- gender
- phone
- email
- address
- createdAt
- updatedAt

## Order
Minimale Felder:
- id
- patientId
- status
- priority
- tests
- createdBy
- createdAt

## Specimen
Minimale Felder:
- id
- orderId
- barcode
- type
- status
- collectionTime
- receivedAt

## Result
Minimale Felder:
- id
- specimenId
- testDefinitionId
- value
- unit
- referenceLow
- referenceHigh
- flag
- measuredAt
- measuredBy

## Report
Minimale Felder:
- id
- orderId
- status
- comments
- validatedBy
- validatedAt
- signedBy
- signedAt
- publishedAt

## Reagent
Minimale Felder:
- id
- name
- manufacturer
- catalogNumber
- category
- storageTemp

## ReagentLot
Minimale Felder:
- id
- reagentId
- lotNumber
- expiryDate
- initialQuantity
- currentQuantity
- isBlocked
- storageLocation

---

## Use Case Reihenfolge für Implementierung

### Phase 1
- RegisterUser
- Login
- GetCurrentUser
- RegisterPatient
- UpdatePatient
- GetPatientById
- ListPatients

### Phase 2
- CreateOrder
- GetOrderById
- ListOrders
- UpdateOrderStatus

### Phase 3
- CreateSpecimen
- UpdateSpecimenStatus
- RecordResult
- UpdateResult

### Phase 4
- GenerateReport
- ValidateReport
- SignReport
- PublishReport

### Phase 5
- CreateReagent
- ReceiveReagentLot
- ConsumeReagentForTest
- ListReagents

### Phase 6
- GetPatientPortalReports
- GetPatientPortalReportById

---

## Minimaler API Bereich

```text
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me

POST   /api/patients
GET    /api/patients
GET    /api/patients/:id
PATCH  /api/patients/:id

POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
PATCH  /api/orders/:id/status

POST   /api/specimens
GET    /api/specimens/:id
PATCH  /api/specimens/:id/status

POST   /api/results
PATCH  /api/results/:id
GET    /api/orders/:id/results

POST   /api/reports/generate
POST   /api/reports/:id/validate
POST   /api/reports/:id/sign
POST   /api/reports/:id/publish
GET    /api/reports/:id

POST   /api/reagents
GET    /api/reagents
POST   /api/reagents/lots
GET    /api/reagents/:id/lots
POST   /api/reagents/consume

GET    /api/portal/reports
GET    /api/portal/reports/:id
```

---

## .env Beispiel

```env
NODE_ENV=development
PORT=3000
API_PREFIX=api

DATABASE_URL=postgresql://mlms:secret@localhost:5432/mlms

JWT_SECRET=super_secret_change_me
JWT_EXPIRES_IN=1d

DEFAULT_LANGUAGE=FR
BCRYPT_ROUNDS=10
```

---

## package.json – empfohlte Dependencies

```json
{
  "name": "mlms-backend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "build": "nest build",
    "test": "jest",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "seed": "ts-node prisma/seed.ts"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "@prisma/client": "^5.0.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "bcrypt": "^5.1.1",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/bcrypt": "^5.0.2",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.0",
    "@types/node": "^20.0.0",
    "@types/passport-jwt": "^4.0.1",
    "jest": "^29.7.0",
    "prisma": "^5.0.0",
    "supertest": "^7.0.0",
    "ts-jest": "^29.1.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.4.0"
  }
}
```

---

## Prisma Schema – Startversion

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  RECEPTION
  TECHNICIAN
  PHYSICIAN
  ADMIN
}

enum Language {
  FR
  AR
}

enum Gender {
  M
  F
  O
}

enum OrderPriority {
  ROUTINE
  URGENT
  STAT
}

enum OrderStatus {
  PENDING
  COLLECTED
  ANALYZED
  VALIDATED
  PUBLISHED
  CANCELLED
}

enum SpecimenType {
  BLOOD
  URINE
  STOOL
  TISSUE
}

enum SpecimenStatus {
  COLLECTED
  RECEIVED
  PROCESSED
  DISPOSED
  REJECTED
}

enum ResultFlag {
  N
  H
  L
  HH
  LL
  CRITICAL
}

enum ReportStatus {
  DRAFT
  VALIDATED
  FINAL
  CORRECTED
  PUBLISHED
}

enum ReagentCategory {
  CHEMISTRY
  HEMATOLOGY
  IMMUNOLOGY
  MICROBIOLOGY
}

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  role         UserRole
  language     Language  @default(FR)
  isActive     Boolean   @default(true)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Patient {
  id         String    @id @default(cuid())
  firstName  String
  lastName   String
  birthDate  DateTime
  gender     Gender
  phone      String?
  email      String?
  address    String?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  orders     Order[]
}

model Order {
  id         String        @id @default(cuid())
  patientId  String
  status     OrderStatus   @default(PENDING)
  priority   OrderPriority
  createdBy  String?
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt

  patient    Patient       @relation(fields: [patientId], references: [id])
  specimens  Specimen[]
  reports    Report[]
}

model Specimen {
  id             String         @id @default(cuid())
  orderId        String
  barcode        String         @unique
  type           SpecimenType
  status         SpecimenStatus @default(COLLECTED)
  collectionTime DateTime
  receivedAt     DateTime?
  notes          String?
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  order          Order          @relation(fields: [orderId], references: [id])
  results        Result[]
}

model Result {
  id              String      @id @default(cuid())
  specimenId      String
  testCode        String
  value           String
  unit            String?
  referenceLow    Float?
  referenceHigh   Float?
  flag            ResultFlag  @default(N)
  measuredAt      DateTime
  measuredBy      String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  specimen        Specimen    @relation(fields: [specimenId], references: [id])
}

model Report {
  id            String       @id @default(cuid())
  orderId        String
  status         ReportStatus @default(DRAFT)
  comments       String?
  validatedBy    String?
  validatedAt    DateTime?
  signedBy       String?
  signedAt       DateTime?
  publishedAt    DateTime?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  order          Order        @relation(fields: [orderId], references: [id])
}

model Reagent {
  id             String          @id @default(cuid())
  name           String
  manufacturer   String
  catalogNumber  String?
  category       ReagentCategory
  storageTemp    String?
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  lots           ReagentLot[]
}

model ReagentLot {
  id               String    @id @default(cuid())
  reagentId        String
  lotNumber        String
  expiryDate       DateTime
  initialQuantity  Float
  currentQuantity  Float
  isBlocked        Boolean   @default(false)
  storageLocation  String?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  reagent          Reagent   @relation(fields: [reagentId], references: [id])

  @@unique([reagentId, lotNumber])
}
```

---

## NestJS Module Mapping

### auth.module.ts
Stellt bereit:
- Login Use Case
- RegisterUser Use Case
- JWT Service
- Password Hasher
- AuthController

### patient.module.ts
Stellt bereit:
- RegisterPatient
- UpdatePatient
- GetPatientById
- ListPatients
- PatientController
- Patient Repository Binding

### order.module.ts
Stellt bereit:
- CreateOrder
- ListOrders
- UpdateOrderStatus
- OrderController

### specimen.module.ts
Stellt bereit:
- CreateSpecimen
- UpdateSpecimenStatus
- SpecimenController

### result.module.ts
Stellt bereit:
- RecordResult
- UpdateResult
- ResultController

### report.module.ts
Stellt bereit:
- GenerateReport
- ValidateReport
- SignReport
- PublishReport
- ReportController

### reagent.module.ts
Stellt bereit:
- CreateReagent
- ReceiveReagentLot
- ConsumeReagentForTest
- ReagentController

### portal.module.ts
Stellt bereit:
- GetPatientPortalReports
- GetPatientPortalReportById
- PatientPortalController

---

## Standardablauf eines Requests

Beispiel `POST /api/patients`

1. HTTP Request kommt im `PatientController` an
2. Request DTO validiert Input
3. Controller ruft `RegisterPatient.execute(...)` auf
4. Use Case erstellt `Patient` Domain Entity
5. Use Case ruft `IPatientRepository.save(...)`
6. `PatientPrismaRepository` speichert in PostgreSQL
7. Presenter formatiert Response
8. HTTP Response wird zurückgegeben

---

## Was Controller NICHT tun dürfen

- Keine Business Rules
- Kein direkter Prisma Zugriff
- Keine JWT Erstellung direkt im Controller
- Keine komplexe Transformationslogik
- Keine SQL Queries

---

## Was Use Cases tun dürfen

- Domain Regeln anwenden
- Repository Interfaces verwenden
- Events publishen
- Audit-Einträge erzeugen
- Berechtigungen prüfen, wenn fachlich nötig

---

## Was Repositories tun dürfen

- Daten lesen
- Daten schreiben
- Mapping Domain <-> Prisma

Repositories dürfen **keine** Geschäftslogik enthalten.

---

## Fehlerbehandlung

### Typen von Fehlern
- Validation Fehler
- Not Found Fehler
- Unauthorized Fehler
- Conflict Fehler
- Domain Fehler

### Regeln
- Domain Fehler entstehen in `domain/common/exceptions`
- HTTP Mapping geschieht im globalen Filter
- Keine nackten `throw new Error(...)` in Use Cases

---

## Logging & Audit

### Logging
Pflicht für:
- Login
- Report Validation
- Report Sign
- Report Publish
- Reagent Consumption
- kritische Fehler

### Audit
Pflicht für:
- Änderungen an Results
- Änderungen an Reports
- Report Freigaben
- Benutzerrollenänderungen

---

## Teststruktur

```text
test/
├── unit/
│   ├── application/
│   └── domain/
├── integration/
│   ├── repositories/
│   └── modules/
└── e2e/
    ├── auth.e2e-spec.ts
    ├── patient.e2e-spec.ts
    ├── order.e2e-spec.ts
    └── report.e2e-spec.ts
```

---

## Erste Implementierungsreihenfolge

### Sprint 1
- main.ts
- app.module.ts
- config/*
- prisma setup
- auth.module.ts
- patient.module.ts

### Sprint 2
- order.module.ts
- specimen.module.ts

### Sprint 3
- result.module.ts
- report.module.ts

### Sprint 4
- reagent.module.ts
- portal.module.ts

---

## Pflichtdateien für Sprint 1

```text
src/main.ts
src/app.module.ts

src/config/app.config.ts
src/config/auth.config.ts
src/config/database.config.ts

src/domain/common/types/UserRole.ts
src/domain/common/types/Language.ts
src/domain/common/types/Gender.ts

src/domain/user/entities/User.ts
src/domain/user/repositories/IUserRepository.ts

src/domain/patient/entities/Patient.ts
src/domain/patient/repositories/IPatientRepository.ts

src/application/auth/dto/LoginDto.ts
src/application/auth/dto/LoginResponseDto.ts
src/application/auth/use-cases/Login.ts

src/application/patient/dto/RegisterPatientDto.ts
src/application/patient/dto/PatientDto.ts
src/application/patient/use-cases/RegisterPatient.ts
src/application/patient/use-cases/GetPatientById.ts
src/application/patient/use-cases/ListPatients.ts

src/infrastructure/persistence/prisma/prisma.module.ts
src/infrastructure/persistence/prisma/prisma.service.ts
src/infrastructure/persistence/repositories/UserPrismaRepository.ts
src/infrastructure/persistence/repositories/PatientPrismaRepository.ts

src/infrastructure/security/jwt/JwtTokenService.ts
src/infrastructure/security/hashing/BcryptPasswordHasher.ts

src/interfaces/http/controllers/AuthController.ts
src/interfaces/http/controllers/PatientController.ts
src/interfaces/http/guards/JwtAuthGuard.ts
src/interfaces/http/filters/GlobalHttpExceptionFilter.ts
src/interfaces/http/middleware/LanguageMiddleware.ts

src/modules/auth.module.ts
src/modules/patient.module.ts
src/modules/shared.module.ts
src/modules/persistence.module.ts
```

---

## Claude Code Prompt für dieses Backend-File

```text
LIES DIESES KOMPLETTE DOKUMENT 02-BACKEND-STRUCTURE.md.

Erstelle das gesamte Backend exakt nach dieser Struktur.

WICHTIGE REGELN:
1. Keine Abweichung bei Ordnernamen.
2. Keine Business-Logik in Controller.
3. Domain bleibt framework-unabhängig.
4. Nutze Prisma für Persistence.
5. Nutze JWT + RBAC.
6. Implementiere zuerst Sprint 1 vollständig.
7. Erzeuge alle Pflichtdateien aus dem Abschnitt "Pflichtdateien für Sprint 1".
8. Füge lauffähige NestJS Module hinzu.
9. Stelle sicher, dass `npm run start:dev` funktioniert.
10. Verwende TypeScript strict mode.

Liefere:
- package.json
- tsconfig.json
- nest-cli.json
- Prisma schema
- alle Dateien für Sprint 1
- minimal lauffähige API
```

---

## Definition of Done für dieses File

Dieses Dokument ist korrekt umgesetzt, wenn:

- das Projekt bootet
- Prisma verbunden ist
- Auth Modul kompiliert
- Patient Modul kompiliert
- `/api/patients` erreichbar ist
- `/api/auth/login` erreichbar ist
- Rollenmodell vorhanden ist
- Sprachmiddleware vorhanden ist
- keine Fachlogik in Controller liegt

---
