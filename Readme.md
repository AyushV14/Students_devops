
# Student CRUD REST API

A simple RESTful API for managing student records, built with **Node.js**, **Express**, and **MySQL**.  
Supports full CRUD operations, database migrations, environment-based configuration, unit testing, and a Postman collection for easy API testing.

---

## Features

- Add, read, update, and delete student records
- Database migrations for easy table creation
- API versioning (`/api/v1/students`)
- Healthcheck endpoint (`/api/v1/healthcheck`)
- Unit tests for all endpoints using **Jest** and **Supertest**
- Postman collection included for testing
- Configuration through environment variables (`.env`)

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
├── README.md
└── postman\_collection.json

````

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd students
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
DB_PASSWORD=your_password
DB_NAME=students_db
PORT=3000
```

> Make sure `.env` is added to `.gitignore` to keep your credentials safe.

### 4. Run database migrations

Create the database if it doesn’t exist, then run:

```bash
mysql -u <DB_USER> -p -h <DB_HOST> <DB_NAME> < migrations/create_students_table.sql
```

Or, using the Makefile:

```bash
make migrate
```

### 5. Start the server

```bash
npm start
```

Server will run at: `http://localhost:3000`

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

> You can also import the included `postman_collection.json` in Postman to test all endpoints.

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

| Command        | Description                       |
| -------------- | --------------------------------- |
| `make run`     | Start the server (`npm start`)    |
| `make dev`     | Start server with nodemon for dev |
| `make test`    | Run unit tests (`npm test`)       |
| `make migrate` | Run database migrations           |

---

## Notes

* API uses proper HTTP verbs for CRUD operations.
* Configuration values (DB, port) are read from environment variables.
* Healthcheck endpoint is useful for monitoring the API server.
* Logs are emitted for server start and DB connection.

---

## License

MIT License

