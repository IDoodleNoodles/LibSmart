import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Plus, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormModal from '@/components/Modals/FormModal';
import ConfirmModal from '@/components/Modals/ConfirmModal';
import ViewModal from '@/components/Modals/ViewModal';

interface Catalog {
  id: string;
  title: string;
  description: string;
  bookCount: number;
  status: 'Active' | 'Inactive';
}

interface CatalogFormData {
  title: string;
  description: string;
  bookCount: number;
  status: 'Active' | 'Inactive';
}

export default function Catalog() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([
    { id: 'CAT-001', title: 'Fiction Collection', description: 'All novels and fiction books', bookCount: 342, status: 'Active' },
    { id: 'CAT-002', title: 'Non-Fiction Reference', description: 'Educational and reference materials', bookCount: 215, status: 'Active' },
    { id: 'CAT-003', title: 'Academic Journals', description: 'Research papers and journals', bookCount: 127, status: 'Active' },
    { id: 'CAT-004', title: 'Children\'s Literature', description: 'Books for children and young adults', bookCount: 189, status: 'Active' },
    { id: 'CAT-005', title: 'History & Biography', description: 'Historical and biographical works', bookCount: 98, status: 'Inactive' },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog | null>(null);
  const [formData, setFormData] = useState<CatalogFormData>({ title: '', description: '', bookCount: 0, status: 'Active' });

  const openAddModal = () => {
    setFormData({ title: '', description: '', bookCount: 0, status: 'Active' });
    setIsAddModalOpen(true);
  };

  const openEditModal = (catalog: Catalog) => {
    setSelectedCatalog(catalog);
    setFormData({ title: catalog.title, description: catalog.description, bookCount: catalog.bookCount, status: catalog.status });
    setIsEditModalOpen(true);
  };

  const openViewModal = (catalog: Catalog) => {
    setSelectedCatalog(catalog);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (catalog: Catalog) => {
    setSelectedCatalog(catalog);
    setIsDeleteModalOpen(true);
  };

  const handleAddCatalog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }
    const newCatalog: Catalog = {
      id: `CAT-${String(catalogs.length + 1).padStart(3, '0')}`,
      ...formData,
    };
    setCatalogs([...catalogs, newCatalog]);
    setIsAddModalOpen(false);
  };

  const handleEditCatalog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatalog) return;
    setCatalogs(catalogs.map(c => c.id === selectedCatalog.id ? { ...selectedCatalog, ...formData } : c));
    setIsEditModalOpen(false);
  };

  const handleDeleteCatalog = () => {
    if (selectedCatalog) {
      setCatalogs(catalogs.filter(c => c.id !== selectedCatalog.id));
      setIsDeleteModalOpen(false);
    }
  };

  const catalogData = catalogs;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Catalog Management</h1>
        <p className="text-libsmart-slate">Manage your library catalog collections and categories</p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-libsmart-slate/20 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-libsmart-slate/20 flex items-center justify-between">
          <h2 className="text-lg font-bold text-black">Book Collections</h2>
          <Button onClick={openAddModal} className="gap-2 bg-libsmart-blue hover:bg-libsmart-blue/90">
            <Plus size={18} />
            Add Catalog
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-libsmart-slate/5 border-b border-libsmart-slate/20">
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Books</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {catalogData.map((row) => (
                <tr key={row.id} className="border-b border-libsmart-slate/10 hover:bg-libsmart-slate/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-libsmart-blue">{row.id}</td>
                  <td className="px-6 py-4 text-sm text-black font-medium">{row.title}</td>
                  <td className="px-6 py-4 text-sm text-black">{row.description}</td>
                  <td className="px-6 py-4 text-sm text-black">{row.bookCount}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      row.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-libsmart-slate/20 text-libsmart-slate'
                    }`}>
                      {row.status}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Catalog Modal */}
      <FormModal
        isOpen={isAddModalOpen}
        title="Add New Catalog"
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCatalog}
        submitText="Add Catalog"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-black mb-1">
              Collection Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Fiction Collection"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-black mb-1">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., All novels and fiction books"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue resize-none"
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="bookCount" className="block text-sm font-medium text-black mb-1">
              Number of Books
            </label>
            <input
              type="number"
              id="bookCount"
              value={formData.bookCount}
              onChange={(e) => setFormData({ ...formData, bookCount: parseInt(e.target.value) || 0 })}
              placeholder="0"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-black mb-1">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </FormModal>

      {/* Edit Catalog Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        title={`Edit ${selectedCatalog?.title || 'Catalog'}`}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditCatalog}
        submitText="Update Catalog"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-black mb-1">
              Collection Title *
            </label>
            <input
              type="text"
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Fiction Collection"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-black mb-1">
              Description *
            </label>
            <textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., All novels and fiction books"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue resize-none"
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="edit-bookCount" className="block text-sm font-medium text-black mb-1">
              Number of Books
            </label>
            <input
              type="number"
              id="edit-bookCount"
              value={formData.bookCount}
              onChange={(e) => setFormData({ ...formData, bookCount: parseInt(e.target.value) || 0 })}
              placeholder="0"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div>
            <label htmlFor="edit-status" className="block text-sm font-medium text-black mb-1">
              Status
            </label>
            <select
              id="edit-status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </FormModal>

      {/* View Catalog Modal */}
      {selectedCatalog && (
        <ViewModal
          isOpen={isViewModalOpen}
          title={selectedCatalog.title}
          onClose={() => setIsViewModalOpen(false)}
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Catalog ID</p>
              <p className="text-sm text-black font-medium">{selectedCatalog.id}</p>
            </div>
            <div>
              <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Description</p>
              <p className="text-sm text-black">{selectedCatalog.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Book Count</p>
                <p className="text-sm text-black font-medium">{selectedCatalog.bookCount} books</p>
              </div>
              <div>
                <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  selectedCatalog.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-libsmart-slate/20 text-libsmart-slate'
                }`}>
                  {selectedCatalog.status}
                </span>
              </div>
            </div>
          </div>
        </ViewModal>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Catalog"
        message={`Are you certain you wish to proceed with the deletion of ${selectedCatalog?.title}? This action cannot be undone.`}
        onConfirm={handleDeleteCatalog}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="Delete Catalog"
        isDangerous={true}
      />
    </div>
  );
}
