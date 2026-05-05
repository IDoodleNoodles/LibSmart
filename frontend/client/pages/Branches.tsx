import React, { useEffect, useMemo, useState } from 'react';
import { Eye, Pencil, Trash2, Plus, MapPin, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormModal from '@/components/Modals/FormModal';
import ConfirmModal from '@/components/Modals/ConfirmModal';
import ViewModal from '@/components/Modals/ViewModal';
import {
  createBranch,
  deleteBranch,
  getBranches,
  LibraryBranch,
  updateBranch,
} from '../services/api';

type BranchForm = {
  name: string;
  location: string;
};

const defaultForm: BranchForm = {
  name: '',
  location: '',
};

export default function Branches() {
  const [searchQuery, setSearchQuery] = useState('');
  const [branches, setBranches] = useState<LibraryBranch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState<LibraryBranch | null>(null);
  const [formData, setFormData] = useState<BranchForm>(defaultForm);

  const loadBranches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getBranches();
      setBranches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load branches');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const openAddModal = () => {
    setSelectedBranch(null);
    setFormData(defaultForm);
    setIsAddModalOpen(true);
  };

  const openEditModal = (branch: LibraryBranch) => {
    setSelectedBranch(branch);
    setFormData({
      name: branch.name,
      location: branch.location || '',
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (branch: LibraryBranch) => {
    setSelectedBranch(branch);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (branch: LibraryBranch) => {
    setSelectedBranch(branch);
    setIsDeleteModalOpen(true);
  };

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter branch name');
      return;
    }

    setIsSubmitting(true);
    try {
      const createdBranch = await createBranch({
        name: formData.name.trim(),
        location: formData.location.trim() || undefined,
      });
      setBranches((prev) => [createdBranch, ...prev]);
      setIsAddModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create branch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranch) {
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedBranch = await updateBranch(selectedBranch.id, {
        name: formData.name.trim(),
        location: formData.location.trim() || undefined,
      });
      setBranches((prev) => prev.map((branch) => (branch.id === updatedBranch.id ? updatedBranch : branch)));
      setIsEditModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update branch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBranch = async () => {
    if (!selectedBranch) {
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteBranch(selectedBranch.id);
      setBranches((prev) => prev.filter((branch) => branch.id !== selectedBranch.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete branch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBranches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return branches;
    }
    return branches.filter((branch) =>
      [String(branch.id), branch.name, branch.location || ''].join(' ').toLowerCase().includes(q)
    );
  }, [branches, searchQuery]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Branches Management</h1>
        <p className="text-libsmart-slate">Oversee all library branch locations and their operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <p className="text-sm text-libsmart-slate mb-2">Total Branches</p>
          <p className="text-3xl font-bold text-black">{branches.length}</p>
        </div>
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <p className="text-sm text-libsmart-slate mb-2">Locations Listed</p>
          <p className="text-3xl font-bold text-black">{branches.filter((branch) => !!branch.location).length}</p>
        </div>
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <p className="text-sm text-libsmart-slate mb-2">Records</p>
          <p className="text-3xl font-bold text-black">{branches.length}</p>
        </div>
      </div>

      <div className="bg-white border border-libsmart-slate/20 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-libsmart-slate/20 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-lg font-bold text-black whitespace-nowrap">Branch Locations</h2>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="relative w-full sm:max-w-sm">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-libsmart-slate/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search branches by name or location..."
                className="w-full pl-10 pr-4 py-2 border border-libsmart-slate/20 rounded-lg bg-white text-black placeholder-libsmart-slate/50 focus:outline-none focus:ring-2 focus:ring-libsmart-blue focus:border-transparent"
              />
            </div>
            <Button onClick={openAddModal} className="gap-2 bg-libsmart-blue hover:bg-libsmart-blue/90">
              <Plus size={18} />
              Add Branch
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="px-6 py-8 text-sm text-libsmart-slate">Loading branches...</div>
        ) : error ? (
          <div className="px-6 py-8 text-sm text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-libsmart-slate/5 border-b border-libsmart-slate/20">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBranches.length > 0 ? (
                  filteredBranches.map((row) => (
                    <tr key={row.id} className="border-b border-libsmart-slate/10 hover:bg-libsmart-slate/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-libsmart-blue">BR-{String(row.id).padStart(3, '0')}</td>
                      <td className="px-6 py-4 text-sm text-black font-medium">{row.name}</td>
                      <td className="px-6 py-4 text-sm text-black">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} className="text-libsmart-slate" />
                          {row.location || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-black">{new Date(row.createdAt).toLocaleDateString()}</td>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-libsmart-slate">
                      No branches match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6">
        <h3 className="text-lg font-bold text-black mb-4">Standard Operating Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-libsmart-slate/5 rounded-lg">
            <Clock size={20} className="text-libsmart-blue" />
            <div>
              <p className="text-sm font-medium text-black">Weekdays</p>
              <p className="text-xs text-libsmart-slate">9:00 AM - 6:00 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-libsmart-slate/5 rounded-lg">
            <Clock size={20} className="text-libsmart-blue" />
            <div>
              <p className="text-sm font-medium text-black">Weekends</p>
              <p className="text-xs text-libsmart-slate">10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      <FormModal
        isOpen={isAddModalOpen}
        title="Add New Branch"
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBranch}
        submitText="Add Branch"
        isLoading={isSubmitting}
      >
        <BranchFormFields formData={formData} setFormData={setFormData} idPrefix="add" />
      </FormModal>

      <FormModal
        isOpen={isEditModalOpen}
        title={`Edit ${selectedBranch?.name || 'Branch'}`}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditBranch}
        submitText="Update Branch"
        isLoading={isSubmitting}
      >
        <BranchFormFields formData={formData} setFormData={setFormData} idPrefix="edit" />
      </FormModal>

      {selectedBranch && (
        <ViewModal isOpen={isViewModalOpen} title={selectedBranch.name} onClose={() => setIsViewModalOpen(false)}>
          <div className="space-y-3 text-sm text-black">
            <p><span className="font-semibold">ID:</span> BR-{String(selectedBranch.id).padStart(3, '0')}</p>
            <p><span className="font-semibold">Location:</span> {selectedBranch.location || '-'}</p>
            <p><span className="font-semibold">Created:</span> {new Date(selectedBranch.createdAt).toLocaleString()}</p>
          </div>
        </ViewModal>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Branch"
        message={`Delete ${selectedBranch?.name || 'this branch'}? This action cannot be undone.`}
        onConfirm={handleDeleteBranch}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="Delete"
        isDangerous
        isLoading={isSubmitting}
      />
    </div>
  );
}

function BranchFormFields({
  formData,
  setFormData,
  idPrefix,
}: {
  formData: BranchForm;
  setFormData: React.Dispatch<React.SetStateAction<BranchForm>>;
  idPrefix: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={`${idPrefix}-name`} className="block text-sm font-medium text-black mb-1">Branch Name *</label>
        <input
          id={`${idPrefix}-name`}
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-location`} className="block text-sm font-medium text-black mb-1">Location</label>
        <input
          id={`${idPrefix}-location`}
          value={formData.location}
          onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
          className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
        />
      </div>
    </div>
  );
}
