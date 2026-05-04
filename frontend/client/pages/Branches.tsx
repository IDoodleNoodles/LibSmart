import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Plus, MapPin, Phone, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormModal from '@/components/Modals/FormModal';
import ConfirmModal from '@/components/Modals/ConfirmModal';
import ViewModal from '@/components/Modals/ViewModal';
import { branchRecords } from '../lib/mockData';

interface Branch {
  id: string;
  name: string;
  location: string;
  contact: string;
  manager: string;
  status: 'Active' | 'Inactive';
  employees: number;
}

export default function Branches() {
  const [searchQuery, setSearchQuery] = useState('');
  const [branches, setBranches] = useState<Branch[]>(branchRecords);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState<{ name: string; location: string; contact: string; manager: string; employees: number; status: 'Active' | 'Inactive' }>({ name: '', location: '', contact: '', manager: '', employees: 0, status: 'Active' });

  const openAddModal = () => {
    setFormData({ name: '', location: '', contact: '', manager: '', employees: 0, status: 'Active' });
    setIsAddModalOpen(true);
  };

  const openEditModal = (branch: Branch) => {
    setSelectedBranch(branch);
    setFormData({ name: branch.name, location: branch.location, contact: branch.contact, manager: branch.manager, employees: branch.employees, status: branch.status });
    setIsEditModalOpen(true);
  };

  const openViewModal = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDeleteModalOpen(true);
  };

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.contact) {
      alert('Please fill in all required fields');
      return;
    }
    const newBranch: Branch = {
      id: `BR-${String(branches.length + 1).padStart(3, '0')}`,
      ...formData,
      status: formData.status,
    };
    setBranches([...branches, newBranch]);
    setIsAddModalOpen(false);
  };

  const handleEditBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranch) return;
    setBranches(branches.map(b => b.id === selectedBranch.id ? { ...selectedBranch, ...formData } : b));
    setIsEditModalOpen(false);
  };

  const handleDeleteBranch = () => {
    if (selectedBranch) {
      setBranches(branches.filter(b => b.id !== selectedBranch.id));
      setIsDeleteModalOpen(false);
    }
  };

  const branchesData = branches;
  const filteredBranches = branchesData.filter((branch) =>
    [branch.id, branch.name, branch.location, branch.contact, branch.manager, branch.status, branch.employees].join(' ').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Branches Management</h1>
        <p className="text-libsmart-slate">Oversee all library branch locations and their operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <p className="text-sm text-libsmart-slate mb-2">Total Branches</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-black">12</p>
            <p className="text-sm text-libsmart-blue font-medium">+1</p>
          </div>
        </div>
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <p className="text-sm text-libsmart-slate mb-2">Active Locations</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-black">11</p>
            <p className="text-sm text-green-600 font-medium">92%</p>
          </div>
        </div>
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <p className="text-sm text-libsmart-slate mb-2">Total Staff</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-black">87</p>
            <p className="text-sm text-libsmart-blue font-medium">+12</p>
          </div>
        </div>
      </div>

      {/* Branches Table */}
      <div className="bg-white border border-libsmart-slate/20 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-libsmart-slate/20 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-lg font-bold text-black">Branch Locations</h2>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="relative w-full sm:max-w-sm">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-libsmart-slate/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search branches by name, contact, location..."
                className="w-full pl-10 pr-4 py-2 border border-libsmart-slate/20 rounded-lg bg-white text-black placeholder-libsmart-slate/50 focus:outline-none focus:ring-2 focus:ring-libsmart-blue focus:border-transparent"
              />
            </div>
            <Button onClick={openAddModal} className="gap-2 bg-libsmart-blue hover:bg-libsmart-blue/90">
              <Plus size={18} />
              Add Branch
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-libsmart-slate/5 border-b border-libsmart-slate/20">
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Manager</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Staff</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBranches.length > 0 ? filteredBranches.map((row) => (
                <tr key={row.id} className="border-b border-libsmart-slate/10 hover:bg-libsmart-slate/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-libsmart-blue">{row.id}</td>
                  <td className="px-6 py-4 text-sm text-black font-medium">{row.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="flex items-center gap-1 text-black">
                      <MapPin size={14} className="text-libsmart-slate" />
                      {row.location}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="flex items-center gap-1 text-black">
                      <Phone size={14} className="text-libsmart-slate" />
                      {row.contact}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-black">{row.manager}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-libsmart-blue/10 text-libsmart-blue rounded-full text-xs font-medium">
                      {row.employees} staff
                    </span>
                  </td>
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
              )) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-sm text-libsmart-slate">
                    No branches match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Branch Hours Card */}
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

      {/* Add Branch Modal */}
      <FormModal
        isOpen={isAddModalOpen}
        title="Add New Branch"
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBranch}
        submitText="Add Branch"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
              Branch Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Downtown Branch"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-black mb-1">
              Location *
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Main Street"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-black mb-1">
              Contact Number *
            </label>
            <input
              type="text"
              id="contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="e.g., 123-456-7890"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div>
            <label htmlFor="manager" className="block text-sm font-medium text-black mb-1">
              Manager Name
            </label>
            <input
              type="text"
              id="manager"
              value={formData.manager}
              onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
              placeholder="e.g., John Smith"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div>
            <label htmlFor="employees" className="block text-sm font-medium text-black mb-1">
              Number of Employees
            </label>
            <input
              type="number"
              id="employees"
              value={formData.employees}
              onChange={(e) => setFormData({ ...formData, employees: parseInt(e.target.value) || 0 })}
              placeholder="e.g., 8"
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

      {/* Edit Branch Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        title={`Edit ${selectedBranch?.name || 'Branch'}`}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditBranch}
        submitText="Update Branch"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-black mb-1">
              Branch Name *
            </label>
            <input
              type="text"
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Downtown Branch"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div>
            <label htmlFor="edit-location" className="block text-sm font-medium text-black mb-1">
              Location *
            </label>
            <input
              type="text"
              id="edit-location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Main Street"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div>
            <label htmlFor="edit-contact" className="block text-sm font-medium text-black mb-1">
              Contact Number *
            </label>
            <input
              type="text"
              id="edit-contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="e.g., 123-456-7890"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div>
            <label htmlFor="edit-manager" className="block text-sm font-medium text-black mb-1">
              Manager Name
            </label>
            <input
              type="text"
              id="edit-manager"
              value={formData.manager}
              onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
              placeholder="e.g., John Smith"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div>
            <label htmlFor="edit-employees" className="block text-sm font-medium text-black mb-1">
              Number of Employees
            </label>
            <input
              type="number"
              id="edit-employees"
              value={formData.employees}
              onChange={(e) => setFormData({ ...formData, employees: parseInt(e.target.value) || 0 })}
              placeholder="e.g., 8"
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

      {/* View Branch Modal */}
      {selectedBranch && (
        <ViewModal
          isOpen={isViewModalOpen}
          title={selectedBranch.name}
          onClose={() => setIsViewModalOpen(false)}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Branch ID</p>
                <p className="text-sm text-black font-medium">{selectedBranch.id}</p>
              </div>
              <div>
                <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  selectedBranch.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-libsmart-slate/20 text-libsmart-slate'
                }`}>
                  {selectedBranch.status}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Location</p>
              <p className="text-sm text-black">{selectedBranch.location}</p>
            </div>
            <div>
              <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Contact Number</p>
              <p className="text-sm text-black">{selectedBranch.contact}</p>
            </div>
            <div>
              <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Branch Manager</p>
              <p className="text-sm text-black">{selectedBranch.manager || 'Not assigned'}</p>
            </div>
            <div>
              <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Number of Employees</p>
              <p className="text-sm text-black">{selectedBranch.employees} staff members</p>
            </div>
          </div>
        </ViewModal>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Branch"
        message={`Are you certain you wish to proceed with the deletion of ${selectedBranch?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteBranch}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="Delete Branch"
        isDangerous={true}
      />
    </div>
  );
}
