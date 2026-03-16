# 12-OPENAPI.md

# OpenAPI Specification – MLMS

## Ziel

Dieses Dokument definiert die OpenAPI-Strategie für das MLMS.

Es ist die verbindliche Grundlage für:

- Swagger / OpenAPI Dokumentation
- Backend API Beschreibung
- Frontend Integration
- DTO Mapping
- Security Dokumentation
- Fehlerformate
- Examples
- spätere Client-Generierung

Die OpenAPI-Dokumentation muss konsistent sein mit:

- `04-DOMAIN-MODEL.md`
- `05-API-CONTRACTS.md`
- `11-PRISMA-SCHEMA.md`

---

## Grundprinzipien

### 1. Design-first
Die OpenAPI-Spezifikation beschreibt die API klar und stabil, bevor oder parallel zur Implementierung.

### 2. Contracts zuerst
Alle Schemas in OpenAPI müssen denselben Feldnamen folgen wie die DTOs in `contracts/`.

### 3. Wiederverwendbare Komponenten
Schemas, Responses, Parameters und Security-Schemes werden zentral unter `components/` definiert.

### 4. Dokumentierte Errors
Fehlerformate müssen explizit dokumentiert werden.

### 5. JWT Bearer Security
Geschützte Endpunkte nutzen Bearer Authentication.

### 6. Beispiele sind Pflicht
Wichtige Requests und Responses erhalten konkrete Examples.

---

## Ziel-Dateien

Für das Backend werden mindestens diese Dateien empfohlen:

```text
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   └── ...
├── openapi/
│   ├── mlms.openapi.yaml
│   └── examples/
│       ├── auth-login.request.json
│       ├── auth-login.response.json
│       ├── patient-create.request.json
│       ├── patient-create.response.json
│       └── ...
```

Optional kann die OpenAPI-Spec auch automatisch aus NestJS Decorators erzeugt werden.
Für das MVP wird dennoch eine klar definierte Struktur empfohlen, selbst wenn Swagger parallel aus Code generiert wird.

---

## OpenAPI Version

```yaml
openapi: 3.0.3
```

---

## Basis-Metadaten

```yaml
info:
  title: MLMS API
  version: 1.0.0
  description: Medical Laboratory Management System API
```

---

## Servers

```yaml
servers:
  - url: http://localhost:3000/api
    description: Local development server
```

---

## Tags

Empfohlene Tags:

```yaml
tags:
  - name: Auth
  - name: Patients
  - name: Orders
  - name: Specimens
  - name: Results
  - name: Reports
  - name: Reagents
  - name: Portal
  - name: Audit
```

---

## Security

### Globale Security Definition

```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - bearerAuth: []
```

### Regeln
- öffentliche Endpunkte können Security überschreiben
- z. B. Login kann `security: []` verwenden

---

## Standard Content Types

```yaml
application/json
```

---

## Namensregeln

### Schema-Namen
PascalCase:
- `LoginDto`
- `PatientDto`
- `CreateOrderRequestDto`

### Feldnamen
camelCase:
- `firstName`
- `birthDate`
- `createdAt`

### Pfade
pluralisierte Ressourcen:
- `/patients`
- `/orders`
- `/reports`

---

## Standard Error Model

```yaml
ApiFieldError:
  type: object
  required:
    - field
    - message
  properties:
    field:
      type: string
    message:
      type: string

ApiError:
  type: object
  required:
    - code
    - message
  properties:
    code:
      type: string
      example: VALIDATION_ERROR
    message:
      type: string
      example: Validation failed
    details:
      type: array
      items:
        $ref: '#/components/schemas/ApiFieldError'
```

---

## Standard Response Models

```yaml
ApiSuccessEnvelope:
  type: object
  required:
    - data
  properties:
    data:
      type: object
      additionalProperties: true

ApiListMeta:
  type: object
  required:
    - page
    - pageSize
    - total
    - totalPages
  properties:
    page:
      type: integer
      example: 1
    pageSize:
      type: integer
      example: 20
    total:
      type: integer
      example: 120
    totalPages:
      type: integer
      example: 6

ApiErrorEnvelope:
  type: object
  required:
    - error
  properties:
    error:
      $ref: '#/components/schemas/ApiError'
```

