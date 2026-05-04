export const defaultUserName = 'sarah.mitchell';

export const mockAdminProfile = {
  fullName: 'Nisal Gunasekara',
  role: 'Admin',
};

export const mockUserProfile = {
  username: defaultUserName,
  fullName: 'Sarah Mitchell',
  email: 'sarah.mitchell@example.com',
  phone: '(555) 123-4567',
  address: '123 Main Street, Springfield, IL 62701',
  membershipDate: 'October 15, 2023',
  membershipId: 'LIB-2024-001847',
};

export const dashboardStats = [
  { label: 'Total Borrowed Books', value: '2,567', change: '+12%' },
  { label: 'Total Returned Books', value: '2,234', change: '+8%' },
  { label: 'Total User Base', value: '1,843', change: '+15%' },
  { label: 'Branch Count', value: '12', change: '+1' },
];

export const dashboardOverdueBorrowers = [
  { id: 'ORD-001', userName: 'John Smith', bookTitle: 'The Great Gatsby', daysOverdue: 5 },
  { id: 'ORD-002', userName: 'Sarah Johnson', bookTitle: '1984', daysOverdue: 3 },
  { id: 'ORD-003', userName: 'Mike Davis', bookTitle: 'To Kill a Mockingbird', daysOverdue: 8 },
  { id: 'ORD-004', userName: 'Emma Wilson', bookTitle: 'Pride and Prejudice', daysOverdue: 2 },
];

export const dashboardBranchNetwork = [
  { id: 'BR-001', name: 'Downtown Branch', location: 'Main Street', status: 'Active' },
  { id: 'BR-002', name: 'Uptown Branch', location: 'Park Avenue', status: 'Active' },
  { id: 'BR-003', name: 'Westside Branch', location: 'West Road', status: 'Inactive' },
  { id: 'BR-004', name: 'Eastside Branch', location: 'East Lane', status: 'Active' },
];

export const dashboardBooks = [
  { id: 'BK-001', name: 'The Great Gatsby', type: 'Fiction', language: 'English', action: 'View' },
  { id: 'BK-002', name: '1984', type: 'Dystopian', language: 'English', action: 'View' },
  { id: 'BK-003', name: 'To Kill a Mockingbird', type: 'Fiction', language: 'English', action: 'View' },
  { id: 'BK-004', name: 'Pride and Prejudice', type: 'Romance', language: 'English', action: 'View' },
];

export const dashboardUsers = [
  { id: 'US-001', name: 'John Smith', email: 'john@example.com', username: 'johnsmith', action: 'View' },
  { id: 'US-002', name: 'Sarah Johnson', email: 'sarah@example.com', username: 'sarahj', action: 'View' },
  { id: 'US-003', name: 'Mike Davis', email: 'mike@example.com', username: 'miked', action: 'View' },
  { id: 'US-004', name: 'Emma Wilson', email: 'emma@example.com', username: 'emmaw', action: 'View' },
];

export const dashboardBranches = [
  { id: 'BR-001', name: 'Downtown Branch', contact: '123-456-7890', location: 'Main Street', action: 'View' },
  { id: 'BR-002', name: 'Uptown Branch', contact: '123-456-7891', location: 'Park Avenue', action: 'View' },
  { id: 'BR-003', name: 'Westside Branch', contact: '123-456-7892', location: 'West Road', action: 'View' },
  { id: 'BR-004', name: 'Eastside Branch', contact: '123-456-7893', location: 'East Lane', action: 'View' },
];

