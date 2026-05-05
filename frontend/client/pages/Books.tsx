import React, { useEffect, useMemo, useState } from 'react';
import { Eye, Pencil, Trash2, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormModal from '@/components/Modals/FormModal';
import ConfirmModal from '@/components/Modals/ConfirmModal';
import ViewModal from '@/components/Modals/ViewModal';
import {
  createBook,
  deleteBook,
  getBooks,
  getBranches,
  getCategories,
  LibraryBook,
  LibraryBranch,
  CatalogCategory,
  updateBook,
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

const defaultForm: BookForm = {
  title: '',
  author: '',
  isbn: '',
  description: '',
  categoryId: '',
  branchId: '',
  quantity: 1,
};

export default function Books() {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [branches, setBranches] = useState<LibraryBranch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedBook, setSelectedBook] = useState<LibraryBook | null>(null);
  const [formData, setFormData] = useState<BookForm>(defaultForm);

  const loadBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const booksData = await getBooks();
      setBooks(booksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load books');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMetadata = async () => {
    try {
      const [categoriesData, branchesData] = await Promise.all([getCategories(), getBranches()]);
      setCategories(categoriesData);
      setBranches(branchesData);
    } catch {
      // Keep existing metadata on transient failures to avoid blocking book interactions.
    }
  };

  useEffect(() => {
    loadBooks();
    loadMetadata();
  }, []);

  const openAddModal = () => {
    setSelectedBook(null);
    setFormData(defaultForm);
    setIsAddModalOpen(true);
  };

  const openEditModal = (book: LibraryBook) => {
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
    setIsEditModalOpen(true);
  };

  const openViewModal = (book: LibraryBook) => {
    setSelectedBook(book);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (book: LibraryBook) => {
    setSelectedBook(book);
    setIsDeleteModalOpen(true);
  };

  const totalBooks = books.reduce((sum, book) => sum + book.quantity, 0);
  const availableBooks = books.reduce((sum, book) => sum + book.availableQuantity, 0);
  const borrowedBooks = totalBooks - availableBooks;

  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return books;
    }
    return books.filter((book) =>
      [
        String(book.id),
        book.title,
        book.author,
        book.isbn || '',
        book.category?.name || '',
        book.branch?.name || '',
      ]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [books, searchQuery]);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim()) {
      alert('Please fill in title and author');
      return;
    }

    setIsSubmitting(true);
    try {
      await createBook({
        title: formData.title.trim(),
        author: formData.author.trim(),
        isbn: formData.isbn.trim() || undefined,
        description: formData.description.trim() || undefined,
        categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
        branchId: formData.branchId ? Number(formData.branchId) : undefined,
        quantity: Math.max(0, formData.quantity),
      });
      setIsAddModalOpen(false);
      await loadBooks();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create book');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updateBook(selectedBook.id, {
        title: formData.title.trim(),
        author: formData.author.trim(),
        isbn: formData.isbn.trim() || undefined,
        description: formData.description.trim() || undefined,
        categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
        branchId: formData.branchId ? Number(formData.branchId) : undefined,
        quantity: Math.max(0, formData.quantity),
      });
      setIsEditModalOpen(false);
      await loadBooks();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update book');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBook = async () => {
    if (!selectedBook) {
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteBook(selectedBook.id);
      setIsDeleteModalOpen(false);
      await loadBooks();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete book');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Books Management</h1>
        <p className="text-libsmart-slate">Manage and track all books in your library inventory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <p className="text-sm text-libsmart-slate mb-2">Total Copies</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-black">{totalBooks}</p>
            <p className="text-sm text-libsmart-blue font-medium">{books.length} titles</p>
          </div>
        </div>
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <p className="text-sm text-libsmart-slate mb-2">Currently Borrowed</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-black">{borrowedBooks}</p>
          </div>
        </div>
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <p className="text-sm text-libsmart-slate mb-2">Available</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-black">{availableBooks}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-libsmart-slate/20 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-libsmart-slate/20 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-lg font-bold text-black whitespace-nowrap">Book Inventory</h2>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="relative w-full sm:max-w-sm">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-libsmart-slate/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books by title, author, category..."
                className="w-full pl-10 pr-4 py-2 border border-libsmart-slate/20 rounded-lg bg-white text-black placeholder-libsmart-slate/50 focus:outline-none focus:ring-2 focus:ring-libsmart-blue focus:border-transparent"
              />
            </div>
            <Button onClick={openAddModal} className="gap-2 bg-libsmart-blue hover:bg-libsmart-blue/90">
              <Plus size={18} />
              Add Book
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="px-6 py-8 text-sm text-libsmart-slate">Loading books...</div>
        ) : error ? (
          <div className="px-6 py-8 text-sm text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-libsmart-slate/5 border-b border-libsmart-slate/20">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Branch</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Available</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Borrowed</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((row) => {
                    const borrowed = row.quantity - row.availableQuantity;
                    return (
                      <tr key={row.id} className="border-b border-libsmart-slate/10 hover:bg-libsmart-slate/5 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-libsmart-blue">BK-{String(row.id).padStart(3, '0')}</td>
                        <td className="px-6 py-4 text-sm text-black font-medium">{row.title}</td>
                        <td className="px-6 py-4 text-sm text-black">{row.author}</td>
                        <td className="px-6 py-4 text-sm text-black">{row.category?.name || '-'}</td>
                        <td className="px-6 py-4 text-sm text-black">{row.branch?.name || '-'}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {row.availableQuantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                            {borrowed}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button onClick={() => openViewModal(row)} className="p-2 hover:bg-libsmart-slate/10 rounded-lg transition-colors text-libsmart-slate hover:text-libsmart-blue">
                              <Eye size={16} />
                            </button>
                            <button onClick={() => openEditModal(row)} className="p-2 hover:bg-libsmart-slate/10 rounded-lg transition-colors text-libsmart-slate hover:text-libsmart-blue">
                              <Pencil size={16} />
                            </button>
                            <button onClick={() => openDeleteModal(row)} className="p-2 hover:bg-red-100 rounded-lg transition-colors text-libsmart-slate hover:text-red-600">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-sm text-libsmart-slate">
                      No books match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <FormModal
        isOpen={isAddModalOpen}
        title="Add New Book"
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBook}
        submitText="Add Book"
        isLoading={isSubmitting}
      >
        <BookFormFields
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          branches={branches}
          idPrefix="add"
        />
      </FormModal>

      <FormModal
        isOpen={isEditModalOpen}
        title={`Edit ${selectedBook?.title || 'Book'}`}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditBook}
        submitText="Update Book"
        isLoading={isSubmitting}
      >
        <BookFormFields
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          branches={branches}
          idPrefix="edit"
        />
      </FormModal>

      {selectedBook && (
        <ViewModal isOpen={isViewModalOpen} title={selectedBook.title} onClose={() => setIsViewModalOpen(false)}>
          <div className="space-y-3 text-sm text-black">
            <p><span className="font-semibold">ID:</span> BK-{String(selectedBook.id).padStart(3, '0')}</p>
            <p><span className="font-semibold">Author:</span> {selectedBook.author}</p>
            <p><span className="font-semibold">ISBN:</span> {selectedBook.isbn || '-'}</p>
            <p><span className="font-semibold">Category:</span> {selectedBook.category?.name || '-'}</p>
            <p><span className="font-semibold">Branch:</span> {selectedBook.branch?.name || '-'}</p>
            <p><span className="font-semibold">Quantity:</span> {selectedBook.quantity}</p>
            <p><span className="font-semibold">Available:</span> {selectedBook.availableQuantity}</p>
            <p><span className="font-semibold">Description:</span> {selectedBook.description || 'No description'}</p>
          </div>
        </ViewModal>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Book"
        message={`Delete ${selectedBook?.title || 'this book'}? This action cannot be undone.`}
        onConfirm={handleDeleteBook}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="Delete"
        isDangerous
        isLoading={isSubmitting}
      />
    </div>
  );
}

function BookFormFields({
  formData,
  setFormData,
  categories,
  branches,
  idPrefix,
}: {
  formData: BookForm;
  setFormData: React.Dispatch<React.SetStateAction<BookForm>>;
  categories: CatalogCategory[];
  branches: LibraryBranch[];
  idPrefix: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={`${idPrefix}-title`} className="block text-sm font-medium text-black mb-1">Book Title *</label>
        <input
          id={`${idPrefix}-title`}
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-author`} className="block text-sm font-medium text-black mb-1">Author *</label>
        <input
          id={`${idPrefix}-author`}
          value={formData.author}
          onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
          className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-isbn`} className="block text-sm font-medium text-black mb-1">ISBN</label>
        <input
          id={`${idPrefix}-isbn`}
          value={formData.isbn}
          onChange={(e) => setFormData((prev) => ({ ...prev, isbn: e.target.value }))}
          className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-description`} className="block text-sm font-medium text-black mb-1">Description</label>
        <textarea
          id={`${idPrefix}-description`}
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${idPrefix}-category`} className="block text-sm font-medium text-black mb-1">Category</label>
          <select
            id={`${idPrefix}-category`}
            value={formData.categoryId}
            onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
            className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
          >
            <option value="">None</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${idPrefix}-branch`} className="block text-sm font-medium text-black mb-1">Branch</label>
          <select
            id={`${idPrefix}-branch`}
            value={formData.branchId}
            onChange={(e) => setFormData((prev) => ({ ...prev, branchId: e.target.value }))}
            className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
          >
            <option value="">None</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor={`${idPrefix}-quantity`} className="block text-sm font-medium text-black mb-1">Quantity</label>
        <input
          type="number"
          min={0}
          id={`${idPrefix}-quantity`}
          value={formData.quantity}
          onChange={(e) => setFormData((prev) => ({ ...prev, quantity: parseInt(e.target.value, 10) || 0 }))}
          className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
        />
      </div>
    </div>
  );
}