---

## Gemeinsame Enums

```yaml
Language:
  type: string
  enum: [FR, AR]

UserRole:
  type: string
  enum: [RECEPTION, TECHNICIAN, PHYSICIAN, ADMIN]

Gender:
  type: string
  enum: [M, F, O]

OrderPriority:
  type: string
  enum: [ROUTINE, URGENT, STAT]

OrderStatus:
  type: string
  enum: [PENDING, COLLECTED, ANALYZED, VALIDATED, PUBLISHED, CANCELLED]

SpecimenType:
  type: string
  enum: [BLOOD, URINE, STOOL, TISSUE]

SpecimenStatus:
  type: string
  enum: [COLLECTED, RECEIVED, PROCESSED, DISPOSED, REJECTED]

ResultFlag:
  type: string
  enum: [N, H, L, HH, LL, CRITICAL]

ReportStatus:
  type: string
  enum: [DRAFT, VALIDATED, FINAL, CORRECTED, PUBLISHED]

ReagentCategory:
  type: string
  enum: [CHEMISTRY, HEMATOLOGY, IMMUNOLOGY, MICROBIOLOGY]
```

---

## Kernschemas

## CurrentUserDto

```yaml
CurrentUserDto:
  type: object
  required:
    - id
    - email
    - role
    - language
    - isActive
    - createdAt
  properties:
    id:
      type: string
      example: usr_001
    email:
      type: string
      format: email
      example: physician@mlms.local
    role:
      $ref: '#/components/schemas/UserRole'
    language:
      $ref: '#/components/schemas/Language'
    isActive:
      type: boolean
      example: true
    createdAt:
      type: string
      format: date-time
      example: 2026-03-15T20:00:00.000Z
```

## LoginDto

```yaml
LoginDto:
  type: object
  required:
    - email
    - password
  properties:
    email:
      type: string
      format: email
      example: physician@mlms.local
    password:
      type: string
      format: password
      example: secret123
```

## LoginResponseDto

```yaml
LoginResponseDto:
  type: object
  required:
    - accessToken
    - user
  properties:
    accessToken:
      type: string
      example: jwt-token
    user:
      $ref: '#/components/schemas/CurrentUserDto'
```

---

## Patient Schemas

```yaml
PatientDto:
  type: object
  required:
    - id
    - firstName
    - lastName
    - birthDate
    - gender
    - createdAt
    - updatedAt
  properties:
    id:
      type: string
      example: pat_001
    firstName:
      type: string
      example: Amina
    lastName:
      type: string
      example: El Idrissi
    birthDate:
      type: string
      format: date-time
      example: 1992-05-12T00:00:00.000Z
    gender:
      $ref: '#/components/schemas/Gender'
    phone:
      type: string
      nullable: true
      example: +212600000000
    email:
      type: string
      format: email
      nullable: true
      example: amina@example.com
    address:
      type: string
      nullable: true
      example: Casablanca
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time
    orderCount:
      type: integer
      nullable: true
      example: 2

CreatePatientRequestDto:
  type: object
  required:
    - firstName
    - lastName
    - birthDate
    - gender
  properties:
    firstName:
      type: string
    lastName:
      type: string
    birthDate:
      type: string
      format: date-time
    gender:
      $ref: '#/components/schemas/Gender'
    phone:
      type: string
      nullable: true
    email:
      type: string
      format: email
      nullable: true
    address:
      type: string
      nullable: true

UpdatePatientRequestDto:
  type: object
  properties:
    firstName:
      type: string
    lastName:
      type: string
    birthDate:
      type: string
      format: date-time
    gender:
      $ref: '#/components/schemas/Gender'
    phone:
      type: string
      nullable: true
    email:
      type: string
      format: email
      nullable: true
    address:
      type: string
      nullable: true
```

---

## Order Schemas

