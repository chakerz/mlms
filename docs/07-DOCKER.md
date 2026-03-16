# 07-DOCKER.md

# Docker & Development Environment – MLMS

## Ziel

Dieses Dokument definiert die Docker-basierte lokale Entwicklungsumgebung für das MLMS.

Die Umgebung muss:

- Backend, Frontend und Datenbank gemeinsam starten
- für lokale Entwicklung geeignet sein
- Hot Reload unterstützen
- reproduzierbar sein
- einfach für Claude Code und lokale Entwickler nutzbar sein

Dieses Dokument ist die verbindliche Grundlage für:

- `docker-compose.yml`
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `.env.example`
- lokale Startskripte

---

## Zielarchitektur lokal

Die lokale Docker-Umgebung besteht aus:

1. PostgreSQL
2. Backend (NestJS)
3. Frontend (React + Vite)

Optional später:
4. pgAdmin
5. Mailhog
6. Redis

Für den MVP werden nur die ersten 3 Services verpflichtend aufgebaut.

---

## Projektstruktur mit Docker-Bezug

```text
mlms/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── ...
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── ...
├── docs/
│   └── 07-DOCKER.md
├── .env.example
├── docker-compose.yml
└── Makefile
```

---

## Container Übersicht

## 1. postgres
Zweck:
- speichert alle MLMS Daten

Port:
- `5432`

## 2. backend
Zweck:
- NestJS API
- Prisma
- Auth
- Business Logic

Port:
- `3000`

## 3. frontend
Zweck:
- React App
- Vite Dev Server

Port:
- `5173`

---

## Netzwerkkonzept

Alle Services kommunizieren innerhalb desselben Docker-Netzwerks.

Interne Hostnamen:
- `postgres`
- `backend`
- `frontend`

Beispiele:
- Backend verbindet sich zu DB über `postgres:5432`
- Frontend spricht lokal über `http://localhost:3000/api`

---

## Volumes

### postgres_data
Persistiert Datenbankdaten lokal.

### backend node_modules
Wird im Container gehalten, damit lokale Host-Dateien sauber bleiben.

### frontend node_modules
Ebenso isoliert im Container.

### Code Mounts
Backend- und Frontend-Code werden als Volumes gemountet, damit Änderungen sofort wirken.

---

## Root Datei: `.env.example`

```env
# App
NODE_ENV=development

# Backend
BACKEND_PORT=3000
API_PREFIX=api
JWT_SECRET=change_me_please
JWT_EXPIRES_IN=1d
DEFAULT_LANGUAGE=FR
BCRYPT_ROUNDS=10

# Frontend
FRONTEND_PORT=5173
VITE_API_URL=http://localhost:3000/api

# Database
POSTGRES_DB=mlms
POSTGRES_USER=mlms
POSTGRES_PASSWORD=mlms_secret
POSTGRES_PORT=5432
DATABASE_URL=postgresql://mlms:mlms_secret@postgres:5432/mlms
```

---

