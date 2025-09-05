
---

# Student CRUD REST API

A simple RESTful API for managing student records, built with **Node.js**, **Express**, and **MySQL**.
Supports full CRUD operations, database migrations, environment-based configuration, unit testing, Docker setup, **Makefile automation**, **Vagrant provisioning**, and a Postman collection for easy API testing.

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
* **Makefile for automation (dev, Docker, Compose, CI/CD)**
* **Vagrant + Nginx load balancer deployment (simulated production)**

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
│   └── create_students_table.sql
├── tests/
│   └── student.test.js
├── .env
├── .gitignore
├── Makefile
├── Vagrantfile
├── provision.sh
├── nginx.conf
├── package.json
├── Dockerfile
├── docker-compose.yml
├── README.md
└── postman_collection.json
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/AyushV14/Students_devops
cd Students_devops
```

### 2. Install dependencies (optional for local run)

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

---

## Step 2: Run with Docker

See existing section in your README (still valid).
This covers: `docker build`, `docker run`, custom network, `.env` for containers.

---

## Step 3: Run with Docker Compose

One-command setup for API + DB.
Covered in your README with `make compose-*` targets.

---

## Step 4: Makefile Automation

All repetitive commands (npm, docker, docker-compose) are automated via the **Makefile**.

Some useful targets:

| Command                | Description                       |
| ---------------------- | --------------------------------- |
| `make run`             | Start the server (`npm start`)    |
| `make dev`             | Start server with nodemon for dev |
| `make test`            | Run unit tests (`npm test`)       |
| `make migrate`         | Run DB migrations locally         |
| `make docker-run-all`  | Run API + DB containers (Docker)  |
| `make compose-run-api` | Run API + DB with Docker Compose  |
| `make docker-stop-all` | Stop & remove containers          |

> The Makefile enables **consistent commands** across dev, Docker, and Compose.

---

## Step 5: Deploy on Vagrant (Bare Metal Simulation)

This simulates a **production-like environment** inside a VM.
It provisions Docker, runs containers, and sets up **Nginx for load balancing**.

### 1. Start the Vagrant VM

```bash
vagrant up
vagrant ssh
```

### 2. Provisioning

The VM is provisioned automatically via `provision.sh`.
It installs:

* Docker + Docker Compose
* MySQL container
* Two API containers
* Nginx container (load balancer)

### 3. Nginx Configuration

The `nginx.conf` is included in the repo.
It load balances across two API containers:

```
upstream api_servers {
    server students-api-1:3000;
    server students-api-2:3000;
}

server {
    listen 80;

    location / {
        proxy_pass http://api_servers;
    }
}
```

> API is accessible at: `http://localhost:8080` (from host machine).

### 4. Verify Deployment

* From host:

  ```bash
  curl http://localhost:8080/api/v1/healthcheck
  curl http://localhost:8080/api/v1/students
  ```
* You should get **200 OK** and valid JSON responses.
* Use Postman collection for further testing.

### 5. Test Load Balancing

Check Nginx is forwarding requests to both APIs:

```bash
docker logs students-api-1
docker logs students-api-2
```

You should see requests hitting both containers.

---

## Running Tests

Unit tests run locally or inside containers:

```bash
npm test
# or
make compose-test
```

---

## Notes

* `.vagrant/` folder should **not** be committed to GitHub.
* Only commit: `Vagrantfile`, `provision.sh`, `nginx.conf`.
* This repo covers **dev → docker → compose → prod simulation** in one workflow.

---

## License

MIT License

---