```yaml
TestOrderItemDto:
  type: object
  required:
    - id
    - orderId
    - testCode
    - testNameFr
    - testNameAr
    - priority
  properties:
    id:
      type: string
    orderId:
      type: string
    testCode:
      type: string
      example: GLU
    testNameFr:
      type: string
      example: Glycémie
    testNameAr:
      type: string
      example: سكر الدم
    priority:
      type: string
      enum: [ROUTINE, URGENT]
    notes:
      type: string
      nullable: true

OrderDto:
  type: object
  required:
    - id
    - patientId
    - status
    - priority
    - createdAt
    - updatedAt
    - tests
  properties:
    id:
      type: string
    patientId:
      type: string
    status:
      $ref: '#/components/schemas/OrderStatus'
    priority:
      $ref: '#/components/schemas/OrderPriority'
    createdBy:
      type: string
      nullable: true
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time
    tests:
      type: array
      items:
        $ref: '#/components/schemas/TestOrderItemDto'

CreateOrderRequestDto:
  type: object
  required:
    - patientId
    - priority
    - tests
  properties:
    patientId:
      type: string
    priority:
      $ref: '#/components/schemas/OrderPriority'
    tests:
      type: array
      minItems: 1
      items:
        type: object
        required:
          - testCode
          - priority
        properties:
          testCode:
            type: string
            example: GLU
          priority:
            type: string
            enum: [ROUTINE, URGENT]
          notes:
            type: string
            nullable: true

UpdateOrderStatusRequestDto:
  type: object
  required:
    - status
  properties:
    status:
      $ref: '#/components/schemas/OrderStatus'
```

---

## Specimen Schemas

```yaml
SpecimenDto:
  type: object
  required:
    - id
    - orderId
    - barcode
    - type
    - status
    - collectionTime
    - createdAt
    - updatedAt
  properties:
    id:
      type: string
    orderId:
      type: string
    barcode:
      type: string
      example: LAB-2026-00001
    type:
      $ref: '#/components/schemas/SpecimenType'
    status:
      $ref: '#/components/schemas/SpecimenStatus'
    collectionTime:
      type: string
      format: date-time
    receivedAt:
      type: string
      format: date-time
      nullable: true
    notes:
      type: string
      nullable: true
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time

CreateSpecimenRequestDto:
  type: object
  required:
    - orderId
    - barcode
    - type
    - collectionTime
  properties:
    orderId:
      type: string
    barcode:
      type: string
    type:
      $ref: '#/components/schemas/SpecimenType'
    collectionTime:
      type: string
      format: date-time
    notes:
      type: string
      nullable: true

UpdateSpecimenStatusRequestDto:
  type: object
  required:
    - status
  properties:
    status:
      $ref: '#/components/schemas/SpecimenStatus'
    receivedAt:
      type: string
      format: date-time
      nullable: true
```

---

## Result Schemas

```yaml
ResultDto:
  type: object
  required:
    - id
    - specimenId
    - testCode
    - testNameFr
    - testNameAr
    - value
    - flag
    - measuredAt
    - createdAt
    - updatedAt
  properties:
    id:
      type: string
    specimenId:
      type: string
    testCode:
      type: string
      example: GLU
    testNameFr:
      type: string
      example: Glycémie
    testNameAr:
      type: string
      example: سكر الدم
    value:
      type: string
      example: "126"
    unit:
      type: string
      nullable: true
      example: mg/dL
    referenceLow:
      type: number
      nullable: true
      example: 70
    referenceHigh:
      type: number
      nullable: true
      example: 110
    flag:
      $ref: '#/components/schemas/ResultFlag'
    measuredAt:
      type: string
      format: date-time
    measuredBy:
      type: string
      nullable: true
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time

RecordResultRequestDto:
  type: object
  required:
    - specimenId
    - testCode
    - testNameFr
    - testNameAr
    - value
    - flag
    - measuredAt
  properties:
    specimenId:
      type: string
    testCode:
      type: string
    testNameFr:
      type: string
    testNameAr:
      type: string
    value:
      type: string
    unit:
      type: string
      nullable: true
    referenceLow:
      type: number
      nullable: true
    referenceHigh:
      type: number
      nullable: true
    flag:
      $ref: '#/components/schemas/ResultFlag'
    measuredAt:
      type: string
      format: date-time

UpdateResultRequestDto:
  type: object
  properties:
    value:
      type: string
    unit:
      type: string
      nullable: true
    referenceLow:
      type: number
      nullable: true
    referenceHigh:
      type: number
      nullable: true
    flag:
      $ref: '#/components/schemas/ResultFlag'
    measuredAt:
      type: string
      format: date-time
```

