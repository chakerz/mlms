# MLMS – Medical Laboratory Management System

## Stack
- Backend: Node.js + NestJS + Prisma + PostgreSQL 16
- Frontend: React 18 + Vite + TailwindCSS + react-i18next
- Auth: JWT + RBAC
- Sprachen: Französisch (LTR) + Arabisch (RTL)

## Ordnerstruktur
```
mlms/
├── backend/
├── frontend/
├── contracts/
├── docs/
└── docker-compose.yml
```

## Rollen
- RECEPTION  → Patient + Order anlegen
- TECHNICIAN → Specimen + Result erfassen
- PHYSICIAN  → Report validieren + signieren
- ADMIN      → Benutzer + Reagenzien verwalten

## MVP Features
1. AUTH     – Login, Rollen, JWT
2. PATIENT  – CRUD, Suche
3. ORDER    – Auftrag mit Tests anlegen
4. SPECIMEN – Barcode, Tracking
5. RESULT   – Werte + Flags (H/L/CRITICAL)
6. REPORT   – Validieren, Signieren, Publizieren
7. PORTAL   – Patient sieht eigene Befunde
8. REAGENT  – Stock, Lots, Verbrauch

## Start
```bash
docker-compose up -d
cd backend && npm run start:dev
cd ../frontend && npm run dev
```

## Docs
docs/
├── 01-README.md              ← diese Datei
├── 02-BACKEND-STRUCTURE.md
├── 03-FRONTEND-STRUCTURE.md
├── 04-DOMAIN-MODEL.md
├── 05-API-CONTRACTS.md
├── 06-I18N.md
├── 07-DOCKER.md
├── 08-MEDICAL-TERMS.md
├── 09-MVP-CHECKLIST.md
└── 10-CLAUDE-PROMPTS.md