## Root Datei: `docker-compose.yml`

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    container_name: mlms-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-mlms}
      POSTGRES_USER: ${POSTGRES_USER:-mlms}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-mlms_secret}
    ports:
      - '${POSTGRES_PORT:-5432}:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - mlms-network
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${POSTGRES_USER:-mlms} -d ${POSTGRES_DB:-mlms}']
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: mlms-backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      PORT: ${BACKEND_PORT:-3000}
      API_PREFIX: ${API_PREFIX:-api}
      DATABASE_URL: ${DATABASE_URL:-postgresql://mlms:mlms_secret@postgres:5432/mlms}
      JWT_SECRET: ${JWT_SECRET:-change_me_please}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN:-1d}
      DEFAULT_LANGUAGE: ${DEFAULT_LANGUAGE:-FR}
      BCRYPT_ROUNDS: ${BCRYPT_ROUNDS:-10}
    ports:
      - '${BACKEND_PORT:-3000}:3000'
    working_dir: /app
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: sh -c "npm install && npm run prisma:generate && npm run start:dev"
    networks:
      - mlms-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: mlms-frontend
    restart: unless-stopped
    depends_on:
      - backend
    environment:
      VITE_API_URL: ${VITE_API_URL:-http://localhost:3000/api}
      PORT: ${FRONTEND_PORT:-5173}
      CHOKIDAR_USEPOLLING: 'true'
    ports:
      - '${FRONTEND_PORT:-5173}:5173'
    working_dir: /app
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: sh -c "npm install && npm run dev -- --host 0.0.0.0"
    networks:
      - mlms-network

volumes:
  postgres_data:

networks:
  mlms-network:
    driver: bridge
```

---

## Backend Datei: `backend/Dockerfile`

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
```

---

## Backend Datei: `backend/.dockerignore`

```text
node_modules
dist
coverage
.git
.gitignore
npm-debug.log
.env
README.md
```

---

## Frontend Datei: `frontend/Dockerfile`

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

---

## Frontend Datei: `frontend/.dockerignore`

```text
node_modules
dist
coverage
.git
.gitignore
npm-debug.log
.env
README.md
```

---

## Root Datei: `Makefile`

```makefile
up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build

logs:
	docker compose logs -f

restart:
	docker compose down && docker compose up -d

backend-logs:
	docker compose logs -f backend

frontend-logs:
	docker compose logs -f frontend

db-logs:
	docker compose logs -f postgres

ps:
	docker compose ps

migrate:
	docker compose exec backend npm run prisma:migrate

generate:
	docker compose exec backend npm run prisma:generate

seed:
	docker compose exec backend npm run seed

backend-shell:
	docker compose exec backend sh

frontend-shell:
	docker compose exec frontend sh

db-shell:
	docker compose exec postgres sh
```

---

## Startanleitung lokal

## 1. Projekt vorbereiten

```bash
cp .env.example .env
```

## 2. Container starten

```bash
docker compose up -d
```

## 3. Logs prüfen

```bash
docker compose logs -f
```

## 4. Migration ausführen

```bash
docker compose exec backend npm run prisma:migrate
```

## 5. Prisma Client generieren

```bash
docker compose exec backend npm run prisma:generate
```

## 6. Seed ausführen (optional)

```bash
docker compose exec backend npm run seed
```

---

## URLs lokal

```text
Backend API:   http://localhost:3000/api
Frontend UI:   http://localhost:5173
PostgreSQL:    localhost:5432
```

---

## Health Check Erwartungen

### PostgreSQL
Der Container gilt als healthy, wenn:

```bash
pg_isready -U mlms -d mlms
```

erfolgreich ist.

### Backend
Später sinnvoll:
- `GET /api/health`

### Frontend
Kein eigener Health Check nötig für MVP.

---

## Empfohlene Backend package.json Scripts

```json
{
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "build": "nest build",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "seed": "ts-node prisma/seed.ts"
  }
}
```

---

## Empfohlene Frontend package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

---

## Entwicklung mit Hot Reload

### Backend
Hot Reload funktioniert über:

```text
nest start --watch
```

Da der Projektordner in den Container gemountet ist, erkennt NestJS Änderungen.

### Frontend
Hot Reload funktioniert über:

```text
vite --host 0.0.0.0
```

Die Variable `CHOKIDAR_USEPOLLING=true` hilft bei Dateiüberwachung in Docker auf manchen Systemen.

---

## Prisma Hinweise

### Prisma Schema Ort
```text
backend/prisma/schema.prisma
```

oder alternativ:
```text
backend/src/infrastructure/persistence/prisma/schema.prisma
```

Für das MVP wird empfohlen:

```text
backend/prisma/schema.prisma
```

weil Prisma dort standardmäßig gut funktioniert.

### Migrationen
```bash
docker compose exec backend npm run prisma:migrate
```

### Prisma Studio
Optionales Script:
```json
{
  "prisma:studio": "prisma studio --hostname 0.0.0.0 --port 5555"
}
```

Optionaler Aufruf:
```bash
docker compose exec backend npm run prisma:studio
```

---

## Optionaler pgAdmin Service

Dieser Service ist optional und nicht für Sprint 1 verpflichtend.

```yaml
  pgadmin:
    image: dpage/pgadmin4
    container_name: mlms-pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@mlms.local
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - '5050:80'
    depends_on:
      - postgres
    networks:
      - mlms-network
```

Dann erreichbar unter:

```text
http://localhost:5050
```

---

## Empfohlene lokale `.env`

```env
NODE_ENV=development

BACKEND_PORT=3000
FRONTEND_PORT=5173
API_PREFIX=api

POSTGRES_DB=mlms
POSTGRES_USER=mlms
POSTGRES_PASSWORD=mlms_secret
POSTGRES_PORT=5432

DATABASE_URL=postgresql://mlms:mlms_secret@postgres:5432/mlms

JWT_SECRET=super_secret_mlms_2026
JWT_EXPIRES_IN=1d
DEFAULT_LANGUAGE=FR
BCRYPT_ROUNDS=10

VITE_API_URL=http://localhost:3000/api
```

---

## Verbindungsregeln

### Frontend → Backend
Im Browser wird benutzt:

```text
http://localhost:3000/api
```

### Backend → DB
Im Container wird benutzt:

```text
postgresql://mlms:mlms_secret@postgres:5432/mlms
```

Wichtig:
- im Container niemals `localhost` für PostgreSQL verwenden
- immer den Service-Namen `postgres`

---

## Was nicht in Dockerfiles gehört

Nicht direkt hart codieren:
- echte Produktionspasswörter
- geheime Tokens
- produktive Domains
- produktive Zertifikate

---

## Produktionshinweis

Dieses Docker-Setup ist **für lokale Entwicklung** gedacht.

Für Produktion müssen später ergänzt werden:
- Multi-stage Builds
- Nginx oder Reverse Proxy
- HTTPS
- sichere Secrets
- Build ohne Dev Dependencies
- Monitoring
- Backup Strategy

Diese Dinge sind **nicht** Bestandteil dieses MVP Docker-Files.

---

## Standardbefehle für Entwickler

### Alles starten
```bash
docker compose up -d
```

### Alles stoppen
```bash
docker compose down
```

### Neu bauen
```bash
docker compose build --no-cache
```

### Backend Logs
```bash
docker compose logs -f backend
```

### Frontend Logs
```bash
docker compose logs -f frontend
```

### In Backend Shell
```bash
docker compose exec backend sh
```

### In Frontend Shell
```bash
docker compose exec frontend sh
```

### In DB Shell
```bash
docker compose exec postgres sh
```

---

## Erwartete erste Erfolgskriterien

Nach erfolgreichem Start sollen folgende Dinge funktionieren:

1. `docker compose ps` zeigt 3 laufende Container
2. `http://localhost:5173` lädt die React App
3. `http://localhost:3000/api` antwortet oder zeigt zumindest API Root
4. PostgreSQL ist erreichbar
5. Prisma Migrations laufen
6. Codeänderungen im Backend triggern Reload
7. Codeänderungen im Frontend triggern Reload

---

## Definition of Done

Dieses Docker-Dokument ist korrekt umgesetzt, wenn:

- `docker-compose.yml` existiert
- `backend/Dockerfile` existiert
- `frontend/Dockerfile` existiert
- `.env.example` existiert
- alle drei Services starten
- PostgreSQL Daten persistent sind
- Backend auf Port 3000 läuft
- Frontend auf Port 5173 läuft
- Volumes für Code-Mounting funktionieren
- lokale Entwicklung mit Hot Reload möglich ist

---

## Claude Code Prompt für dieses Docker-File

```text
LIES DIESES KOMPLETTE DOKUMENT 07-DOCKER.md.

Erstelle die komplette Docker-Entwicklungsumgebung exakt nach diesem Dokument.

WICHTIGE REGELN:
1. Erzeuge `docker-compose.yml` im Projekt-Root.
2. Erzeuge `backend/Dockerfile` und `frontend/Dockerfile`.
3. Erzeuge `.dockerignore` Dateien für Backend und Frontend.
4. Erzeuge `.env.example` im Root.
5. Nutze PostgreSQL, Backend und Frontend als drei Services.
6. Aktiviere Hot Reload für Backend und Frontend.
7. Nutze Volumes für den Quellcode.
8. Nutze den Service-Namen `postgres` für die DB-Verbindung.
9. Mache das Setup lauffähig für lokale Entwicklung.
10. Erzeuge zusätzlich den `Makefile` aus diesem Dokument.

Liefere:
- `.env.example`
- `docker-compose.yml`
- `backend/Dockerfile`
- `backend/.dockerignore`
- `frontend/Dockerfile`
- `frontend/.dockerignore`
- `Makefile`
```

---