---

## Report Schemas

```yaml
ReportDto:
  type: object
  required:
    - id
    - orderId
    - status
    - templateVersion
    - createdAt
    - updatedAt
  properties:
    id:
      type: string
    orderId:
      type: string
    status:
      $ref: '#/components/schemas/ReportStatus'
    commentsFr:
      type: string
      nullable: true
    commentsAr:
      type: string
      nullable: true
    validatedBy:
      type: string
      nullable: true
    validatedAt:
      type: string
      format: date-time
      nullable: true
    signedBy:
      type: string
      nullable: true
    signedAt:
      type: string
      format: date-time
      nullable: true
    publishedAt:
      type: string
      format: date-time
      nullable: true
    templateVersion:
      type: string
      example: v1
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time

GenerateReportRequestDto:
  type: object
  required:
    - orderId
    - templateVersion
  properties:
    orderId:
      type: string
    templateVersion:
      type: string

ValidateReportRequestDto:
  type: object
  properties:
    commentsFr:
      type: string
      nullable: true
    commentsAr:
      type: string
      nullable: true

SignReportRequestDto:
  type: object
  required:
    - signedBy
  properties:
    signedBy:
      type: string

PublishReportRequestDto:
  type: object
  required:
    - publishToPortal
  properties:
    publishToPortal:
      type: boolean

ReportDetailDto:
  type: object
  required:
    - report
    - patient
    - order
    - results
  properties:
    report:
      $ref: '#/components/schemas/ReportDto'
    patient:
      $ref: '#/components/schemas/PatientDto'
    order:
      $ref: '#/components/schemas/OrderDto'
    results:
      type: array
      items:
        $ref: '#/components/schemas/ResultDto'
```

---

## Reagent Schemas

```yaml
ReagentDto:
  type: object
  required:
    - id
    - name
    - manufacturer
    - category
    - createdAt
    - updatedAt
  properties:
    id:
      type: string
    name:
      type: string
    manufacturer:
      type: string
    catalogNumber:
      type: string
      nullable: true
    category:
      $ref: '#/components/schemas/ReagentCategory'
    storageTemp:
      type: string
      nullable: true
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time

ReagentLotDto:
  type: object
  required:
    - id
    - reagentId
    - lotNumber
    - expiryDate
    - initialQuantity
    - currentQuantity
    - isBlocked
    - createdAt
    - updatedAt
  properties:
    id:
      type: string
    reagentId:
      type: string
    lotNumber:
      type: string
    expiryDate:
      type: string
      format: date-time
    initialQuantity:
      type: integer
    currentQuantity:
      type: integer
    isBlocked:
      type: boolean
    storageLocation:
      type: string
      nullable: true
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time

CreateReagentRequestDto:
  type: object
  required:
    - name
    - manufacturer
    - category
  properties:
    name:
      type: string
    manufacturer:
      type: string
    catalogNumber:
      type: string
      nullable: true
    category:
      $ref: '#/components/schemas/ReagentCategory'
    storageTemp:
      type: string
      nullable: true

ReceiveReagentLotRequestDto:
  type: object
  required:
    - reagentId
    - lotNumber
    - expiryDate
    - initialQuantity
  properties:
    reagentId:
      type: string
    lotNumber:
      type: string
    expiryDate:
      type: string
      format: date-time
    initialQuantity:
      type: integer
    currentQuantity:
      type: integer
    storageLocation:
      type: string
      nullable: true

ConsumeReagentRequestDto:
  type: object
  required:
    - reagentLotId
    - quantity
    - reason
  properties:
    reagentLotId:
      type: string
    quantity:
      type: integer
    reason:
      type: string
    orderId:
      type: string
      nullable: true
    specimenId:
      type: string
      nullable: true
    resultId:
      type: string
      nullable: true
```

---

