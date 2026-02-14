.PHONY: up down build logs restart

up:
	docker compose up --build

down:
	docker compose down

build:
	docker compose build --no-cache

logs:
	docker compose logs -f

restart: down up
