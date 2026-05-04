import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboardBooks, dashboardBranches, dashboardBranchNetwork, dashboardOverdueBorrowers, dashboardStats, dashboardUsers } from '../lib/mockData';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'users' | 'branches'>('overview');
  const [overdueSearch, setOverdueSearch] = useState('');
  const [branchSearch, setBranchSearch] = useState('');
  const [managementSearch, setManagementSearch] = useState('');

  const stats = dashboardStats;
  const overdueData = dashboardOverdueBorrowers;
  const branchData = dashboardBranchNetwork;
  const booksData = dashboardBooks;
  const usersData = dashboardUsers;
  const branchesData = dashboardBranches;

  const filteredOverdueData = overdueData.filter((row) =>
    [row.id, row.userName, row.bookTitle, row.daysOverdue].join(' ').toLowerCase().includes(overdueSearch.toLowerCase())
  );

  const filteredBranchData = branchData.filter((row) =>
    [row.id, row.name, row.location, row.status].join(' ').toLowerCase().includes(branchSearch.toLowerCase())
  );

  const filteredManagementData = (() => {
    const search = managementSearch.toLowerCase();
    if (activeTab === 'books') {
      return booksData.filter((row) => [row.id, row.name, row.type, row.language].join(' ').toLowerCase().includes(search));
    }
    if (activeTab === 'users') {
      return usersData.filter((row) => [row.id, row.name, row.email, row.username].join(' ').toLowerCase().includes(search));
    }
    return branchesData.filter((row) => [row.id, row.name, row.contact, row.location].join(' ').toLowerCase().includes(search));
  })();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Dashboard</h1>
        <p className="text-libsmart-slate">Welcome back! Here's your library overview.</p>
      </div>

      {/* Statistics Cards */}
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

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Borrowers */}
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
                {filteredOverdueData.length > 0 ? filteredOverdueData.map((row) => (
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
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm text-libsmart-slate">
                        No overdue borrowers match your search.
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Branch Network */}
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBranchData.length > 0 ? filteredBranchData.map((row) => (
                  <tr key={row.id} className="border-b border-libsmart-slate/10 hover:bg-libsmart-slate/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-libsmart-blue">{row.id}</td>
                    <td className="px-6 py-4 text-sm text-black">{row.name}</td>
                    <td className="px-6 py-4 text-sm text-black">{row.location}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        row.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-libsmart-slate/20 text-libsmart-slate'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                  )) : (
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

      {/* Management Tables */}
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-libsmart-slate/20">
          {(['books', 'users', 'branches'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? 'text-libsmart-blue border-libsmart-blue'
                  : 'text-libsmart-slate border-transparent hover:text-black'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Management
            </button>
          ))}
        </div>

        {/* Books Table */}
        {activeTab === 'books' && (
          <div className="bg-white border border-libsmart-slate/20 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-libsmart-slate/20 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="text-lg font-bold text-black">Books</h2>
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <div className="relative w-full sm:max-w-sm">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-libsmart-slate/50" />
                  <input
                    type="text"
                    value={managementSearch}
                    onChange={(e) => setManagementSearch(e.target.value)}
                    placeholder="Search books"
                    className="w-full pl-10 pr-4 py-2 border border-libsmart-slate/20 rounded-lg bg-white text-black placeholder-libsmart-slate/50 focus:outline-none focus:ring-2 focus:ring-libsmart-blue focus:border-transparent"
                  />
                </div>
                <Button className="gap-2 bg-libsmart-blue hover:bg-libsmart-blue/90">
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
                    <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Language</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredManagementData.length > 0 ? filteredManagementData.map((row) => (
                    <tr key={row.id} className="border-b border-libsmart-slate/10 hover:bg-libsmart-slate/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-libsmart-blue">{row.id}</td>
                      <td className="px-6 py-4 text-sm text-black">{row.name}</td>
                      <td className="px-6 py-4 text-sm text-black">{row.type}</td>
                      <td className="px-6 py-4 text-sm text-black">{row.language}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-libsmart-slate/10 rounded-lg transition-colors text-libsmart-slate hover:text-libsmart-blue">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 hover:bg-libsmart-slate/10 rounded-lg transition-colors text-libsmart-slate hover:text-libsmart-blue">
                            <Pencil size={16} />
                          </button>
                          <button className="p-2 hover:bg-red-100 rounded-lg transition-colors text-libsmart-slate hover:text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-sm text-libsmart-slate">
                        No books match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Table */}
        {activeTab === 'users' && (
          <div className="bg-white border border-libsmart-slate/20 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-libsmart-slate/20 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="text-lg font-bold text-black">Users</h2>
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <div className="relative w-full sm:max-w-sm">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-libsmart-slate/50" />
                  <input
                    type="text"
                    value={managementSearch}
                    onChange={(e) => setManagementSearch(e.target.value)}
                    placeholder="Search users"
                    className="w-full pl-10 pr-4 py-2 border border-libsmart-slate/20 rounded-lg bg-white text-black placeholder-libsmart-slate/50 focus:outline-none focus:ring-2 focus:ring-libsmart-blue focus:border-transparent"
                  />
                </div>
                <Button className="gap-2 bg-libsmart-blue hover:bg-libsmart-blue/90">
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
                    <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredManagementData.length > 0 ? filteredManagementData.map((row) => (
                    <tr key={row.id} className="border-b border-libsmart-slate/10 hover:bg-libsmart-slate/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-libsmart-blue">{row.id}</td>
                      <td className="px-6 py-4 text-sm text-black">{row.name}</td>
                      <td className="px-6 py-4 text-sm text-black">{row.email}</td>
                      <td className="px-6 py-4 text-sm text-black">{row.username}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-libsmart-slate/10 rounded-lg transition-colors text-libsmart-slate hover:text-libsmart-blue">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 hover:bg-libsmart-slate/10 rounded-lg transition-colors text-libsmart-slate hover:text-libsmart-blue">
                            <Pencil size={16} />
                          </button>
                          <button className="p-2 hover:bg-red-100 rounded-lg transition-colors text-libsmart-slate hover:text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-sm text-libsmart-slate">
                        No users match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Branches Table */}
        {activeTab === 'branches' && (
          <div className="bg-white border border-libsmart-slate/20 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-libsmart-slate/20 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="text-lg font-bold text-black">Branches</h2>
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <div className="relative w-full sm:max-w-sm">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-libsmart-slate/50" />
                  <input
                    type="text"
                    value={managementSearch}
                    onChange={(e) => setManagementSearch(e.target.value)}
                    placeholder="Search branches"
                    className="w-full pl-10 pr-4 py-2 border border-libsmart-slate/20 rounded-lg bg-white text-black placeholder-libsmart-slate/50 focus:outline-none focus:ring-2 focus:ring-libsmart-blue focus:border-transparent"
                  />
                </div>
                <Button className="gap-2 bg-libsmart-blue hover:bg-libsmart-blue/90">
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
                    <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-libsmart-slate uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredManagementData.length > 0 ? filteredManagementData.map((row) => (
                    <tr key={row.id} className="border-b border-libsmart-slate/10 hover:bg-libsmart-slate/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-libsmart-blue">{row.id}</td>
                      <td className="px-6 py-4 text-sm text-black">{row.name}</td>
                      <td className="px-6 py-4 text-sm text-black">{row.contact}</td>
                      <td className="px-6 py-4 text-sm text-black">{row.location}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-libsmart-slate/10 rounded-lg transition-colors text-libsmart-slate hover:text-libsmart-blue">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 hover:bg-libsmart-slate/10 rounded-lg transition-colors text-libsmart-slate hover:text-libsmart-blue">
                            <Pencil size={16} />
                          </button>
                          <button className="p-2 hover:bg-red-100 rounded-lg transition-colors text-libsmart-slate hover:text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-sm text-libsmart-slate">
                        No branches match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