## Portal Schemas

```yaml
PatientPortalReportDto:
  type: object
  required:
    - id
    - orderId
    - status
  properties:
    id:
      type: string
    orderId:
      type: string
    status:
      $ref: '#/components/schemas/ReportStatus'
    publishedAt:
      type: string
      format: date-time
      nullable: true
    patient:
      type: object
      required:
        - id
        - firstName
        - lastName
        - birthDate
      properties:
        id:
          type: string
        firstName:
          type: string
        lastName:
          type: string
        birthDate:
          type: string
          format: date-time
    results:
      type: array
      items:
        type: object
        required:
          - testCode
          - testNameFr
          - testNameAr
          - value
          - flag
        properties:
          testCode:
            type: string
          testNameFr:
            type: string
          testNameAr:
            type: string
          value:
            type: string
          unit:
            type: string
            nullable: true
          flag:
            $ref: '#/components/schemas/ResultFlag'
          referenceLow:
            type: number
            nullable: true
          referenceHigh:
            type: number
            nullable: true
    commentsFr:
      type: string
      nullable: true
    commentsAr:
      type: string
      nullable: true
```

---

## Parameters

```yaml
components:
  parameters:
    PageParam:
      in: query
      name: page
      schema:
        type: integer
        minimum: 1
        default: 1

    PageSizeParam:
      in: query
      name: pageSize
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20

    PatientIdParam:
      in: path
      name: id
      required: true
      schema:
        type: string
```

Hinweis:
Für verschiedene Ressourcen kann `name: id` wiederverwendet werden, solange Beschreibung und Kontext klar bleiben.
Alternativ können dedizierte Parameter wie `OrderIdParam` oder `ReportIdParam` definiert werden.

---

## Responses

```yaml
components:
  responses:
    UnauthorizedError:
      description: Unauthorized
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ApiErrorEnvelope'
          example:
            error:
              code: UNAUTHORIZED
              message: Authentication required

    ForbiddenError:
      description: Forbidden
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ApiErrorEnvelope'
          example:
            error:
              code: FORBIDDEN
              message: Access denied

    NotFoundError:
      description: Not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ApiErrorEnvelope'
          example:
            error:
              code: NOT_FOUND
              message: Resource not found

    ValidationError:
      description: Validation error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ApiErrorEnvelope'
          example:
            error:
              code: VALIDATION_ERROR
              message: Validation failed
              details:
                - field: firstName
                  message: firstName is required
```

---

## Beispielpfade

## Auth

```yaml
paths:
  /auth/login:
    post:
      tags: [Auth]
      summary: Login user
      operationId: loginUser
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginDto'
            example:
              email: physician@mlms.local
              password: secret123
      responses:
        '200':
          description: Login successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/LoginResponseDto'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /auth/me:
    get:
      tags: [Auth]
      summary: Get current user
      operationId: getCurrentUser
      responses:
        '200':
          description: Current user
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/CurrentUserDto'
        '401':
          $ref: '#/components/responses/UnauthorizedError'
```

---

## Patients

```yaml
  /patients:
    get:
      tags: [Patients]
      summary: List patients
      operationId: listPatients
      parameters:
        - $ref: '#/components/parameters/PageParam'
        - $ref: '#/components/parameters/PageSizeParam'
        - in: query
          name: search
          schema:
            type: string
        - in: query
          name: gender
          schema:
            $ref: '#/components/schemas/Gender'
      responses:
        '200':
          description: Patient list
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/PatientDto'
                  meta:
                    $ref: '#/components/schemas/ApiListMeta'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

    post:
      tags: [Patients]
      summary: Create patient
      operationId: createPatient
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreatePatientRequestDto'
      responses:
        '201':
          description: Patient created
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/PatientDto'
        '422':
          $ref: '#/components/responses/ValidationError'

  /patients/{id}:
    get:
      tags: [Patients]
      summary: Get patient by id
      operationId: getPatientById
      parameters:
        - $ref: '#/components/parameters/PatientIdParam'
      responses:
        '200':
          description: Patient detail
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/PatientDto'
        '404':
          $ref: '#/components/responses/NotFoundError'

    patch:
      tags: [Patients]
      summary: Update patient
      operationId: updatePatient
      parameters:
        - $ref: '#/components/parameters/PatientIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdatePatientRequestDto'
      responses:
        '200':
          description: Patient updated
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/PatientDto'
        '422':
          $ref: '#/components/responses/ValidationError'
        '404':
          $ref: '#/components/responses/NotFoundError'
```

