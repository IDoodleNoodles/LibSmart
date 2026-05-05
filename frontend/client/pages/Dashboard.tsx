import React, { useEffect, useMemo, useState } from 'react';
import { Eye, Pencil, Trash2, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormModal from '@/components/Modals/FormModal';
import ConfirmModal from '@/components/Modals/ConfirmModal';
import ViewModal from '@/components/Modals/ViewModal';
import {
  CatalogCategory,
  createBook,
  createBranch,
  createUser,
  deleteBook,
  deleteBranch,
  deleteUser,
  getAllBorrowings,
  getAllUsers,
  getBooks,
  getBranches,
  getCategories,
  LibraryBook,
  LibraryBranch,
  updateBook,
  updateBranch,
  updateUserRole,
  UserProfile,
  BorrowingItem,
} from '../services/api';

type BookForm = {
  title: string;
  author: string;
  isbn: string;
  description: string;
  categoryId: string;
  branchId: string;
  quantity: number;
};

type BranchForm = {
  name: string;
  location: string;
};

type UserForm = {
  role: 'ADMIN' | 'USER';
};

type UserCreateForm = {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address: string;
  role: 'ADMIN' | 'USER';
};

const defaultBookForm: BookForm = {
  title: '',
  author: '',
  isbn: '',
  description: '',
  categoryId: '',
  branchId: '',
  quantity: 1,
};

const defaultBranchForm: BranchForm = {
  name: '',
  location: '',
};

const defaultUserCreateForm: UserCreateForm = {
  username: '',
  email: '',
  password: '',
  fullName: '',
  phone: '',
  address: '',
  role: 'USER',
};

export default function Dashboard() {
  const [overdueSearch, setOverdueSearch] = useState('');
  const [branchSearch, setBranchSearch] = useState('');

  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [branches, setBranches] = useState<LibraryBranch[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [borrowings, setBorrowings] = useState<BorrowingItem[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isUserCreateModalOpen, setIsUserCreateModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<LibraryBook | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<LibraryBranch | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<BookForm>(defaultBookForm);
  const [branchFormData, setBranchFormData] = useState<BranchForm>(defaultBranchForm);
  const [userCreateForm, setUserCreateForm] = useState<UserCreateForm>(defaultUserCreateForm);
  const [userFormData, setUserFormData] = useState<UserForm>({ role: 'USER' });

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [booksData, branchesData, usersData, borrowingsData] = await Promise.all([
        getBooks(),
        getBranches(),
        getAllUsers(),
        getAllBorrowings(),
      ]);
      setBooks(booksData);
      setBranches(branchesData);
      setUsers(usersData);
      setBorrowings(borrowingsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const ensureCategoriesLoaded = async () => {
    if (categories.length > 0) {
      return;
    }
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch {
      // Keep form usable even if categories fail to load.
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const stats = useMemo(() => {
    const totalCopies = books.reduce((sum, book) => sum + book.quantity, 0);
    const activeLoans = borrowings.filter((borrowing) => borrowing.status === 'BORROWED' || borrowing.status === 'OVERDUE').length;
    const overdueLoans = borrowings.filter((borrowing) => borrowing.status === 'OVERDUE').length;
    return [
      { label: 'Total Books', value: totalCopies.toLocaleString(), change: `${books.length} titles` },
      { label: 'Total Members', value: users.length.toLocaleString(), change: 'Live users' },
      { label: 'Active Loans', value: activeLoans.toLocaleString(), change: `${overdueLoans} overdue` },
      { label: 'Branches', value: branches.length.toLocaleString(), change: 'Live branches' },
    ];
  }, [books, users, borrowings, branches]);

  const overdueData = useMemo(() => {
    return borrowings
      .filter((borrowing) => borrowing.status === 'OVERDUE')
      .map((borrowing) => ({
        id: `OD-${String(borrowing.id).padStart(3, '0')}`,
        userName: borrowing.username,
        bookTitle: borrowing.book.title,
        daysOverdue: Math.max(1, Math.ceil((Date.now() - new Date(borrowing.dueDate).getTime()) / (24 * 60 * 60 * 1000))),
      }));
  }, [borrowings]);

  const filteredOverdueData = useMemo(() => {
    const q = overdueSearch.toLowerCase().trim();
    if (!q) return overdueData;
    return overdueData.filter((row) => [row.id, row.userName, row.bookTitle, String(row.daysOverdue)].join(' ').toLowerCase().includes(q));
  }, [overdueData, overdueSearch]);

  const filteredBranchData = useMemo(() => {
    const q = branchSearch.toLowerCase().trim();
    const mapped = branches.map((branch) => ({
      id: `BR-${String(branch.id).padStart(3, '0')}`,
      name: branch.name,
      location: branch.location || '-',
      status: 'Active',
      raw: branch,
    }));
    if (!q) return mapped;
    return mapped.filter((row) => [row.id, row.name, row.location, row.status].join(' ').toLowerCase().includes(q));
  }, [branches, branchSearch]);



  const openBookModal = async (book?: LibraryBook) => {
    await ensureCategoriesLoaded();
    if (book) {
      setSelectedBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn || '',
        description: book.description || '',
        categoryId: book.category?.id ? String(book.category.id) : '',
        branchId: book.branch?.id ? String(book.branch.id) : '',
        quantity: book.quantity,
      });
    } else {
      setSelectedBook(null);
      setFormData(defaultBookForm);
    }
    setIsBookModalOpen(true);
  };

  const openBranchModal = (branch?: LibraryBranch) => {
    if (branch) {
      setSelectedBranch(branch);
      setBranchFormData({ name: branch.name, location: branch.location || '' });
    } else {
      setSelectedBranch(null);
      setBranchFormData(defaultBranchForm);
    }
    setIsBranchModalOpen(true);
  };

  const openUserModal = (user: UserProfile) => {
    setSelectedUser(user);
    setUserFormData({ role: user.role });
    setIsUserModalOpen(true);
  };

  const openCreateUserModal = () => {
    setSelectedUser(null);
    setUserCreateForm(defaultUserCreateForm);
    setIsUserCreateModalOpen(true);
  };

  const openDeleteModal = (item: { kind: 'book' | 'branch'; id: number; label: string }) => {
    setSelectedBook(item.kind === 'book' ? books.find((book) => book.id === item.id) || null : null);
    setSelectedBranch(item.kind === 'branch' ? branches.find((branch) => branch.id === item.id) || null : null);
    setIsDeleteModalOpen(true);
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (selectedBook) {
        const updatedBook = await updateBook(selectedBook.id, {
          title: formData.title.trim(),
          author: formData.author.trim(),
          isbn: formData.isbn.trim() || undefined,
          description: formData.description.trim() || undefined,
          categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
          branchId: formData.branchId ? Number(formData.branchId) : undefined,
          quantity: Math.max(0, formData.quantity),
        });
        setBooks((prev) => prev.map((book) => (book.id === updatedBook.id ? updatedBook : book)));
      } else {
        const createdBook = await createBook({
          title: formData.title.trim(),
          author: formData.author.trim(),
          isbn: formData.isbn.trim() || undefined,
          description: formData.description.trim() || undefined,
          categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
          branchId: formData.branchId ? Number(formData.branchId) : undefined,
          quantity: Math.max(0, formData.quantity),
        });
        setBooks((prev) => [createdBook, ...prev]);
      }
      setIsBookModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save book');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (selectedBranch) {
        const updatedBranch = await updateBranch(selectedBranch.id, {
          name: branchFormData.name.trim(),
          location: branchFormData.location.trim() || undefined,
        });
        setBranches((prev) => prev.map((branch) => (branch.id === updatedBranch.id ? updatedBranch : branch)));
      } else {
        const createdBranch = await createBranch({
          name: branchFormData.name.trim(),
          location: branchFormData.location.trim() || undefined,
        });
        setBranches((prev) => [createdBranch, ...prev]);
      }
      setIsBranchModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save branch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      return;
    }
    setIsSubmitting(true);
    try {
      const updatedUser = await updateUserRole(selectedUser.id, userFormData.role);
      setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      setIsUserModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update user role');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const createdUser = await createUser({
        username: userCreateForm.username.trim(),
        email: userCreateForm.email.trim(),
        password: userCreateForm.password,
        fullName: userCreateForm.fullName.trim(),
        phone: userCreateForm.phone.trim() || undefined,
        address: userCreateForm.address.trim() || undefined,
        role: userCreateForm.role,
      });
      setUsers((prev) => [createdUser, ...prev]);
      setIsUserCreateModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      if (selectedBook) {
        await deleteBook(selectedBook.id);
        setBooks((prev) => prev.filter((book) => book.id !== selectedBook.id));
      } else if (selectedBranch) {
        await deleteBranch(selectedBranch.id);
        setBranches((prev) => prev.filter((branch) => branch.id !== selectedBranch.id));
      } else if (selectedUser) {
        await deleteUser(selectedUser.id);
        setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
        setBorrowings((prev) => prev.filter((borrowing) => borrowing.userId !== selectedUser.id));
      }
      setSelectedBook(null);
      setSelectedBranch(null);
      setSelectedUser(null);
      setIsDeleteModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Dashboard</h1>
        <p className="text-libsmart-slate">Welcome back! Here's your library overview.</p>
      </div>

      {isLoading ? (
        <div className="text-sm text-libsmart-slate">Loading dashboard...</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <p className="text-sm text-libsmart-slate mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-black">{stat.value}</p>
              <p className="text-sm text-libsmart-blue font-medium">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-libsmart-slate/20 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-libsmart-slate/20 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-black">Overdue Borrowers</h2>
            <div className="relative w-full max-w-sm">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-libsmart-slate/50" />
              <input
                type="text"
                value={overdueSearch}
                onChange={(e) => setOverdueSearch(e.target.value)}
                placeholder="Search overdue borrowers"
                className="w-full pl-10 pr-4 py-2 border border-libsmart-slate/20 rounded-lg bg-white text-black placeholder-libsmart-slate/50 focus:outline-none focus:ring-2 focus:ring-libsmart-blue focus:border-transparent"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-libsmart-slate/5 border-b border-libsmart-slate/20">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Book</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Days</th>
                </tr>
              </thead>
              <tbody>
                {filteredOverdueData.length > 0 ? (
                  filteredOverdueData.map((row) => (
                    <tr key={row.id} className="border-b border-libsmart-slate/10 hover:bg-libsmart-slate/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-libsmart-blue">{row.id}</td>
                      <td className="px-6 py-4 text-sm text-black">{row.userName}</td>
                      <td className="px-6 py-4 text-sm text-black">{row.bookTitle}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          {row.daysOverdue} days
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-libsmart-slate">
                      No overdue borrowers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-libsmart-slate/20 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-libsmart-slate/20 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-black">Branch Network</h2>
            <div className="relative w-full max-w-sm">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-libsmart-slate/50" />
              <input
                type="text"
                value={branchSearch}
                onChange={(e) => setBranchSearch(e.target.value)}
                placeholder="Search branch network"
                className="w-full pl-10 pr-4 py-2 border border-libsmart-slate/20 rounded-lg bg-white text-black placeholder-libsmart-slate/50 focus:outline-none focus:ring-2 focus:ring-libsmart-blue focus:border-transparent"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-libsmart-slate/5 border-b border-libsmart-slate/20">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBranchData.length > 0 ? (
                  filteredBranchData.map((row) => (
                    <tr key={row.id} className="border-b border-libsmart-slate/10 hover:bg-libsmart-slate/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-libsmart-blue">{row.id}</td>
                      <td className="px-6 py-4 text-sm text-black">{row.name}</td>
                      <td className="px-6 py-4 text-sm text-black">{row.location}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button onClick={() => openBranchModal(row.raw)} className="p-2 hover:bg-libsmart-slate/10 rounded-lg transition-colors text-libsmart-slate hover:text-libsmart-blue" title="View">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => openBranchModal(row.raw)} className="p-2 hover:bg-libsmart-slate/10 rounded-lg transition-colors text-libsmart-slate hover:text-libsmart-blue" title="Edit">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => { setSelectedBranch(row.raw); setSelectedBook(null); setIsDeleteModalOpen(true); }} className="p-2 hover:bg-red-100 rounded-lg transition-colors text-libsmart-slate hover:text-red-600" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-libsmart-slate">
                      No branches match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>



      <FormModal
        isOpen={isBookModalOpen}
        title={selectedBook ? `Edit ${selectedBook.title}` : 'Add New Book'}
        onClose={() => setIsBookModalOpen(false)}
        onSubmit={handleSaveBook}
        submitText={selectedBook ? 'Update Book' : 'Add Book'}
        isLoading={isSubmitting}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Title *</label>
            <input value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue" />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Author *</label>
            <input value={formData.author} onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))} className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Category</label>
              <select value={formData.categoryId} onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))} className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue">
                <option value="">None</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Branch</label>
              <select value={formData.branchId} onChange={(e) => setFormData((prev) => ({ ...prev, branchId: e.target.value }))} className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue">
                <option value="">None</option>
                {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Quantity</label>
            <input type="number" min={0} value={formData.quantity} onChange={(e) => setFormData((prev) => ({ ...prev, quantity: parseInt(e.target.value, 10) || 0 }))} className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue" />
          </div>
        </div>
      </FormModal>

      <FormModal
        isOpen={isBranchModalOpen}
        title={selectedBranch ? `Edit ${selectedBranch.name}` : 'Add New Branch'}
        onClose={() => setIsBranchModalOpen(false)}
        onSubmit={handleSaveBranch}
        submitText={selectedBranch ? 'Update Branch' : 'Add Branch'}
        isLoading={isSubmitting}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Branch Name *</label>
            <input value={branchFormData.name} onChange={(e) => setBranchFormData((prev) => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue" />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Location</label>
            <input value={branchFormData.location} onChange={(e) => setBranchFormData((prev) => ({ ...prev, location: e.target.value }))} className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue" />
          </div>
        </div>
      </FormModal>

        <FormModal
          isOpen={isUserCreateModalOpen}
          title="Add New User"
          onClose={() => setIsUserCreateModalOpen(false)}
          onSubmit={handleCreateUser}
          submitText="Add User"
          isLoading={isSubmitting}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Username *</label>
              <input value={userCreateForm.username} onChange={(e) => setUserCreateForm((prev) => ({ ...prev, username: e.target.value }))} className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Email *</label>
              <input type="email" value={userCreateForm.email} onChange={(e) => setUserCreateForm((prev) => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Full Name *</label>
              <input value={userCreateForm.fullName} onChange={(e) => setUserCreateForm((prev) => ({ ...prev, fullName: e.target.value }))} className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Password *</label>
              <input type="password" value={userCreateForm.password} onChange={(e) => setUserCreateForm((prev) => ({ ...prev, password: e.target.value }))} className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Phone</label>
                <input value={userCreateForm.phone} onChange={(e) => setUserCreateForm((prev) => ({ ...prev, phone: e.target.value }))} className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Role</label>
                <select value={userCreateForm.role} onChange={(e) => setUserCreateForm((prev) => ({ ...prev, role: e.target.value as 'ADMIN' | 'USER' }))} className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue">
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Address</label>
              <input value={userCreateForm.address} onChange={(e) => setUserCreateForm((prev) => ({ ...prev, address: e.target.value }))} className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue" />
            </div>
          </div>
        </FormModal>

      <FormModal
        isOpen={isUserModalOpen}
        title={selectedUser ? `Edit ${selectedUser.fullName}` : 'Edit User'}
        onClose={() => setIsUserModalOpen(false)}
        onSubmit={handleSaveUser}
        submitText="Update Role"
        isLoading={isSubmitting}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Role</label>
            <select value={userFormData.role} onChange={(e) => setUserFormData({ role: e.target.value as 'ADMIN' | 'USER' })} className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue">
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </div>
      </FormModal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={selectedUser ? 'Delete User' : selectedBook ? 'Delete Book' : 'Delete Branch'}
        message={`Delete ${selectedUser?.fullName || selectedBook?.title || selectedBranch?.name || 'this item'}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="Delete"
        isDangerous
        isLoading={isSubmitting}
      />
    </div>
  );
}