export const bookInventory = [
  { id: 'BK-001', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', available: 5, borrowed: 3 },
  { id: 'BK-002', title: '1984', author: 'George Orwell', category: 'Dystopian', available: 2, borrowed: 6 },
  { id: 'BK-003', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', available: 4, borrowed: 2 },
  { id: 'BK-004', title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Romance', available: 6, borrowed: 1 },
  { id: 'BK-005', title: 'The Catcher in the Rye', author: 'J.D. Salinger', category: 'Fiction', available: 3, borrowed: 4 },
  { id: 'BK-006', title: 'Brave New World', author: 'Aldous Huxley', category: 'Sci-Fi', available: 1, borrowed: 7 },
];

type UserAccountRole = 'Member' | 'Librarian' | 'Admin';
type RowStatus = 'Active' | 'Inactive';

export const userAccounts: Array<{
  id: string;
  name: string;
  email: string;
  role: UserAccountRole;
  status: RowStatus;
  joinDate: string;
}> = [
  { id: 'US-001', name: 'John Smith', email: 'john@example.com', role: 'Member', status: 'Active', joinDate: 'Jan 15, 2024' },
  { id: 'US-002', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Member', status: 'Active', joinDate: 'Feb 22, 2024' },
  { id: 'US-003', name: 'Mike Davis', email: 'mike@example.com', role: 'Librarian', status: 'Active', joinDate: 'Mar 10, 2024' },
  { id: 'US-004', name: 'Emma Wilson', email: 'emma@example.com', role: 'Member', status: 'Inactive', joinDate: 'Jan 05, 2024' },
  { id: 'US-005', name: 'James Brown', email: 'james@example.com', role: 'Admin', status: 'Active', joinDate: 'Dec 01, 2023' },
  { id: 'US-006', name: 'Lisa Anderson', email: 'lisa@example.com', role: 'Member', status: 'Active', joinDate: 'Apr 12, 2024' },
];

export const branchRecords: Array<{
  id: string;
  name: string;
  location: string;
  contact: string;
  manager: string;
  status: RowStatus;
  employees: number;
}> = [
  { id: 'BR-001', name: 'Downtown Branch', location: 'Main Street', contact: '123-456-7890', manager: 'John Smith', status: 'Active', employees: 8 },
  { id: 'BR-002', name: 'Uptown Branch', location: 'Park Avenue', contact: '123-456-7891', manager: 'Sarah Johnson', status: 'Active', employees: 6 },
  { id: 'BR-003', name: 'Westside Branch', location: 'West Road', contact: '123-456-7892', manager: 'Mike Davis', status: 'Inactive', employees: 4 },
  { id: 'BR-004', name: 'Eastside Branch', location: 'East Lane', contact: '123-456-7893', manager: 'Emma Wilson', status: 'Active', employees: 5 },
  { id: 'BR-005', name: 'Riverside Branch', location: 'River Street', contact: '123-456-7894', manager: 'James Brown', status: 'Active', employees: 7 },
];

export const userBorrowedBooks = [
  { id: 'BK-001', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', borrowDate: 'May 04, 2026', dueDate: 'May 15, 2026', daysLeft: 11, copies: 1 },
  { id: 'BK-003', title: 'To Kill a Mockingbird', author: 'Harper Lee', borrowDate: 'Apr 24, 2026', dueDate: 'May 22, 2026', daysLeft: 18, copies: 1 },
  { id: 'BK-005', title: 'The Catcher in the Rye', author: 'J.D. Salinger', borrowDate: 'Apr 04, 2026', dueDate: 'Jun 01, 2026', daysLeft: 28, copies: 1 },
];

export const userPopularBooks = [
  { id: 'BK-002', title: '1984', author: 'George Orwell', category: 'Dystopian', available: 2 },
  { id: 'BK-004', title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Romance', available: 6 },
  { id: 'BK-006', title: 'Brave New World', author: 'Aldous Huxley', category: 'Sci-Fi', available: 1 },
];

export const userBrowseBooks = [
  { id: 'BK-001', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', rating: 4.5, available: 5 },
  { id: 'BK-002', title: '1984', author: 'George Orwell', category: 'Dystopian', rating: 4.7, available: 2 },
  { id: 'BK-003', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', rating: 4.8, available: 4 },
  { id: 'BK-004', title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Romance', rating: 4.6, available: 6 },
  { id: 'BK-005', title: 'The Catcher in the Rye', author: 'J.D. Salinger', category: 'Fiction', rating: 4.2, available: 3 },
  { id: 'BK-006', title: 'Brave New World', author: 'Aldous Huxley', category: 'Sci-Fi', rating: 4.4, available: 1 },
  { id: 'BK-007', title: 'Dune', author: 'Frank Herbert', category: 'Sci-Fi', rating: 4.7, available: 5 },
  { id: 'BK-008', title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fantasy', rating: 4.9, available: 7 },
  { id: 'BK-009', title: 'Jane Eyre', author: 'Charlotte Brontë', category: 'Romance', rating: 4.5, available: 3 },
  { id: 'BK-010', title: 'Atomic Habits', author: 'James Clear', category: 'Self-Help', rating: 4.6, available: 8 },
  { id: 'BK-011', title: 'The Power of Now', author: 'Eckhart Tolle', category: 'Self-Help', rating: 4.3, available: 4 },
  { id: 'BK-012', title: 'Sapiens', author: 'Yuval Noah Harari', category: 'Non-Fiction', rating: 4.5, available: 2 },
];

export const userBrowseCategories = ['All', 'Fiction', 'Sci-Fi', 'Fantasy', 'Romance', 'Self-Help', 'Non-Fiction', 'Dystopian'];
