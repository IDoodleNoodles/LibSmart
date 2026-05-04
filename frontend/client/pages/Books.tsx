import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormModal from '@/components/Modals/FormModal';
import ConfirmModal from '@/components/Modals/ConfirmModal';
import ViewModal from '@/components/Modals/ViewModal';
import { bookInventory } from '../lib/mockData';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  available: number;
  borrowed: number;
}

export default function Books() {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>(bookInventory);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({ title: '', author: '', category: '', available: 0, borrowed: 0 });

  const openAddModal = () => {
    setFormData({ title: '', author: '', category: '', available: 0, borrowed: 0 });
    setIsAddModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setSelectedBook(book);
    setFormData({ title: book.title, author: book.author, category: book.category, available: book.available, borrowed: book.borrowed });
    setIsEditModalOpen(true);
  };

  const openViewModal = (book: Book) => {
    setSelectedBook(book);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (book: Book) => {
    setSelectedBook(book);
    setIsDeleteModalOpen(true);
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author) {
      alert('Please fill in all required fields');
      return;
    }
    const newBook: Book = {
      id: `BK-${String(books.length + 1).padStart(3, '0')}`,
      ...formData,
    };
    setBooks([...books, newBook]);
    setIsAddModalOpen(false);
  };

  const handleEditBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;
    setBooks(books.map(b => b.id === selectedBook.id ? { ...selectedBook, ...formData } : b));
    setIsEditModalOpen(false);
  };

  const handleDeleteBook = () => {
    if (selectedBook) {
      setBooks(books.filter(b => b.id !== selectedBook.id));
      setIsDeleteModalOpen(false);
    }
  };

  const booksData = books;
  const filteredBooks = booksData.filter((book) =>
    [book.id, book.title, book.author, book.category, book.available, book.borrowed].join(' ').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Books Management</h1>
        <p className="text-libsmart-slate">Manage and track all books in your library inventory</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <p className="text-sm text-libsmart-slate mb-2">Total Books</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-black">1,247</p>
            <p className="text-sm text-libsmart-blue font-medium">+24</p>
          </div>
        </div>
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <p className="text-sm text-libsmart-slate mb-2">Currently Borrowed</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-black">645</p>
            <p className="text-sm text-libsmart-blue font-medium">+18%</p>
          </div>
        </div>
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <p className="text-sm text-libsmart-slate mb-2">Available</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-black">602</p>
            <p className="text-sm text-libsmart-blue font-medium">48%</p>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white border border-libsmart-slate/20 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-libsmart-slate/20 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-lg font-bold text-black">Book Inventory</h2>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-libsmart-slate/5 border-b border-libsmart-slate/20">
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Author</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Available</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Borrowed</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length > 0 ? filteredBooks.map((row) => (
                <tr key={row.id} className="border-b border-libsmart-slate/10 hover:bg-libsmart-slate/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-libsmart-blue">{row.id}</td>
                  <td className="px-6 py-4 text-sm text-black font-medium">{row.title}</td>
                  <td className="px-6 py-4 text-sm text-black">{row.author}</td>
                  <td className="px-6 py-4 text-sm text-black">{row.category}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {row.available}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                      {row.borrowed}
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
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-libsmart-slate">
                    No books match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Book Modal */}
      <FormModal
        isOpen={isAddModalOpen}
        title="Add New Book"
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBook}
        submitText="Add Book"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-black mb-1">
              Book Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., The Great Gatsby"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-black mb-1">
              Author *
            </label>
            <input
              type="text"
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="e.g., F. Scott Fitzgerald"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-black mb-1">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Fiction"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="available" className="block text-sm font-medium text-black mb-1">
                Available Copies
              </label>
              <input
                type="number"
                id="available"
                value={formData.available}
                onChange={(e) => setFormData({ ...formData, available: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
              />
            </div>
            <div>
              <label htmlFor="borrowed" className="block text-sm font-medium text-black mb-1">
                Borrowed Copies
              </label>
              <input
                type="number"
                id="borrowed"
                value={formData.borrowed}
                onChange={(e) => setFormData({ ...formData, borrowed: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
              />
            </div>
          </div>
        </div>
      </FormModal>

      {/* Edit Book Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        title={`Edit ${selectedBook?.title || 'Book'}`}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditBook}
        submitText="Update Book"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-black mb-1">
              Book Title *
            </label>
            <input
              type="text"
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., The Great Gatsby"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div>
            <label htmlFor="edit-author" className="block text-sm font-medium text-black mb-1">
              Author *
            </label>
            <input
              type="text"
              id="edit-author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="e.g., F. Scott Fitzgerald"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div>
            <label htmlFor="edit-category" className="block text-sm font-medium text-black mb-1">
              Category
            </label>
            <input
              type="text"
              id="edit-category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Fiction"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-available" className="block text-sm font-medium text-black mb-1">
                Available Copies
              </label>
              <input
                type="number"
                id="edit-available"
                value={formData.available}
                onChange={(e) => setFormData({ ...formData, available: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
              />
            </div>
            <div>
              <label htmlFor="edit-borrowed" className="block text-sm font-medium text-black mb-1">
                Borrowed Copies
              </label>
              <input
                type="number"
                id="edit-borrowed"
                value={formData.borrowed}
                onChange={(e) => setFormData({ ...formData, borrowed: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
              />
            </div>
          </div>
        </div>
      </FormModal>

      {/* View Book Modal */}
      {selectedBook && (
        <ViewModal
          isOpen={isViewModalOpen}
          title={selectedBook.title}
          onClose={() => setIsViewModalOpen(false)}
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Book ID</p>
              <p className="text-sm text-black font-medium">{selectedBook.id}</p>
            </div>
            <div>
              <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Author</p>
              <p className="text-sm text-black">{selectedBook.author}</p>
            </div>
            <div>
              <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Category</p>
              <p className="text-sm text-black">{selectedBook.category || 'Uncategorized'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Available</p>
                <p className="text-sm text-black font-medium">{selectedBook.available} copies</p>
              </div>
              <div>
                <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Borrowed</p>
                <p className="text-sm text-black font-medium">{selectedBook.borrowed} copies</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Total Copies</p>
              <p className="text-sm text-black font-medium">{selectedBook.available + selectedBook.borrowed} copies</p>
            </div>
          </div>
        </ViewModal>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Book"
        message={`Are you certain you wish to proceed with the deletion of ${selectedBook?.title}? This action cannot be undone.`}
        onConfirm={handleDeleteBook}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="Delete Book"
        isDangerous={true}
      />
    </div>
  );
}
