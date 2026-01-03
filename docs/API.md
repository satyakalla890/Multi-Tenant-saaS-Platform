## API Documentation – SaaS Platform

**Base URL:** http://localhost:5000

---

## Authentication Overview

Authentication is handled using JWT (JSON Web Tokens)

1. After login, the backend returns a token

2. Token must be sent in the Authorization header:

**Header Format:**
` Authorization: Bearer <JWT_TOKEN> `
---

## APIs marked Auth Required: Yes require this header

1. Health Check
**GET /api/health**

- Auth Required: No

**Response**

`{
  "status": "ok"
}`

2. Register Tenant (Organization)
- POST /api/auth/register-tenant

- Auth Required: No

**Request Body**`{
  "tenantName": "Demo Org",
  "subdomain": "demo",
  "adminEmail": "admin@demo.com",
  "adminPassword": "Admin@123",
  "adminFullName": "Demo Admin"
}`


**Response**

`{
  "message": "Tenant registered successfully"
}`

3. Login
- POST /api/auth/login

- Auth Required: No

**Request Body**

`{
  "email": "admin@demo.com",
  "password": "Admin@123"
}`


**Response**

`{
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "admin@demo.com",
    "role": "tenant_admin"
  }
}`

4. Get Current User
- GET /api/auth/me

- Auth Required: Yes

**Response**

`{
  "id": "uuid",
  "email": "admin@demo.com",
  "role": "tenant_admin"
}`

5. Create Project
- POST /api/projects

- Auth Required: Yes

**Request Body**

`{
  "name": "Demo Project"
}`


**Response**

`{
  "id": "uuid",
  "name": "Demo Project",
  "status": "active"
}`

6. Get All Projects
- GET /api/projects

- Auth Required: Yes

**Response**

`[
  {
    "id": "uuid",
    "name": "Demo Project",
    "status": "active"
  }
]`

7. Get Project By ID
- GET /api/projects/:id

- Auth Required: Yes

**Response**

`{
  "id": "uuid",
  "name": "Demo Project",
  "status": "active"
}`

8. Update Project
- PUT /api/projects/:id

- Auth Required: Yes

**Request Body**

`{
  "name": "Updated Project"
}`


**Response**

`{
  "message": "Project updated successfully"
}`

9. Delete Project
- DELETE /api/projects/:id

- Auth Required: Yes

**Response**

`{
  "message": "Project deleted successfully"
}`

10. Create Task
- POST /api/tasks

- Auth Required: Yes

**Request Body**

`{
  "title": "Initial Task",
  "projectId": "uuid",
  "priority": "medium"
}`


**Response**

`{
  "id": "uuid",
  "title": "Initial Task",
  "status": "todo"
}`

11. Get All Tasks
- GET /api/tasks

- Auth Required: Yes

**Response**

`[
  {
    "id": "uuid",
    "title": "Initial Task",
    "status": "todo"
  }
]`

12. Get Task By ID
- GET /api/tasks/:id

- Auth Required: Yes

**Response**

`{
  "id": "uuid",
  "title": "Initial Task",
  "status": "todo"
}`

13. Update Task
- PUT /api/tasks/:id

- Auth Required: Yes

**Request Body**

`{
  "status": "completed",
  "priority": "high"
}`


**Response**

`{
  "message": "Task updated successfully"
}`

14. Delete Task
- DELETE /api/tasks/:id
- Auth Required: Yes

**Response**

`{
  "message": "Task deleted successfully"
}`

15. Get Users (Tenant)
- GET /api/users

- Auth Required: Yes (Tenant Admin)

**Response**

`[
  {
    "id": "uuid",
    "email": "user@demo.com",
    "role": "user"
  }
]`

16. Create User
- POST /api/users

- Auth Required: Yes (Tenant Admin)

**Request Body**

`{
  "email": "newuser@demo.com",
  "password": "User@123",
  "fullName": "New User",
  "role": "user"
}`

**Response**

`{
  "message": "User created successfully"
}`

17. Update User Role
- PUT /api/users/:id

- Auth Required: Yes (Tenant Admin)

**Request Body**

`{
  "role": "tenant_admin"
}`


**Response**

`{
  "message": "User updated successfully"
}`

18. Delete User
- DELETE /api/users/:id

- Auth Required: Yes (Tenant Admin)

**Response**

`{
  "message": "User deleted successfully"
}`

19. Get Audit Logs
- GET /api/audit-logs

- Auth Required: Yes (Super Admin / Tenant Admin)

**Response**

`[
  {
    "id": "uuid",
    "action": "CREATE_PROJECT",
    "created_at": "2025-01-01T10:00:00Z"
  }
]`
