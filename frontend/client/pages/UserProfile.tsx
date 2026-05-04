import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { defaultUserName, mockUserProfile } from '../lib/mockData';

export default function UserProfile() {
  const { username } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: mockUserProfile.fullName,
    username: username ?? defaultUserName,
    email: mockUserProfile.email,
    phone: mockUserProfile.phone,
    address: mockUserProfile.address,
    membershipDate: mockUserProfile.membershipDate,
    membershipId: mockUserProfile.membershipId,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">My Profile</h1>
        <p className="text-libsmart-slate">Manage your account information and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-libsmart-slate/20 rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-libsmart-blue/10 p-8 flex items-end gap-4">
          <div className="w-24 h-24 rounded-full bg-libsmart-blue/20 flex items-center justify-center">
            <User size={48} className="text-libsmart-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-black">{formData.fullName}</h2>
            <p className="text-libsmart-slate">@{formData.username}</p>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-black">Personal Information</h3>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="gap-2 border-libsmart-slate/20 text-libsmart-blue hover:bg-libsmart-blue/10"
              >
                <Edit2 size={16} />
                Edit Profile
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-black mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-black mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-libsmart-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-libsmart-blue"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  className="flex-1 gap-2 bg-libsmart-blue hover:bg-libsmart-blue/90"
                >
                  <Save size={16} />
                  Save Changes
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="flex-1 gap-2 border-libsmart-slate/20 text-libsmart-slate hover:bg-libsmart-slate/10"
                >
                  <X size={16} />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b border-libsmart-slate/10">
                <Mail size={20} className="text-libsmart-blue flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Email Address</p>
                  <p className="text-black">{formData.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-4 border-b border-libsmart-slate/10">
                <Phone size={20} className="text-libsmart-blue flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Phone Number</p>
                  <p className="text-black">{formData.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin size={20} className="text-libsmart-blue flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Address</p>
                  <p className="text-black">{formData.address}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Membership Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6">
          <p className="text-xs text-libsmart-slate uppercase font-semibold mb-2">Membership ID</p>
          <p className="text-2xl font-bold text-libsmart-blue mb-4">{formData.membershipId}</p>
          <p className="text-sm text-libsmart-slate">Use this ID for in-library identification</p>
        </div>
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6">
          <p className="text-xs text-libsmart-slate uppercase font-semibold mb-2">Member Since</p>
          <p className="text-2xl font-bold text-libsmart-blue mb-4">{formData.membershipDate}</p>
          <p className="text-sm text-libsmart-slate">Active member for ~6 months</p>
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Account Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-libsmart-slate/10">
            <div>
              <p className="font-medium text-black">Change Password</p>
              <p className="text-sm text-libsmart-slate">Update your password to keep your account secure</p>
            </div>
            <Link to={`/${formData.username}/change-password`}>
              <Button variant="outline" className="border-libsmart-slate/20 text-libsmart-blue hover:bg-libsmart-blue/10">
                Change
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-black">Two-Factor Authentication</p>
              <p className="text-sm text-libsmart-slate">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline" className="border-libsmart-slate/20 text-libsmart-blue hover:bg-libsmart-blue/10">
              Enable
            </Button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-black">Due Date Reminders</p>
              <p className="text-sm text-libsmart-slate">Get notified before your books are due</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-libsmart-blue rounded" />
          </div>
          <div className="flex items-center justify-between border-t border-libsmart-slate/10 pt-4">
            <div>
              <p className="font-medium text-black">New Book Notifications</p>
              <p className="text-sm text-libsmart-slate">Get notified when new books arrive</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-libsmart-blue rounded" />
          </div>
          <div className="flex items-center justify-between border-t border-libsmart-slate/10 pt-4">
            <div>
              <p className="font-medium text-black">Library Updates</p>
              <p className="text-sm text-libsmart-slate">Receive updates about library events and news</p>
            </div>
            <input type="checkbox" className="w-5 h-5 accent-libsmart-blue rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
