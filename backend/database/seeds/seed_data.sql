-- =========================================
-- SEED DATA 
-- =========================================

-- =========================================
-- 1. SUPER ADMIN (NO TENANT)
-- =========================================

INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    NULL,
    'superadmin@system.com',
    '$2b$10$CwTycUXWue0Thq9StjUM0uJ8K9Y7R8k3sEJ7Y5YB9xD5XqK3Cq5bK',
    'System Super Admin',
    'super_admin',
    true,
    NOW(),
    NOW()
);

-- =========================================
-- 2. SAMPLE TENANT (DEMO COMPANY)
-- =========================================

INSERT INTO tenants (
    id,
    name,
    subdomain,
    status,
    subscription_plan,
    max_users,
    max_projects,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Demo Company',
    'demo',
    'active',
    'pro',
    10,
    10,
    NOW(),
    NOW()
);

-- =========================================
-- 3. TENANT ADMIN FOR DEMO COMPANY
-- =========================================

INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    t.id,
    'admin@demo.com',
    '$2b$10$CwTycUXWue0Thq9StjUM0uJ8K9Y7R8k3sEJ7Y5YB9xD5XqK3Cq5bK',
    'Demo Tenant Admin',
    'tenant_admin',
    true,
    NOW(),
    NOW()
FROM tenants t
WHERE t.subdomain = 'demo';

-- =========================================
-- 4. REGULAR USERS FOR DEMO COMPANY
-- =========================================

INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    t.id,
    'user1@demo.com',
    '$2b$10$CwTycUXWue0Thq9StjUM0uJ8K9Y7R8k3sEJ7Y5YB9xD5XqK3Cq5bK',
    'Demo User One',
    'user',
    true,
    NOW(),
    NOW()
FROM tenants t
WHERE t.subdomain = 'demo';

INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    t.id,
    'user2@demo.com',
    '$2b$10$CwTycUXWue0Thq9StjUM0uJ8K9Y7R8k3sEJ7Y5YB9xD5XqK3Cq5bK',
    'Demo User Two',
    'user',
    true,
    NOW(),
    NOW()
FROM tenants t
WHERE t.subdomain = 'demo';

-- =========================================
-- 5. SAMPLE PROJECTS FOR DEMO COMPANY
-- =========================================

INSERT INTO projects (
    id,
    tenant_id,
    name,
    description,
    status,
    created_by,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    t.id,
    'Demo Project Alpha',
    'First demo project',
    'active',
    u.id,
    NOW(),
    NOW()
FROM tenants t
JOIN users u ON u.tenant_id = t.id
WHERE t.subdomain = 'demo'
AND u.role = 'tenant_admin'
LIMIT 1;

INSERT INTO projects (
    id,
    tenant_id,
    name,
    description,
    status,
    created_by,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    t.id,
    'Demo Project Beta',
    'Second demo project',
    'active',
    u.id,
    NOW(),
    NOW()
FROM tenants t
JOIN users u ON u.tenant_id = t.id
WHERE t.subdomain = 'demo'
AND u.role = 'tenant_admin'
LIMIT 1;

-- =========================================
-- 6. SAMPLE TASKS (5 TASKS)
-- =========================================

INSERT INTO tasks (
    id,
    project_id,
    tenant_id,
    title,
    description,
    status,
    priority,
    assigned_to,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    p.id,
    p.tenant_id,
    'Setup project repository',
    'Initialize Git repository',
    'todo',
    'high',
    u.id,
    NOW(),
    NOW()
FROM projects p
JOIN users u ON u.tenant_id = p.tenant_id
WHERE u.role = 'user'
LIMIT 1;

INSERT INTO tasks (
    id,
    project_id,
    tenant_id,
    title,
    description,
    status,
    priority,
    assigned_to,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    p.id,
    p.tenant_id,
    'Design database schema',
    'Create ERD and tables',
    'in_progress',
    'medium',
    u.id,
    NOW(),
    NOW()
FROM projects p
JOIN users u ON u.tenant_id = p.tenant_id
WHERE u.role = 'user'
OFFSET 1 LIMIT 1;

INSERT INTO tasks (
    id,
    project_id,
    tenant_id,
    title,
    description,
    status,
    priority,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    p.id,
    p.tenant_id,
    'Implement authentication',
    'JWT based login system',
    'todo',
    'high',
    NOW(),
    NOW()
FROM projects p
LIMIT 1;

INSERT INTO tasks (
    id,
    project_id,
    tenant_id,
    title,
    description,
    status,
    priority,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    p.id,
    p.tenant_id,
    'Create frontend UI',
    'React dashboard',
    'todo',
    'medium',
    NOW(),
    NOW()
FROM projects p
OFFSET 1 LIMIT 1;

INSERT INTO tasks (
    id,
    project_id,
    tenant_id,
    title,
    description,
    status,
    priority,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    p.id,
    p.tenant_id,
    'Testing & QA',
    'Test core features',
    'todo',
    'low',
    NOW(),
    NOW()
FROM projects p
LIMIT 1;
