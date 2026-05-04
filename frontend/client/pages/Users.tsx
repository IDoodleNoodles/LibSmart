import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Plus, Shield, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormModal from '@/components/Modals/FormModal';
import ConfirmModal from '@/components/Modals/ConfirmModal';
import ViewModal from '@/components/Modals/ViewModal';
import { userAccounts } from '../lib/mockData';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'Member' | 'Librarian' | 'Admin';
  status: 'Active' | 'Inactive';
  joinDate: string;
}

export default function Users() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserData[]>(userAccounts);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<{ name: string; email: string; role: 'Member' | 'Librarian' | 'Admin'; status: 'Active' | 'Inactive' }>({ name: '', email: '', role: 'Member', status: 'Active' });

  const openAddModal = () => {
    setFormData({ name: '', email: '', role: 'Member', status: 'Active' });
    setIsAddModalOpen(true);
  };

  const openEditModal = (user: UserData) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, status: user.status });
    setIsEditModalOpen(true);
  };

  const openViewModal = (user: UserData) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (user: UserData) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }
    const newUser: UserData = {
      id: `US-${String(users.length + 1).padStart(3, '0')}`,
      ...formData,
      joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }),
    };
    setUsers([...users, newUser]);
    setIsAddModalOpen(false);
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setUsers(users.map(u => u.id === selectedUser.id ? { ...selectedUser, ...formData } : u));
    setIsEditModalOpen(false);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
    }
  };

  const getRoleIcon = (role: string) => {
    if (role === 'Admin') return '👑';
    if (role === 'Librarian') return '📚';
    return '👤';
  };

  const usersData = users;
  const filteredUsers = usersData.filter((user) =>
    [user.id, user.name, user.email, user.role, user.status, user.joinDate].join(' ').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Users Management</h1>
        <p className="text-libsmart-slate">Manage library members and staff accounts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <p className="text-sm text-libsmart-slate mb-2">Total Users</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-black">1,843</p>
            <p className="text-sm text-libsmart-blue font-medium">+45</p>
          </div>
        </div>
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <p className="text-sm text-libsmart-slate mb-2">Active Members</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-black">1,621</p>
            <p className="text-sm text-green-600 font-medium">88%</p>
          </div>
        </div>
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <p className="text-sm text-libsmart-slate mb-2">Librarians</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-black">42</p>
            <p className="text-sm text-libsmart-blue font-medium">+3</p>
          </div>
        </div>
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <p className="text-sm text-libsmart-slate mb-2">Admins</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-black">5</p>
            <p className="text-sm text-libsmart-slate font-medium">—</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-libsmart-slate/20 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-libsmart-slate/20 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-lg font-bold text-black">User Accounts</h2>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="relative w-full sm:max-w-sm">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-libsmart-slate/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by name, email, role..."
                className="w-full pl-10 pr-4 py-2 border border-libsmart-slate/20 rounded-lg bg-white text-black placeholder-libsmart-slate/50 focus:outline-none focus:ring-2 focus:ring-libsmart-blue focus:border-transparent"
              />
            </div>
            <Button onClick={openAddModal} className="gap-2 bg-libsmart-blue hover:bg-libsmart-blue/90">
              <Plus size={18} />
              Add User
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-libsmart-slate/5 border-b border-libsmart-slate/20">
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? filteredUsers.map((row) => (
                <tr key={row.id} className="border-b border-libsmart-slate/10 hover:bg-libsmart-slate/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-libsmart-blue">{row.id}</td>
                  <td className="px-6 py-4 text-sm text-black font-medium">{row.name}</td>
                  <td className="px-6 py-4 text-sm text-black">{row.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="flex items-center gap-2">
                      <span>{getRoleIcon(row.role)}</span>
                      <span className="text-black">{row.role}</span>
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
                  <td className="px-6 py-4 text-sm text-black">{row.joinDate}</td>
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
                    No users match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <FormModal
        isOpen={isAddModalOpen}
        title="Add New User"
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddUser}
        submitText="Add User"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., John Smith"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g., john@example.com"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-black mb-1">
              Role
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Member' | 'Librarian' | 'Admin' })}
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            >
              <option value="Member">Member</option>
              <option value="Librarian">Librarian</option>
              <option value="Admin">Admin</option>
            </select>
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

      {/* Edit User Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        title={`Edit ${selectedUser?.name || 'User'}`}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditUser}
        submitText="Update User"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-black mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., John Smith"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div>
            <label htmlFor="edit-email" className="block text-sm font-medium text-black mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="edit-email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g., john@example.com"
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            />
          </div>
          <div>
            <label htmlFor="edit-role" className="block text-sm font-medium text-black mb-1">
              Role
            </label>
            <select
              id="edit-role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Member' | 'Librarian' | 'Admin' })}
              className="w-full px-3 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
            >
              <option value="Member">Member</option>
              <option value="Librarian">Librarian</option>
              <option value="Admin">Admin</option>
            </select>
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

      {/* View User Modal */}
      {selectedUser && (
        <ViewModal
          isOpen={isViewModalOpen}
          title={selectedUser.name}
          onClose={() => setIsViewModalOpen(false)}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">User ID</p>
                <p className="text-sm text-black font-medium">{selectedUser.id}</p>
              </div>
              <div>
                <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  selectedUser.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-libsmart-slate/20 text-libsmart-slate'
                }`}>
                  {selectedUser.status}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Email</p>
              <p className="text-sm text-black">{selectedUser.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Role</p>
                <p className="text-sm text-black flex items-center gap-2">
                  <span>{getRoleIcon(selectedUser.role)}</span>
                  {selectedUser.role}
                </p>
              </div>
              <div>
                <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Join Date</p>
                <p className="text-sm text-black">{selectedUser.joinDate}</p>
              </div>
            </div>
          </div>
        </ViewModal>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete User"
        message={`Are you certain you wish to proceed with the deletion of ${selectedUser?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteUser}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="Delete User"
        isDangerous={true}
      />
    </div>
  );
}
