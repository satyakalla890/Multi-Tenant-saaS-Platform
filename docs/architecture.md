# System Architecture Design
## Multitenant SaaS Platform

---

## 1. System Architecture Overview

This section describes the high-level system architecture of the Multitenant SaaS platform. The architecture follows a standard three-tier model consisting of a client layer, application layer, and data layer, with secure authentication and strict tenant isolation.

---

## 1.1 High-Level Architecture Description

The system consists of the following components:

- **Client (Browser):**  
  End users access the system through a web browser.

- **Frontend Application:**  
  A React-based single-page application responsible for user interaction, UI rendering, and API communication.

- **Backend API Server:**  
  A Node.js and Express-based REST API server that handles authentication, authorization, business logic, and tenant isolation.

- **Database:**  
  PostgreSQL database that stores tenant, user, project, task, and audit log data.

- **Authentication Flow:**  
  JWT-based authentication is used to secure API access and enforce role-based authorization.

---

## 1.2 System Architecture Diagram

The following diagram represents the high-level architecture and data flow of the system:

- Client interacts with the Frontend Application
- Frontend communicates with Backend APIs using HTTP/HTTPS
- Backend validates JWT tokens and enforces RBAC
- Backend accesses the database with tenant-scoped queries

📌 **Diagram File Location:**  
`docs/images/system-architecture.png`

---

## 2. Database Schema Design

This section describes the database structure and entity relationships used in the system.

---

## 2.1 Entities Overview

The database schema consists of the following main entities:

- Tenant
- User
- Project
- Task
- AuditLog

Each tenant represents an organization, and all related data is strictly isolated using `tenant_id`.

---

## 2.2 Entity Relationship Description

### Tenant
- Primary entity representing an organization
- One tenant can have multiple users and projects

### User
- Belongs to a single tenant (except Super Admin)
- Contains role information for authorization
- References `tenant_id` for isolation

### Project
- Belongs to a tenant
- Can have multiple tasks
- References `tenant_id` indirectly via tenant relationship

### Task
- Belongs to a project
- Used to track work items

### AuditLog
- Stores system activity records
- References user and tenant (if applicable)

---

## 2.3 Tenant Isolation Strategy

- All tenant-specific tables contain a `tenant_id` column
- `tenant_id` is used as a foreign key where applicable
- Queries are always scoped using `tenant_id`
- Tenant ID is derived from authenticated JWT tokens

---

## 2.4 Entity Relationship Diagram (ERD)

The ERD illustrates:
- Table relationships
- Foreign key constraints
- Tenant-based isolation using `tenant_id`

📌 **Diagram File Location:**  
`docs/images/database-erd.png`

---

## 3. API Architecture

This section lists all major API endpoints exposed by the backend, organized by module. Authentication and role-based access are enforced at the API level.

---

## 3.1 Authentication APIs

| Endpoint | Method | Authentication | Role |
|--------|--------|---------------|------|
| /api/auth/register-tenant | POST | No | Public |
| /api/auth/login | POST | No | Public |
| /api/auth/me | GET | Yes | All |
| /api/auth/logout | POST | Yes | All |

---

## 3.2 Tenant Management APIs

| Endpoint | Method | Authentication | Role |
|--------|--------|---------------|------|
| /api/tenants | GET | Yes | Super Admin |
| /api/tenants/:id | GET | Yes | Super Admin |
| /api/tenants/:id | PUT | Yes | Super Admin |

---

## 3.3 User Management APIs

| Endpoint | Method | Authentication | Role |
|--------|--------|---------------|------|
| /api/users | POST | Yes | Tenant Admin |
| /api/users | GET | Yes | Tenant Admin |
| /api/users/:id | PUT | Yes | Tenant Admin |
| /api/users/:id | DELETE | Yes | Tenant Admin |

---

## 3.4 Project Management APIs

| Endpoint | Method | Authentication | Role |
|--------|--------|---------------|------|
| /api/projects | POST | Yes | Tenant Admin |
| /api/projects | GET | Yes | Tenant Admin, User |
| /api/projects/:id | PUT | Yes | Tenant Admin |
| /api/projects/:id | DELETE | Yes | Tenant Admin |

---

## 3.5 Task Management APIs

| Endpoint | Method | Authentication | Role |
|--------|--------|---------------|------|
| /api/projects/:id/tasks | POST | Yes | Tenant Admin |
| /api/projects/:id/tasks | GET | Yes | Tenant Admin, User |
| /api/tasks/:id | PUT | Yes | Tenant Admin, User |
| /api/tasks/:id/status | PUT | Yes | Tenant Admin, User |

---
