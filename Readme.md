
# Student CRUD REST API

A simple RESTful API for managing student records, built with **Node.js**, **Express**, and **MySQL**.  
Supports full CRUD operations, database migrations, environment-based configuration, unit testing, Docker setup, and a Postman collection for easy API testing.

---

## Features

* Add, read, update, and delete student records
* Database migrations for easy table creation
* API versioning (`/api/v1/students`)
* Healthcheck endpoint (`/api/v1/healthcheck`)
* Unit tests for all endpoints using **Jest** and **Supertest**
* Postman collection included for testing
* Configuration through environment variables (`.env`)
* Docker support for API and MySQL
* One-click local development using Docker Compose

---

## Project Structure

```

student-api/
├── src/
│   ├── routes/
│   │   └── studentRoutes.js
│   ├── controllers/
│   │   └── studentController.js
│   ├── models/
│   │   └── studentModel.js
│   ├── config/
│   │   └── db.js
│   └── index.js
├── migrations/
│   └── create\_students\_table.sql
├── tests/
│   └── student.test.js
├── .env
├── .gitignore
├── Makefile
├── package.json
├── Dockerfile
├── docker-compose.yml
├── README.md
└── postman\_collection.json

````

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/AyushV14/Students_devops
cd Students_devops
````

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file at the root:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<your_password>
DB_NAME=students_db
PORT=3000
```

> Make sure `.env` is added to `.gitignore` to keep credentials safe.

### 4. Run database migrations (optional without Docker)

Create the database if it doesn’t exist, then run:

```bash
mysql -u <DB_USER> -p -h <DB_HOST> <DB_NAME> < migrations/create_students_table.sql
```

Or, using the Makefile:

```bash
make migrate
```

---

## Docker Setup (Step 2)

You can also run the API and MySQL database using Docker.

### 1. Create a Docker network

```bash
docker network create students-network
```

### 2. Run the MySQL container

```bash
docker run -d \
  --name students-mysql \
  --network students-network \
  -e "MYSQL_ROOT_PASSWORD=<your_password>" \
  -e "MYSQL_DATABASE=students_db" \
  -p 3307:3306 \
  mysql:8
```

> Replace `<your_password>` with your MySQL root password.

### 3. Update `.env` for Docker

```
DB_HOST=students-mysql
DB_USER=root
DB_PASSWORD=<your_password>
DB_NAME=students_db
PORT=3000
```

### 4. Build the API Docker image

```bash
docker build -t students-api:1.0.0 .
```

### 5. Run the API container

```bash
docker run -d \
  --name students-api \
  --network students-network \
  --env-file .env \
  -p 3000:3000 \
  students-api:1.0.0
```

> API will be accessible at `http://localhost:3000`. Both containers communicate over `students-network`.

---

## Docker Compose Setup (Step 3 – One-click local development)

With Docker Compose, you can start the database, apply migrations, and run the API in one place.

1. **Start only the DB service**:

```bash
make compose-db
```

2. **Run database migrations**:

```bash
make compose-migrate
```

3. **Build the API image**:

```bash
make compose-build-api
```

4. **Start the API container (with DB dependency)**:

```bash
make compose-run-api
```

> This target ensures the DB is running, migrations are applied, and the API container is started.
> The API is accessible at: `http://localhost:3000`.

5. **Stop all services**:

```bash
make compose-stop-all
```

> Stops and removes all containers and networks created by Docker Compose.

---

## API Endpoints

| Method | Endpoint              | Description                | Body (JSON)                                                                 |
| ------ | --------------------- | -------------------------- | --------------------------------------------------------------------------- |
| GET    | /api/v1/healthcheck   | Check server status        | -                                                                           |
| POST   | /api/v1/students      | Add a new student          | `{ "name": "John", "age": 20, "email": "john@example.com" }`                |
| GET    | /api/v1/students      | Get all students           | -                                                                           |
| GET    | /api/v1/students/\:id | Get a student by ID        | -                                                                           |
| PUT    | /api/v1/students/\:id | Update student information | `{ "name": "John Updated", "age": 21, "email": "johnupdated@example.com" }` |
| DELETE | /api/v1/students/\:id | Delete a student           | -                                                                           |

> You can import `postman_collection.json` in Postman to test all endpoints.

---

## Running Tests

Unit tests are written using **Jest** and **Supertest**:

```bash
npm test
```

Tests cover:

* CRUD endpoints
* Healthcheck endpoint
* Edge cases like non-existent student IDs

---

## Makefile Commands

| Command                  | Description                            |
| ------------------------ | -------------------------------------- |
| `make run`               | Start the server (`npm start`)         |
| `make dev`               | Start server with nodemon for dev      |
| `make test`              | Run unit tests (`npm test`)            |
| `make migrate`           | Run database migrations                |
| `make docker-build-api`  | Build Docker image for API             |
| `make docker-run-api`    | Run API Docker container               |
| `make docker-run-db`     | Run MySQL Docker container             |
| `make docker-run-all`    | Run API + DB containers together       |
| `make docker-stop-all`   | Stop & remove API + DB containers      |
| `make compose-db`        | Start DB service via Docker Compose    |
| `make compose-migrate`   | Apply DB migrations via Docker Compose |
| `make compose-build-api` | Build API service via Docker Compose   |
| `make compose-run-api`   | Run API service via Docker Compose     |
| `make compose-stop-all`  | Stop all services via Docker Compose   |

---

## Notes

* API uses proper HTTP verbs for CRUD operations.
* Configuration values (DB, port) are read from environment variables.
* Healthcheck endpoint is useful for monitoring the API server.
* Logs are emitted for server start and DB connection.
* Docker setup isolates the API and DB for easy deployment.
* Docker Compose simplifies one-command local development and service orchestration.

---

## License

MIT License


