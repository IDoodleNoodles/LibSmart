import React, { useEffect, useState } from 'react';
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormModal from '@/components/Modals/FormModal';
import ConfirmModal from '@/components/Modals/ConfirmModal';
import ViewModal from '@/components/Modals/ViewModal';
import {
  CatalogCategory,
  createCategory,
  deleteCategory,
  getCategories,
  getBooks,
  updateCategory,
} from '../services/api';

type CategoryForm = {
  name: string;
  description: string;
};

const defaultForm: CategoryForm = {
  name: '',
  description: '',
};

export default function Catalog() {
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [bookCounts, setBookCounts] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<CatalogCategory | null>(null);
  const [formData, setFormData] = useState<CategoryForm>(defaultForm);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [categoriesData, booksData] = await Promise.all([getCategories(), getBooks()]);
      setCategories(categoriesData);

      const nextCounts: Record<number, number> = {};
      for (const category of categoriesData) {
        nextCounts[category.id] = booksData.filter((book) => book.category?.id === category.id).length;
      }
      setBookCounts(nextCounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setSelectedCategory(null);
    setFormData(defaultForm);
    setIsAddModalOpen(true);
  };

  const openEditModal = (category: CatalogCategory) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (category: CatalogCategory) => {
    setSelectedCategory(category);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (category: CatalogCategory) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const createdCategory = await createCategory({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      });
      setCategories((prev) => [createdCategory, ...prev]);
      setBookCounts((prev) => ({ ...prev, [createdCategory.id]: 0 }));
      setIsAddModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) {
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedCategory = await updateCategory(selectedCategory.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      });
      setCategories((prev) => prev.map((category) => (category.id === updatedCategory.id ? updatedCategory : category)));
      setIsEditModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) {
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteCategory(selectedCategory.id);
      setCategories((prev) => prev.filter((category) => category.id !== selectedCategory.id));
      setBookCounts((prev) => {
        const nextCounts = { ...prev };
        delete nextCounts[selectedCategory.id];
        return nextCounts;
      });
      setIsDeleteModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Catalog Management</h1>
        <p className="text-libsmart-slate">Manage your library catalog collections and categories</p>
      </div>

      <div className="bg-white border border-libsmart-slate/20 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-libsmart-slate/20 flex items-center justify-between">
          <h2 className="text-lg font-bold text-black whitespace-nowrap">Book Categories</h2>
          <Button onClick={openAddModal} className="gap-2 bg-libsmart-blue hover:bg-libsmart-blue/90">
            <Plus size={18} />
            Add Category
          </Button>
        </div>

        {isLoading ? (
          <div className="px-6 py-8 text-sm text-libsmart-slate">Loading categories...</div>
        ) : error ? (
          <div className="px-6 py-8 text-sm text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-libsmart-slate/5 border-b border-libsmart-slate/20">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Books</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((row) => (
                  <tr key={row.id} className="border-b border-libsmart-slate/10 hover:bg-libsmart-slate/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-libsmart-blue">CAT-{String(row.id).padStart(3, '0')}</td>
                    <td className="px-6 py-4 text-sm text-black font-medium">{row.name}</td>
                    <td className="px-6 py-4 text-sm text-black">{row.description || '-'}</td>
                    <td className="px-6 py-4 text-sm text-black">{bookCounts[row.id] || 0}</td>
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
        )}
      </div>

      <FormModal
        isOpen={isAddModalOpen}
        title="Add New Category"
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCategory}
        submitText="Add Category"
        isLoading={isSubmitting}
      >
        <CategoryFormFields formData={formData} setFormData={setFormData} idPrefix="add" />
      </FormModal>

      <FormModal
        isOpen={isEditModalOpen}
        title={`Edit ${selectedCategory?.name || 'Category'}`}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditCategory}
        submitText="Update Category"
        isLoading={isSubmitting}
      >
        <CategoryFormFields formData={formData} setFormData={setFormData} idPrefix="edit" />
      </FormModal>

      {selectedCategory && (
        <ViewModal isOpen={isViewModalOpen} title={selectedCategory.name} onClose={() => setIsViewModalOpen(false)}>
          <div className="space-y-3 text-sm text-black">
            <p><span className="font-semibold">ID:</span> CAT-{String(selectedCategory.id).padStart(3, '0')}</p>
            <p><span className="font-semibold">Description:</span> {selectedCategory.description || 'No description'}</p>
            <p><span className="font-semibold">Books:</span> {bookCounts[selectedCategory.id] || 0}</p>
            <p><span className="font-semibold">Created:</span> {new Date(selectedCategory.createdAt).toLocaleString()}</p>
          </div>
        </ViewModal>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Category"
        message={`Delete ${selectedCategory?.name || 'this category'}? This action cannot be undone.`}
        onConfirm={handleDeleteCategory}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="Delete"
        isDangerous
        isLoading={isSubmitting}
      />
    </div>
  );
}

function CategoryFormFields({
  formData,
  setFormData,
  idPrefix,
}: {
  formData: CategoryForm;
  setFormData: React.Dispatch<React.SetStateAction<CategoryForm>>;
  idPrefix: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={`${idPrefix}-name`} className="block text-sm font-medium text-black mb-1">Category Name *</label>
        <input
          id={`${idPrefix}-name`}
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
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
    </div>
  );
}
