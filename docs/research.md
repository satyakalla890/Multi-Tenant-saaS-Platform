# Research & System Design – Multitenant SaaS

---

## 1. Multi-Tenancy Analysis

Multi-tenancy is a core architectural concept in Software as a Service (SaaS) applications where a single application instance serves multiple tenants (organizations) while ensuring strict data isolation and security. Choosing the correct multi-tenancy approach is critical for scalability, cost efficiency, security, and long-term maintainability.

This section analyzes three commonly used multi-tenancy models and compares them based on scalability, cost, complexity, and security.

---

## 1.1 Multi-Tenancy Approaches

### 1. Shared Database + Shared Schema (Tenant ID Based)

In this approach, all tenants share the same database and the same schema. Each table contains a `tenant_id` column, which is used to identify and isolate tenant-specific data.

#### How it works
- One database  
- One schema  
- Every table includes a `tenant_id`  
- Application-level logic enforces tenant isolation  

#### Pros
- Very cost-effective since only one database is required  
- Easy to manage database migrations  
- Scales well for a large number of tenants  
- Efficient resource utilization  
- Simple DevOps setup  

#### Cons
- Higher risk if tenant isolation logic is flawed  
- Requires strict validation in every database query  
- Harder to provide per-tenant database tuning  
- Regulatory compliance can be challenging for sensitive data  

---

### 2. Shared Database + Separate Schema (Schema per Tenant)

In this approach, all tenants share the same database instance, but each tenant has its own database schema.

#### How it works
- One database  
- Multiple schemas (one per tenant)  
- Each schema contains its own set of tables  

#### Pros
- Better data isolation compared to shared schema  
- Easier to back up or restore data per tenant  
- Reduced risk of cross-tenant data access  
- Logical separation improves security  

#### Cons
- Schema management becomes complex with many tenants  
- Database migrations must be applied to all schemas  
- Limited scalability when tenant count increases  
- Still shares database-level resources  

---

### 3. Separate Database per Tenant

In this approach, each tenant is assigned a completely separate database.

#### How it works
- Multiple databases  
- One database per tenant  
- Full physical isolation  

#### Pros
- Strongest data isolation  
- Simplifies regulatory and compliance requirements  
- Independent scaling per tenant  
- Easier tenant-specific backups and restores  

#### Cons
- Very high infrastructure and maintenance cost  
- Complex database provisioning  
- Difficult to manage schema migrations  
- Not scalable for small or mid-sized SaaS platforms  

---

## 1.2 Comparison Table

| Criteria | Shared DB + Shared Schema | Shared DB + Separate Schema | Separate DB per Tenant |
|--------|---------------------------|-----------------------------|------------------------|
| Cost | Low | Medium | High |
| Scalability | High | Medium | Low |
| Data Isolation | Medium | High | Very High |
| Maintenance | Easy | Moderate | Complex |
| Performance | Good | Good | Excellent |
| Compliance | Harder | Moderate | Easy |

---

## 1.3 Chosen Approach & Justification

For this project, the **Shared Database + Shared Schema with tenant_id** approach is selected.

### Justification
- Best balance between scalability and cost  
- Suitable for early-stage and mid-scale SaaS platforms  
- Easy to implement within project constraints  
- Simplifies Docker-based deployment  
- Aligns with evaluation requirements and automation  
- Ensures strict tenant isolation through JWT-based tenant identification  

Tenant isolation is enforced at the application layer, ensuring every query is scoped using `tenant_id` derived from the authenticated user context.

This approach is widely adopted by scalable SaaS platforms such as Shopify and Atlassian.

---

## 2. Technology Stack Justification

Selecting the right technology stack is critical to ensure performance, scalability, maintainability, and security of the SaaS platform.

---

### 2.1 Backend Framework – Node.js with Express

**Chosen Technology:** Node.js with Express.js  

#### Reasons
- Lightweight and fast for REST APIs  
- Non-blocking I/O for high concurrency  
- Large ecosystem and community support  
- Easy integration with JWT and PostgreSQL  
- Simple to containerize using Docker  

#### Alternatives Considered
- Django (Python) – heavier framework  
- Spring Boot (Java) – higher complexity  
- FastAPI – newer ecosystem  

Express was chosen due to its simplicity and faster development speed.

---

### 2.2 Frontend Framework – React.js

**Chosen Technology:** React.js (Vite)  

#### Reasons
- Component-based architecture  
- Fast rendering using virtual DOM  
- Strong ecosystem and tooling  
- Easy role-based UI rendering  
- Works efficiently with REST APIs  

#### Alternatives Considered
- Angular – steeper learning curve  
- Vue.js – smaller ecosystem  

React was selected for its flexibility and industry adoption.

---

### 2.3 Database – PostgreSQL

**Chosen Technology:** PostgreSQL  

#### Reasons
- Strong relational integrity  
- Excellent performance  
- Native JSON support  
- Works seamlessly with Prisma ORM  
- Open-source and production-ready  

#### Alternatives Considered
- MySQL  
- MongoDB (not ideal for relational data)  

---

### 2.4 Authentication – JWT (JSON Web Tokens)

**Chosen Technology:** JWT  

#### Reasons
- Stateless authentication  
- Scales well for distributed systems  
- Easy embedding of role and tenant data  
- Industry standard security mechanism  

#### Alternatives Considered
- Session-based authentication  
- OAuth (overkill for project scope)  

---

### 2.5 Deployment – Docker & Docker Compose

**Chosen Technology:** Docker  

#### Reasons
- Consistent development and production environments  
- One-command deployment  
- Simplifies evaluation and setup  
- Easy service orchestration  

#### Alternatives Considered
- Manual deployment  
- Kubernetes (too complex for project scope)  

---

## 3. Security Considerations in Multi-Tenant Systems

Security is a critical aspect of any multi-tenant SaaS platform due to shared infrastructure and the risk of data leakage.

---

### 3.1 Security Measures Implemented

- **Tenant-Based Data Isolation**  
  All data access is filtered using `tenant_id` derived from authenticated JWT tokens.

- **JWT Authentication**  
  Stateless authentication with token expiration ensures secure session management.

- **Role-Based Access Control (RBAC)**  
  Access is restricted based on roles such as `super_admin`, `tenant_admin`, and `user`.

- **Password Hashing**  
  Passwords are hashed using bcrypt before storage, preventing plaintext exposure.

- **Audit Logging**  
  All critical actions are logged for traceability and security auditing.

---

### 3.2 Data Isolation Strategy
Tenant isolation is enforced at:
- API level  
- Database query level  
- Authorization middleware  

Tenant ID is never accepted from the client request body.

---

### 3.3 Authentication & Authorization Approach
- JWT tokens include role and tenant ID  
- Tokens are verified on every request  
- Authorization checks are applied at route level  

---

### 3.4 Password Hashing Strategy
- bcrypt hashing with salt  
- No plaintext password storage  
- Secure comparison during login  

---

### 3.5 API Security Measures
- Input validation  
- Authorization middleware  
- Proper HTTP status-based error handling  
- Protected routes  
- CORS configuration  

---
