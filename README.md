# MLMS

Medical Laboratory Management System for laboratory workflow management from patient registration to published reports.

## Overview

MLMS is a monorepo-based laboratory management system with:

- Backend API
- Frontend web application
- Shared TypeScript contracts
- Project documentation
- French and Arabic support
- Role-based access control
- Docker-based local development

The goal is to support the core laboratory flow:

1. User login
2. Patient registration
3. Order creation
4. Specimen registration
5. Result entry
6. Report validation
7. Report publication
8. Patient portal access

## Repository Structure

```text
mlms/
├── backend/
├── frontend/
├── contracts/
├── docs/
├── .env.example
├── docker-compose.yml
├── Makefile
└── README.md
```

## Main Folders

### `backend/`
NestJS backend, Prisma, PostgreSQL integration, authentication, roles, domain logic and API endpoints.

### `frontend/`
React + Vite frontend for internal laboratory users and patient portal.

### `contracts/`
Shared TypeScript DTOs and types used by backend and frontend.

### `docs/`
Project architecture, domain model, API contracts, Docker setup, Prisma schema, OpenAPI documentation and MVP planning.

## Documentation Order

Read the project documentation in this order:

1. `docs/00-DOCS-INDEX.md`
2. `docs/01-PROJECT-OVERVIEW.md`
3. `docs/02-BACKEND-STRUCTURE.md`
4. `docs/03-FRONTEND-STRUCTURE.md`
5. `docs/04-DOMAIN-MODEL.md`
6. `docs/05-API-CONTRACTS.md`
7. `docs/06-I18N.md`
8. `docs/07-DOCKER.md`
9. `docs/08-MEDICAL-TERMS.md`
10. `docs/11-PRISMA-SCHEMA.md`
11. `docs/12-OPENAPI.md`
12. `docs/09-MVP-CHECKLIST.md`
13. `docs/10-CLAUDE-PROMPTS.md`

## Planned Stack

### Backend
- Node.js
- NestJS
- Prisma
- PostgreSQL
- JWT authentication
- RBAC

### Frontend
- React
- Vite
- TypeScript
- Redux Toolkit / RTK Query
- i18n with FR and AR
- RTL support for Arabic

### Dev Environment
- Docker
- Docker Compose

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/DEIN_USERNAME/mlms.git
cd mlms
```

### 2. Create your environment file

Copy `.env.example` and create your local `.env`.

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
copy .env.example .env
```

### 3. Start the development environment

```bash
docker compose up -d
```

### 4. Open the main services

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

## Current Status

This project is currently in the initial setup and architecture phase.

Main priorities:

- Monorepo setup
- Docker development environment
- Contracts package
- Prisma schema
- OpenAPI specification
- Backend foundation
- Frontend foundation

## Working Rules

- Keep backend, frontend, contracts, Prisma and OpenAPI consistent.
- Do not rename documented folders without updating `docs/`.
- Use stable field names from the contracts.
- Keep French and Arabic support in scope from the start.
- Update documentation when structure changes.

## Git Workflow

Basic workflow:

```bash
git status
git add .
git commit -m "Your message"
git push
```

## Next Steps

Recommended start order:

1. Finalize root folder structure
2. Add docs index and overview files
3. Add Docker setup
4. Add contracts package
5. Add Prisma schema
6. Add OpenAPI spec
7. Build backend foundation
8. Build frontend foundation

## License

Private project for now.
