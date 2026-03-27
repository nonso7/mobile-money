-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name VARCHAR(50) UNIQUE NOT NULL,
	description TEXT
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name VARCHAR(100) UNIQUE NOT NULL,
	description TEXT
);

-- Create role_permissions join table
CREATE TABLE IF NOT EXISTS role_permissions (
	role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
	permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
	PRIMARY KEY (role_id, permission_id)
);

-- Seed default roles and permissions for RBAC system

-- Insert default roles
INSERT INTO roles (name, description) VALUES 
('admin', 'Full access to all system resources'),
('user', 'Read/write access to own data'),
('viewer', 'Read-only access to public data')
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (name, description) VALUES
('read:own', 'Read own data'),
('write:own', 'Write/update own data'),
('delete:own', 'Delete own data'),
('read:all', 'Read all data'),
('write:all', 'Write/update all data'),
('delete:all', 'Delete all data'),
('admin:system', 'Full system administration')
ON CONFLICT (name) DO NOTHING;
