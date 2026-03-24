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