---

## Orders

```yaml
  /orders:
    get:
      tags: [Orders]
      summary: List orders
      operationId: listOrders
      parameters:
        - $ref: '#/components/parameters/PageParam'
        - $ref: '#/components/parameters/PageSizeParam'
        - in: query
          name: patientId
          schema:
            type: string
        - in: query
          name: status
          schema:
            $ref: '#/components/schemas/OrderStatus'
        - in: query
          name: priority
          schema:
            $ref: '#/components/schemas/OrderPriority'
      responses:
        '200':
          description: Order list
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/OrderDto'
                  meta:
                    $ref: '#/components/schemas/ApiListMeta'

    post:
      tags: [Orders]
      summary: Create order
      operationId: createOrder
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateOrderRequestDto'
      responses:
        '201':
          description: Order created
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/OrderDto'
        '422':
          $ref: '#/components/responses/ValidationError'

  /orders/{id}:
    get:
      tags: [Orders]
      summary: Get order by id
      operationId: getOrderById
      parameters:
        - $ref: '#/components/parameters/PatientIdParam'
      responses:
        '200':
          description: Order detail
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/OrderDto'

  /orders/{id}/status:
    patch:
      tags: [Orders]
      summary: Update order status
      operationId: updateOrderStatus
      parameters:
        - $ref: '#/components/parameters/PatientIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateOrderStatusRequestDto'
      responses:
        '200':
          description: Order status updated
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/OrderDto'
```

---

## Specimens

```yaml
  /specimens:
    post:
      tags: [Specimens]
      summary: Create specimen
      operationId: createSpecimen
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateSpecimenRequestDto'
      responses:
        '201':
          description: Specimen created
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/SpecimenDto'

  /specimens/{id}:
    get:
      tags: [Specimens]
      summary: Get specimen by id
      operationId: getSpecimenById
      parameters:
        - $ref: '#/components/parameters/PatientIdParam'
      responses:
        '200':
          description: Specimen detail
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/SpecimenDto'

  /specimens/{id}/status:
    patch:
      tags: [Specimens]
      summary: Update specimen status
      operationId: updateSpecimenStatus
      parameters:
        - $ref: '#/components/parameters/PatientIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateSpecimenStatusRequestDto'
      responses:
        '200':
          description: Specimen updated
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/SpecimenDto'
```

---

## Results

```yaml
  /results:
    post:
      tags: [Results]
      summary: Record result
      operationId: recordResult
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RecordResultRequestDto'
      responses:
        '201':
          description: Result recorded
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/ResultDto'

  /results/{id}:
    patch:
      tags: [Results]
      summary: Update result
      operationId: updateResult
      parameters:
        - $ref: '#/components/parameters/PatientIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateResultRequestDto'
      responses:
        '200':
          description: Result updated
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/ResultDto'

  /specimens/{id}/results:
    get:
      tags: [Results]
      summary: List results by specimen
      operationId: listResultsBySpecimen
      parameters:
        - $ref: '#/components/parameters/PatientIdParam'
      responses:
        '200':
          description: Specimen results
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/ResultDto'

  /orders/{id}/results:
    get:
      tags: [Results]
      summary: List results by order
      operationId: listResultsByOrder
      parameters:
        - $ref: '#/components/parameters/PatientIdParam'
      responses:
        '200':
          description: Order results
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/ResultDto'
```

---

## Reports

