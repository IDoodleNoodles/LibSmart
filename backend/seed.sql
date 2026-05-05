-- LibSmart Database Seed Script
-- Includes auth users plus catalog data exported from frontend mockData.ts

-- Optional reset for local dev
-- DELETE FROM borrowings;
-- DELETE FROM books;
-- DELETE FROM categories;
-- DELETE FROM branches;
-- DELETE FROM users;

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

-- Categories exported from frontend mock data (userBrowseCategories / bookInventory)
INSERT INTO categories (name, description, created_at)
VALUES
  ('Fiction', 'Fiction books and novels', NOW()),
  ('Dystopian', 'Dystopian novels and social commentary', NOW()),
  ('Romance', 'Romance and relationship fiction', NOW()),
  ('Sci-Fi', 'Science fiction books', NOW()),
  ('Fantasy', 'Fantasy adventures and epics', NOW()),
  ('Self-Help', 'Self-improvement and personal growth', NOW()),
  ('Non-Fiction', 'Non-fiction and knowledge books', NOW())
ON CONFLICT (name) DO NOTHING;

-- Branches exported from frontend mock data (branchRecords)
INSERT INTO branches (name, location, created_at)
VALUES
  ('Downtown Branch', 'Main Street', NOW()),
  ('Uptown Branch', 'Park Avenue', NOW()),
  ('Westside Branch', 'West Road', NOW()),
  ('Eastside Branch', 'East Lane', NOW()),
  ('Riverside Branch', 'River Street', NOW())
ON CONFLICT (name) DO NOTHING;

-- Books exported from frontend mock data (bookInventory + userBrowseBooks)
-- quantity uses total copies, available_quantity uses currently available copies.
INSERT INTO books (
  title,
  author,
  isbn,
  description,
  category_id,
  branch_id,
  quantity,
  available_quantity,
  status,
  created_at
)
VALUES
  (
    'The Great Gatsby',
    'F. Scott Fitzgerald',
    '9780743273565',
    'Classic novel set in the Jazz Age.',
    (SELECT id FROM categories WHERE name = 'Fiction'),
    (SELECT id FROM branches WHERE name = 'Downtown Branch'),
    8,
    5,
    'AVAILABLE',
    NOW()
  ),
  (
    '1984',
    'George Orwell',
    '9780451524935',
    'Dystopian novel about surveillance and control.',
    (SELECT id FROM categories WHERE name = 'Dystopian'),
    (SELECT id FROM branches WHERE name = 'Uptown Branch'),
    8,
    2,
    'AVAILABLE',
    NOW()
  ),
  (
    'To Kill a Mockingbird',
    'Harper Lee',
    '9780061120084',
    'Pulitzer Prize winning novel about justice and morality.',
    (SELECT id FROM categories WHERE name = 'Fiction'),
    (SELECT id FROM branches WHERE name = 'Westside Branch'),
    6,
    4,
    'AVAILABLE',
    NOW()
  ),
  (
    'Pride and Prejudice',
    'Jane Austen',
    '9780141439518',
    'Classic romance novel set in Georgian England.',
    (SELECT id FROM categories WHERE name = 'Romance'),
    (SELECT id FROM branches WHERE name = 'Eastside Branch'),
    7,
    6,
    'AVAILABLE',
    NOW()
  ),
  (
    'The Catcher in the Rye',
    'J.D. Salinger',
    '9780316769488',
    'Coming-of-age novel about teenage alienation.',
    (SELECT id FROM categories WHERE name = 'Fiction'),
    (SELECT id FROM branches WHERE name = 'Riverside Branch'),
    7,
    3,
    'AVAILABLE',
    NOW()
  ),
  (
    'Brave New World',
    'Aldous Huxley',
    '9780060850524',
    'Dystopian science fiction about a controlled society.',
    (SELECT id FROM categories WHERE name = 'Sci-Fi'),
    (SELECT id FROM branches WHERE name = 'Downtown Branch'),
    8,
    1,
    'AVAILABLE',
    NOW()
  ),
  (
    'Dune',
    'Frank Herbert',
    '9780441172719',
    'Epic science fiction saga set on Arrakis.',
    (SELECT id FROM categories WHERE name = 'Sci-Fi'),
    (SELECT id FROM branches WHERE name = 'Uptown Branch'),
    5,
    5,
    'AVAILABLE',
    NOW()
  ),
  (
    'The Hobbit',
    'J.R.R. Tolkien',
    '9780345339683',
    'Fantasy adventure of Bilbo Baggins.',
    (SELECT id FROM categories WHERE name = 'Fantasy'),
    (SELECT id FROM branches WHERE name = 'Westside Branch'),
    7,
    7,
    'AVAILABLE',
    NOW()
  ),
  (
    'Jane Eyre',
    'Charlotte Bronte',
    '9780142437209',
    'Romantic novel following the life of Jane Eyre.',
    (SELECT id FROM categories WHERE name = 'Romance'),
    (SELECT id FROM branches WHERE name = 'Eastside Branch'),
    3,
    3,
    'AVAILABLE',
    NOW()
  ),
  (
    'Atomic Habits',
    'James Clear',
    '9780735211292',
    'Practical framework for building good habits.',
    (SELECT id FROM categories WHERE name = 'Self-Help'),
    (SELECT id FROM branches WHERE name = 'Riverside Branch'),
    8,
    8,
    'AVAILABLE',
    NOW()
  ),
  (
    'The Power of Now',
    'Eckhart Tolle',
    '9781577314806',
    'Guide to spiritual mindfulness and presence.',
    (SELECT id FROM categories WHERE name = 'Self-Help'),
    (SELECT id FROM branches WHERE name = 'Downtown Branch'),
    4,
    4,
    'AVAILABLE',
    NOW()
  ),
  (
    'Sapiens',
    'Yuval Noah Harari',
    '9780062316110',
    'Brief history of humankind.',
    (SELECT id FROM categories WHERE name = 'Non-Fiction'),
    (SELECT id FROM branches WHERE name = 'Uptown Branch'),
    2,
    2,
    'AVAILABLE',
    NOW()
  )
ON CONFLICT (isbn) DO NOTHING;

-- Quick verification queries
SELECT id, name, location FROM branches ORDER BY name;
SELECT id, name FROM categories ORDER BY name;
SELECT id, title, author, quantity, available_quantity, status FROM books ORDER BY title;
