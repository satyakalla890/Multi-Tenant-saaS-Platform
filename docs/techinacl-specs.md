# Technical Specification - Multitenant SaaS Platform

---

## 1. Project Structure

This section defines the complete folder structure for both backend and frontend components of the Multitenant SaaS platform and explains the purpose of each major folder.

---

### 1.1 Backend Project Structure

backend/
├── prisma/
│ ├── schema.prisma
│ ├── migrations/
│
├── src/
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ ├── services/
│ ├── config/
│ ├── utils/
│ ├── tests/
│ ├── app.js
│ └── server.js
│
├── .env
├── package.json
├── Dockerfile
└── README.md

#### Backend Folder Descriptions

- **prisma/**  
  Contains Prisma ORM configuration, database schema, and migration files.

- **prisma/schema.prisma**  
  Defines database models such as Tenant, User, Project, Task, and AuditLog.

- **prisma/migrations/**  
  Stores database migration history.

- **src/**  
  Main application source code directory.

- **src/controllers/**  
  Contains request-handling logic for APIs such as authentication, tenant, user, project, and task management.

- **src/routes/**  
  Defines API routes and maps them to corresponding controllers.

- **src/middleware/**  
  Contains middleware for authentication, authorization, tenant isolation, and request validation.

- **src/services/**  
  Holds business logic and reusable service-layer functions.

- **src/config/**  
  Stores configuration files such as database connection and environment configuration.

- **src/utils/**  
  Utility functions such as JWT helpers, password hashing, and response formatting.

- **src/tests/**  
  Contains unit and integration test files.

- **src/app.js**  
  Initializes the Express application and middleware.

- **src/server.js**  
  Entry point of the backend application.

---

### 1.2 Frontend Project Structure

frontend/
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ ├── routes/
│ ├── context/
│ ├── utils/
│ ├── App.jsx
│ └── main.jsx
│
├── public/
├── .env
├── package.json
├── Dockerfile
└── README.md

#### Frontend Folder Descriptions

- **src/**  
  Main source directory for the React application.

- **src/components/**  
  Reusable UI components such as Navbar, Sidebar, and common UI elements.

- **src/pages/**  
  Page-level components including Login, Dashboard, Users, Projects, and Tasks.

- **src/services/**  
  API service files for communicating with backend APIs using Axios.

- **src/routes/**  
  Defines application routes and protected routing logic.

- **src/context/**  
  Contains global state management logic such as authentication context.

- **src/utils/**  
  Utility functions for token handling, role checks, and helpers.

- **src/App.jsx**  
  Root React component defining routes and layout structure.

- **src/main.jsx**  
  Entry point of the frontend application.

---

## 2. Development Setup Guide

This section explains how to set up, configure, and run the project locally.

---

### 2.1 Prerequisites

Ensure the following software is installed on the system:

- **Node.js:** Version 18 or higher  
- **npm:** Version 9 or higher  
- **Docker:** Version 20 or higher  
- **Docker Compose:** Version 2 or higher  
- **Git:** Latest version  

---

### 2.2 Environment Variables

#### Backend Environment Variables (`backend/.env`)

DATABASE_URL=postgresql://postgres:postgres@database:5432/saas

JWT_SECRET=supersecretkey

PORT=5000

#### Frontend Environment Variables (`frontend/.env`)

VITE_API_URL=http://localhost:5000/api

---

### 2.3 Installation Steps

1. Clone the repository:

git clone <repository-url>

cd task5-multitenant-saas

2. Install backend dependencies:

cd backend

npm install

3. Install frontend dependencies:

cd ../frontend

npm install

---

### 2.4 Running the Application Locally

#### Using Docker (Recommended)

From the project root directory:

docker-compose up -d

## This command starts:
- PostgreSQL database
- Backend API server
- Frontend React application

---

#### Running Without Docker (Optional)

1. Start the backend server:

cd backend

npm run dev


2. Start the frontend application:

cd frontend

npm run dev

---

### 2.5 Running Database Migrations

cd backend

npx prisma migrate dev

---

### 2.6 Running Tests

#### Backend Tests

cd backend

npm test

#### Frontend Tests

cd frontend

npm test

---

## End of Technical Specification