```yaml
  /reports:
    get:
      tags: [Reports]
      summary: List reports
      operationId: listReports
      parameters:
        - $ref: '#/components/parameters/PageParam'
        - $ref: '#/components/parameters/PageSizeParam'
        - in: query
          name: status
          schema:
            $ref: '#/components/schemas/ReportStatus'
      responses:
        '200':
          description: Report list
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/ReportDto'
                  meta:
                    $ref: '#/components/schemas/ApiListMeta'

  /reports/generate:
    post:
      tags: [Reports]
      summary: Generate report
      operationId: generateReport
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/GenerateReportRequestDto'
      responses:
        '201':
          description: Report generated
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/ReportDto'

  /reports/{id}:
    get:
      tags: [Reports]
      summary: Get report by id
      operationId: getReportById
      parameters:
        - $ref: '#/components/parameters/PatientIdParam'
      responses:
        '200':
          description: Report detail
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/ReportDetailDto'

  /reports/{id}/validate:
    post:
      tags: [Reports]
      summary: Validate report
      operationId: validateReport
      parameters:
        - $ref: '#/components/parameters/PatientIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ValidateReportRequestDto'
      responses:
        '200':
          description: Report validated
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/ReportDto'

  /reports/{id}/sign:
    post:
      tags: [Reports]
      summary: Sign report
      operationId: signReport
      parameters:
        - $ref: '#/components/parameters/PatientIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SignReportRequestDto'
      responses:
        '200':
          description: Report signed
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/ReportDto'

  /reports/{id}/publish:
    post:
      tags: [Reports]
      summary: Publish report
      operationId: publishReport
      parameters:
        - $ref: '#/components/parameters/PatientIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PublishReportRequestDto'
      responses:
        '200':
          description: Report published
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/ReportDto'
```

---

## Reagents

```yaml
  /reagents:
    get:
      tags: [Reagents]
      summary: List reagents
      operationId: listReagents
      responses:
        '200':
          description: Reagent list
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/ReagentDto'

    post:
      tags: [Reagents]
      summary: Create reagent
      operationId: createReagent
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateReagentRequestDto'
      responses:
        '201':
          description: Reagent created
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/ReagentDto'

  /reagents/lots:
    post:
      tags: [Reagents]
      summary: Receive reagent lot
      operationId: receiveReagentLot
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ReceiveReagentLotRequestDto'
      responses:
        '201':
          description: Lot received
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/ReagentLotDto'

  /reagents/{id}/lots:
    get:
      tags: [Reagents]
      summary: List reagent lots
      operationId: listReagentLots
      parameters:
        - $ref: '#/components/parameters/PatientIdParam'
      responses:
        '200':
          description: Reagent lot list
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/ReagentLotDto'

  /reagents/consume:
    post:
      tags: [Reagents]
      summary: Consume reagent
      operationId: consumeReagent
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ConsumeReagentRequestDto'
      responses:
        '200':
          description: Reagent consumed
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: object
                    additionalProperties: true
```

---

## Portal

```yaml
  /portal/reports:
    get:
      tags: [Portal]
      summary: List patient portal reports
      operationId: listPortalReports
      responses:
        '200':
          description: Portal report list
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/PatientPortalReportDto'

  /portal/reports/{id}:
    get:
      tags: [Portal]
      summary: Get patient portal report by id
      operationId: getPortalReportById
      parameters:
        - $ref: '#/components/parameters/PatientIdParam'
      responses:
        '200':
          description: Portal report detail
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/PatientPortalReportDto'
```

---

## HTTP Status Codes

```yaml
200: OK
201: Created
204: No Content
400: Bad Request
401: Unauthorized
403: Forbidden
404: Not Found
409: Conflict
422: Unprocessable Entity
500: Internal Server Error
```

---

## Fehlercodes

