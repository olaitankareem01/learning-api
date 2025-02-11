# 📚 Learning API

The **Learning API** is a NestJS-based service designed to manage **courses, topics, learner progress, and ranking**. This API enables **authentication, course and topic management, learner progress tracking, and ranking based on completion rates**.

## Table of Contents

- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Assumptions and Design Decisions](#assumptions-and-design-decisions)
- [API Endpoints](#api-endpoints)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v20.x or later)
- **npm** (v6.x or later)
- **NestJS CLI** (optional but recommended)
- **PostgreSQL** (if running without Docker)
- **Docker** (if using containerized setup)
- A code editor like **VSCode** (recommended)

### Installation

1. **Clone the repository**:
   ```sh
   git clone https://github.com/your-repo/learning-api.git
   ```
2. **Navigate to the project directory**:
   ```sh
   cd learning-api
   ```
3. **Install dependencies**:
   ```sh
   npm install
   ```
4. **Copy the `.env.example` file to `.env` and configure environment variables**:
   ```sh
   cp .env.example .env
   ```
   - Update the `.env` file with the appropriate database credentials, port numbers, and secrets.

---

## 🎯 Running the Application

### Running Locally

1. **Ensure PostgreSQL is running** and configured as per `.env`
2. **Start the application**:
   ```sh
   npm start
   ```
3. Open your browser and go to `http://localhost:3000/api` to access the API documentation.
4. you can login with the following credential: 
    *email*: `learning@yopmail.com`,
    *password*: `Learning2025!`

---

### Running with Docker

1. **Ensure Docker is installed** ([Download Docker](https://www.docker.com/))
2. **Run the application using Docker**:
   ```sh
   docker-compose up --build
   ```
   This will:
   - Start **PostgreSQL**
   - Build & run the **NestJS API**

3. Open your browser and go to `http://localhost:3000/api` to access the API.

---

## ✅ Running Tests

Jest is used for unit testing. Run the test suite with:

```sh
npm run test
```

To check coverage:

```sh
npm run test:cov
```

---

## 🔍 Assumptions and Design Decisions

### 1️⃣ Database Structure
- Uses **PostgreSQL** for persistent storage.
- Tables:
  - **Users** (Admin, Instructor, Learner)
  - **Courses**
  - **Topics**
  - **Progress Records**
  - **Learner Rankings**

### 2️⃣ Authentication & Authorization
- Uses **JWT-based authentication**.
- Role-based access control:
  - **Admin** → Manages users, courses, and topics.
  - **Teacher** → Adds topics and tracks learners.
  - **Learner** → Views courses and tracks progress.

### 3️⃣ Progress Tracking
- Tracks **completed topics** per learner.
- Learner ranking is determined by **percentage completion**.

---

## 📌 API Endpoints

### 🔐 Authentication
| Method  | Endpoint         | Description       | Auth Required |
|---------|-----------------|-------------------|--------------|
| `POST`  | `/auth/user/create`| create a user  | Yes (ADMIN OR SUPERADMIN)           |
| `POST`  | `/auth/login`   | Login & get token| No           |
| `POST`  | `/auth/roles`   | get system roles| Yes          |

---

### 📖 Courses & Topics
| Method  | Endpoint               | Description                   | Auth Required |
|---------|-----------------------|------------------------------|--------------|
| `GET`   | `/subjects`            | Get all courses              | Yes          |
| `GET`   | `/topics/subjects/:subjectId` | Get topics for a course| Yes      |
| `GET`   | `/topics/:id`         | Get topic details            | Yes          |
| `POST`  | `/topics`             | Create a new topic (Instructor) | Yes      |

---

### 📊 Progress Tracking & Ranking
| Method  | Endpoint                  | Description                        | Auth Required |
|---------|---------------------------|------------------------------------|--------------|
| `POST`  | `/progress`               | Mark a topic as completed         | Yes          |
| `GET`   | `/progress/rankings/:courseId`    | Get learner rankings for course  | Yes (Admin)  |

---

## 📦 Docker Setup

### Modify `.env` File

Ensure you have an `.env` file as specified in `.env.sample` file


### 📢 Notes
1. **Docker ensures you don’t need to install PostgreSQL manually**.
2. **Migrations should be created and run to reflect schema changes**.
3. **API endpoints are secured based on user roles**.

---
