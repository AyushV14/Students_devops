
---

# Student CRUD REST API

A simple RESTful API for managing student records, built with **Node.js**, **Express**, and **MySQL**.
Supports full CRUD operations, database migrations, environment-based configuration, unit testing, Docker setup, **Makefile automation**, **Vagrant provisioning**, **Kubernetes deployment with Helm**, and a Postman collection for easy API testing.

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
* One-command local development using Docker Compose
* **Makefile for automation (dev, Docker, Compose, CI/CD)**
* **Vagrant + Nginx load balancer deployment (simulated production)**
* **Kubernetes deployment using Helm charts**
* **Database migrations run automatically via init container in Kubernetes**
* Secrets injected via **Kubernetes Secret** or **External Secrets Operator (ESO)**
* Tested with **Minikube**; REST API is accessible via NodePort or port-forward
* **One-click deployment using ArgoCD** for GitOps workflow

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
├── helm/
│   ├── students-api/
│   │   ├── Chart.yaml
│   │   ├── values.yaml
│   │   └── templates/
│   └── mysql/
│       └── (community chart or copy)
├── k8s/
│   └── argocd/
│       └── students-api-app.yaml
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
└── postman\_collection.json

````

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/AyushV14/Students_devops
cd Students_devops
````

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

Build and run the API with Docker:

```bash
docker build -t students-api .
docker run --name students-api -p 3000:3000 --env-file .env students-api
```

Run MySQL container separately if needed:

```bash
docker run --name mysql -e MYSQL_ROOT_PASSWORD=<password> -e MYSQL_DATABASE=students -p 3306:3306 -d mysql:8
```

---

## Step 3: Run with Docker Compose

One-command setup for API + MySQL:

```bash
docker-compose up -d
```

Check logs:

```bash
docker-compose logs -f students-api
```

---

## Step 4: Makefile Automation

All repetitive commands are automated via the **Makefile**.

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

> The Makefile ensures **consistent commands** across development, Docker, and Compose.

---

## Step 5: Deploy on Vagrant (Bare Metal Simulation)

This simulates a **production-like environment** inside a VM.

### 1. Start the Vagrant VM

```bash
vagrant up
vagrant ssh
```

### 2. Provisioning

The VM is provisioned automatically via `provision.sh`. It installs:

* Docker + Docker Compose
* MySQL container
* Two API containers
* Nginx container (load balancer)

### 3. Nginx Configuration

The `nginx.conf` is included in the repo. It load balances across two API containers:

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

```bash
curl http://localhost:8080/api/v1/healthcheck
curl http://localhost:8080/api/v1/students
```

* You should get **200 OK** and valid JSON responses.
* Use Postman collection for further testing.

---

## Step 6: Deploy on Kubernetes using Helm Charts

We now deploy the **entire stack using Helm charts**.

### 1. Install Helm (if not installed)

```bash
brew install helm       # macOS
choco install kubernetes-helm  # Windows (Chocolatey)
```

### 2. Deploy MySQL via Helm

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm upgrade --install mysql bitnami/mysql -n student-api --create-namespace \
    --set auth.rootPassword=rootpassword,auth.database=students
```

### 3. Deploy Students API via Helm

```bash
helm upgrade --install students-api ./helm/students-api -n student-api
```

* The API deployment uses an **init container** to run migrations (`create_students_table.sql`) before starting the app.
* Secrets (`DB_PASSWORD`) are injected via **Kubernetes Secret**.

### 4. Verify Pods

```bash
kubectl get pods -n student-api
```

* MySQL pod should be **Running** first.
* Students API pod should complete the **init container successfully** and then start running.

### 5. Access API

API is exposed via NodePort or port-forward:

```bash
kubectl port-forward deployment/students-api 3000:3000 -n student-api
```

* Test endpoints in Postman or curl:

```bash
POST http://127.0.0.1:3000/api/v1/students
{
  "name": "John Doe",
  "age": 20,
  "email": "johndoe@example.com"
}

GET http://127.0.0.1:3000/api/v1/students
```

---

## Step 7: One-Click Deployment via ArgoCD

* ArgoCD watches your GitHub repository for changes.
* Helm charts in the repo are considered the **source of truth**.
* Image tags updated via CI pipeline are **automatically synced** by ArgoCD.
* Pods are scheduled on the `dependent_services` node.

### Verification

Below is a screenshot of ArgoCD UI showing all pods **running and healthy**:

![ArgoCD UI](<img width="1897" height="883" alt="image" src="https://github.com/user-attachments/assets/3ff1c88f-debb-4a54-8631-1ee2a63a4e04" />
)

* You should see **students-api** and **MySQL** pods deployed correctly.
* ArgoCD automatically handles updates when the `values.yaml` tag changes.

---

## Step 8: Running Tests

Run unit tests locally or inside containers:

```bash
npm test
# or
make compose-test
```

---

## Notes

* Only commit the `helm/` folder, `Vagrantfile`, `provision.sh`, `nginx.conf`, and ArgoCD manifests (`k8s/argocd/`).
* Secrets in Helm/Minikube use dummy passwords—replace with real credentials for production.
* This setup covers **dev → Docker → Compose → Vagrant → Helm/Kubernetes → ArgoCD** workflow.
* The API now works correctly because we fixed:

  * **DB connection and password issues**
  * **Init container for migrations**
  * **Helm values & secret injection**
  * **ArgoCD auto-sync and node affinity**

---

## License

MIT License

---
