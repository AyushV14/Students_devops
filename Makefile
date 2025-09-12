# =============================
# Local Development Targets
# =============================
# Run the server normally
run:
	npm start

# Run server with nodemon for development
dev:
	npx nodemon src/index.js

# Run unit tests locally
test:
	npm test

# Run linter (ESLint) with legacy config support
lint:
	set ESLINT_USE_FLAT_CONFIG=false && npx eslint src --ext .js

# Run database migrations locally
migrate:
	mysql -u $(DB_USER) -p$(DB_PASSWORD) -h $(DB_HOST) $(DB_NAME) < migrations/create_students_table.sql

# =============================
# Docker Targets (Step 2)
# =============================
# Build the API Docker image (versioned)
docker-build-api:
	docker build -t students-api:1.0.0 .

# Create a Docker network for containers (if not exists)
docker-network:
	docker network create students-network || true

# Run MySQL container
docker-run-db:
	docker run -d --name students-mysql --network students-network \
	-e "MYSQL_ROOT_PASSWORD=avv@2004" \
	-e "MYSQL_DATABASE=students_db" \
	-p 3307:3306 mysql:8

# Run API container
docker-run-api:
	docker run -d --name students-api --network students-network \
	--env-file .env -p 3000:3000 students-api:1.0.0

# Stop & remove API and MySQL containers
docker-stop-all:
	docker stop students-api students-mysql || true
	docker rm students-api students-mysql || true

# Rebuild API image and restart API container
docker-restart-api: docker-stop-all docker-build-api docker-run-api

# Convenience: run DB and API together
docker-run-all: docker-network docker-run-db docker-run-api

# =============================
# Step 3 - Docker Compose Targets
# =============================
# Start DB using docker-compose
compose-db:
	docker-compose up -d db

# Run DB migrations
compose-migrate:
	docker exec -i students-mysql sh -c 'mysql -u $$DB_USER -p"$$DB_PASSWORD" $$DB_NAME' < migrations/create_students_table.sql

# Build API image
compose-build-api:
	docker-compose build api

# Start API container (ensures DB is up and migrations applied)
compose-run-api: compose-db compose-migrate compose-build-api
	docker-compose up -d api

# Stop all containers
compose-stop-all:
	docker-compose down

# Optional: Restart all services
compose-restart-all: compose-stop-all compose-run-api

# =============================
# Step 4 - CI/CD Targets
# =============================
# Debug: Check what files are in the container
compose-debug:
	docker-compose run --rm api sh -c "ls -la && ls -la tests/ || echo 'tests directory not found'"

# Run tests inside the API container (CI-safe)
compose-test:
	docker-compose down -v || true
	docker build --target development -t students-api-dev .
	docker run --rm --network students_devops_app-network \
	-e DB_USER=$$DB_USER -e DB_PASSWORD=$$DB_PASSWORD -e DB_NAME=$$DB_NAME \
	students-api-dev npm test
	docker-compose down -v || true

# Run lint inside the API container (CI-safe)
compose-lint:
	docker-compose run --rm api sh -c "ESLINT_USE_FLAT_CONFIG=false npx eslint src --ext .js"

# =============================
# Step 4 - Docker Image for CI/CD (Versioned)
# =============================
# Build Docker image for pushing to registry with dynamic tag
docker-build:
	docker build -t $(DOCKER_USERNAME)/students-api:$(IMAGE_TAG) .

# Push Docker image to registry with dynamic tag
docker-push:
	docker push $(DOCKER_USERNAME)/students-api:$(IMAGE_TAG)
