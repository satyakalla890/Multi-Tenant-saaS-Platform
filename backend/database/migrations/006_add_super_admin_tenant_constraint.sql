-- Allow super_admin users to have NULL tenant_id
-- Enforce tenant_id for all other roles

ALTER TABLE users
ALTER COLUMN tenant_id DROP NOT NULL;

ALTER TABLE users
ADD CONSTRAINT chk_super_admin_tenant
CHECK (
    (role = 'super_admin' AND tenant_id IS NULL)
    OR
    (role <> 'super_admin' AND tenant_id IS NOT NULL)
);