```yaml
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

## Beispiele

### Beispiel Login Request

```json
{
  "email": "physician@mlms.local",
  "password": "secret123"
}
```

### Beispiel Login Response

```json
{
  "data": {
    "accessToken": "jwt-token",
    "user": {
      "id": "usr_001",
      "email": "physician@mlms.local",
      "role": "PHYSICIAN",
      "language": "FR",
      "isActive": true,
      "createdAt": "2026-03-15T20:00:00.000Z"
    }
  }
}
```

### Beispiel Validation Error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
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

## NestJS Integration

Wenn NestJS Swagger verwendet wird, werden mindestens diese Schritte empfohlen:

1. SwaggerModule in `main.ts` aktivieren
2. `DocumentBuilder` konfigurieren
3. Bearer Auth definieren
4. DTOs mit Swagger Decorators annotieren
5. Tags pro Controller setzen

---

## Beispiel `main.ts` für Swagger

```ts
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('MLMS API')
    .setDescription('Medical Laboratory Management System API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}

bootstrap();
```

---

## Empfohlene Controller-Tags

```ts
@ApiTags('Auth')
@ApiTags('Patients')
@ApiTags('Orders')
@ApiTags('Specimens')
@ApiTags('Results')
@ApiTags('Reports')
@ApiTags('Reagents')
@ApiTags('Portal')
```

---

## Regeln für NestJS Decorators

### DTOs
- `@ApiProperty()`
- `@ApiPropertyOptional()`

### Controller
- `@ApiTags()`
- `@ApiBearerAuth()`
- `@ApiOperation()`
- `@ApiResponse()`
- `@ApiParam()`
- `@ApiQuery()`

### Security
- `@ApiBearerAuth()` auf geschützte Controller oder Methoden

---

## Regeln für Qualität

Die OpenAPI-Dokumentation ist korrekt, wenn:

- alle MVP-Endpunkte dokumentiert sind
- Bearer Auth sichtbar ist
- Responses typed sind
- Errors dokumentiert sind
- Beispiele vorhanden sind
- Feldnamen exakt mit Contracts übereinstimmen
- Status-Enums exakt mit Domain Model übereinstimmen

---

## MVP Pflicht-Endpunkte in OpenAPI

Mindestens diese Endpunkte müssen dokumentiert werden:

- `POST /auth/login`
- `GET /auth/me`
- `POST /patients`
- `GET /patients`
- `GET /patients/{id}`
- `PATCH /patients/{id}`
- `POST /orders`
- `GET /orders`
- `GET /orders/{id}`
- `PATCH /orders/{id}/status`
- `POST /specimens`
- `GET /specimens/{id}`
- `PATCH /specimens/{id}/status`
- `POST /results`
- `PATCH /results/{id}`
- `GET /specimens/{id}/results`
- `GET /orders/{id}/results`
- `POST /reports/generate`
- `GET /reports/{id}`
- `POST /reports/{id}/validate`
- `POST /reports/{id}/sign`
- `POST /reports/{id}/publish`
- `GET /portal/reports`
- `GET /portal/reports/{id}`
- `POST /reagents`
- `GET /reagents`
- `POST /reagents/lots`
- `GET /reagents/{id}/lots`
- `POST /reagents/consume`

---

## Datei-Empfehlung für das Repo

```text
backend/openapi/mlms.openapi.yaml
```

---

## Definition of Done

Dieses Dokument ist korrekt umgesetzt, wenn:

- eine OpenAPI-Datei existiert
- Bearer Auth dokumentiert ist
- MVP-Endpunkte dokumentiert sind
- Schemas mit Contracts übereinstimmen
- Fehlerformate dokumentiert sind
- Swagger UI im Backend erreichbar ist
- die Spezifikation für Frontend und Testing nutzbar ist

---

## Claude Code Prompt für dieses OpenAPI-File

```text
LIES DIESES KOMPLETTE DOKUMENT `12-OPENAPI.md`.

Erstelle daraus die OpenAPI-Dokumentation für das MLMS.

WICHTIGE REGELN:
1. Nutze OpenAPI 3.0.3.
2. Halte Schema-Namen in PascalCase.
3. Halte Feldnamen exakt contract-kompatibel.
4. Dokumentiere Bearer JWT Auth global.
5. Dokumentiere alle MVP-Endpunkte.
6. Füge Examples für wichtige Requests und Responses hinzu.
7. Dokumentiere Standard-Errors.
8. Halte Enums exakt konsistent mit Domain Model und Contracts.
9. Bereite die Spec so vor, dass Swagger UI sie verwenden kann.

Liefere:
- `backend/openapi/mlms.openapi.yaml`
- ggf. Swagger Setup in `backend/src/main.ts`
- ggf. notwendige Swagger Decorators in zentralen DTOs/Controllern
```

---
