-- Allow super_admin users to have NULL tenant_id
-- Enforce tenant_id for all other roles

ALTER TABLE users
ALTER COLUMN tenant_id DROP NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_super_admin_tenant') THEN
        ALTER TABLE users
        ADD CONSTRAINT chk_super_admin_tenant
        CHECK (
            (role = 'super_admin' AND tenant_id IS NULL)
            OR
            (role <> 'super_admin' AND tenant_id IS NOT NULL)
        );
    END IF;
END $$;

