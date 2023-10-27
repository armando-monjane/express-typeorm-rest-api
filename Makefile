BACKEND_CONTAINER_NAME=backend
TEST_BACKEND_CONTAINER_NAME=backend-it
DB_CONTAINER_NAME=pg-server
ADMINER_CONTAINER_NAME=adminer
DOCKER_COMPOSE_ARGS=

migrate:
	@echo "Migrating database..."
	@docker-compose exec ${BACKEND_CONTAINER_NAME} npm run migrate

up:
	@echo "Starting containers..."
	@docker-compose up ${BACKEND_CONTAINER_NAME}

up-silent:
	@echo "Starting containers..."
	@docker-compose up -d ${BACKEND_CONTAINER_NAME}

down:
	@echo "Stopping containers..."
	@docker-compose down

build:
	@echo "Building containers..."
	@docker-compose build

up-db:
	@echo "Starting database..."
	@docker-compose up -d ${DB_CONTAINER_NAME}

up-admin:
	@echo "Starting adminer..."
	@docker-compose up -d ${ADMINER_CONTAINER_NAME} adminer

db-migrate:
	@echo "Migrating database..."
	@docker-compose ${DOCKER_COMPOSE_ARGS} run --rm ${BACKEND_CONTAINER_NAME} npm run migrate

test:
	@echo "Running tests..."
	@docker-compose ${DOCKER_COMPOSE_ARGS} run --rm -T ${TEST_BACKEND_CONTAINER_NAME}