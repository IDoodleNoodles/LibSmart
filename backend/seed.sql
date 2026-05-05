-- LibSmart Database Seed Script
-- Creates test admin and user accounts
-- Password hashes are BCrypt encrypted

-- Clear existing users (optional - comment out for production)
-- DELETE FROM users;
-- ALTER SEQUENCE users_id_seq RESTART WITH 1;

-- Insert test admin user
-- Password: admin (BCrypt hash for testing)
INSERT INTO users (username, email, password_hash, full_name, phone, address, role, created_at)
VALUES (
  'admin',
  'admin@libsmart.com',
  '$2a$10$slYQmyNdGzin7olVN3p5Be7DQwelxpl0g9QgvfJQgFUMQrxaiJUFm',
  'Admin User',
  '555-0100',
  '1 Library Way, Springfield, IL',
  'ADMIN',
  NOW()
)
ON CONFLICT (username) DO NOTHING;

-- Insert test user
-- Password: testuser (BCrypt hash for testing)
INSERT INTO users (username, email, password_hash, full_name, phone, address, role, created_at)
VALUES (
  'testuser',
  'testuser@libsmart.com',
  '$2a$10$YQvfJQgFUMQrxaiJUFmslYQmyNdGzin7olVN3p5Be7DQwelxpl0g9',
  'Test User',
  '555-0101',
  '2 Library Way, Springfield, IL',
  'USER',
  NOW()
)
ON CONFLICT (username) DO NOTHING;

-- Verify inserted users
SELECT id, username, email, full_name, role, created_at FROM users ORDER BY created_at DESC;
