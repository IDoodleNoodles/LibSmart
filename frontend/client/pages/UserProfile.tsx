import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit2, Save, X, KeyRound, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getMembershipInfo, getProfile, getProfilePhoto, updateProfile, uploadProfilePhoto } from '../services/api';
import { useAuth } from '@/contexts/AuthContext';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { useToast } from '@/hooks/use-toast';

type ProfileState = {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string | null;
};

export default function UserProfile() {
  const { username } = useParams();
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingMembership, setIsLoadingMembership] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [membershipId, setMembershipId] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [profileLoaded, setProfileLoaded] = useState<boolean>(false);
  const [formData, setFormData] = useState<ProfileState>({
    fullName: '',
    username: username ?? authUser?.username ?? '',
    email: '',
    phone: '',
    address: '',
    createdAt: null,
  });

  useEffect(() => {
    let cancelled = false;
    let currentPhotoUrl: string | null = null;

    const loadProfile = async () => {
      try {
        const profile = await getProfile();

        if (cancelled) {
          return;
        }

        setFormData({
          fullName: profile.fullName ?? '',
          username: profile.username || username || authUser?.username || '',
          email: profile.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
          createdAt: profile.createdAt || null,
        });
        setProfileLoaded(true);

        if (profile.hasProfilePhoto) {
          // keep the current real photo in sync when the page loads
          try {
            const photoBlob = await getProfilePhoto();
            if (!cancelled) {
              currentPhotoUrl = URL.createObjectURL(photoBlob);
              setPhotoUrl(currentPhotoUrl);
            }
          } catch {
            if (!cancelled) {
              setPhotoUrl(null);
            }
          }
        }
      } catch {
        if (!cancelled && authUser) {
          setFormData(prev => ({
            ...prev,
            fullName: authUser.fullName ?? prev.fullName,
            username: username || authUser.username || prev.username,
          }));
          setProfileLoaded(Boolean(authUser.fullName));
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
      if (currentPhotoUrl) {
        URL.revokeObjectURL(currentPhotoUrl);
      }
    };
  }, [authUser?.fullName, authUser?.username, username]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const persistProfile = async () => {
      try {
        const updated = await updateProfile({
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
        });

        setFormData(prev => ({
          ...prev,
          fullName: updated.fullName,
          username: updated.username,
          email: updated.email,
          phone: updated.phone || '',
          address: updated.address || '',
          createdAt: updated.createdAt,
        }));
        setIsEditing(false);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Unable to save profile',
          description: error instanceof Error ? error.message : 'Please try again later.',
        });
      }
    };

    void persistProfile();
  };

  const handlePhotoButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploadingPhoto(true);

    try {
      await uploadProfilePhoto(file);
      const photoBlob = await getProfilePhoto();
      const nextPhotoUrl = URL.createObjectURL(photoBlob);
      setPhotoUrl(prev => {
        if (prev) {
          URL.revokeObjectURL(prev);
        }
        return nextPhotoUrl;
      });
      toast({
        title: 'Profile photo updated',
        description: 'Your new profile picture has been saved.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Unable to update profile photo',
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleRequestMembershipId = async () => {
    setIsLoadingMembership(true);

    try {
      const membershipInfo = await getMembershipInfo();
      setMembershipId(membershipInfo.membershipId);
      setFormData(prev => ({
        ...prev,
        createdAt: membershipInfo.memberSince,
      }));
      toast({
        title: 'Membership ID requested',
        description: `Your membership ID is ${membershipInfo.membershipId}.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Unable to request membership ID',
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      setIsLoadingMembership(false);
    }
  };

  const memberSince = formData.createdAt
    ? new Date(formData.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not available';

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
        <div className="bg-libsmart-blue/10 p-8 flex items-end gap-4 flex-wrap">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-white shadow-sm">
              <AvatarImage src={photoUrl || undefined} alt={formData.fullName} className="object-cover" />
                <AvatarFallback className="bg-libsmart-blue/20 text-libsmart-blue text-2xl font-semibold">
                  {profileLoaded && formData.fullName
                    ? formData.fullName
                        .split(' ')
                        .map(part => part[0])
                        .slice(0, 2)
                        .join('')
                    : 'U'}
                </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={handlePhotoButtonClick}
              className="absolute -bottom-1 -right-1 rounded-full bg-libsmart-blue p-2 text-white shadow-lg transition-transform hover:scale-105"
              aria-label="Change profile picture"
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
          <div className="flex-1 min-w-0">
            {profileLoaded ? (
              <h2 className="text-2xl font-bold text-black">{formData.fullName}</h2>
            ) : (
              <SkeletonLoader width={220} height={28} className="mb-1" />
            )}
            <p className="text-libsmart-slate">@{formData.username}</p>
            <Button
              type="button"
              onClick={handlePhotoButtonClick}
              disabled={isUploadingPhoto}
              variant="ghost"
              className="mt-3 gap-2 px-0 text-libsmart-blue hover:bg-transparent hover:text-libsmart-blue/80"
            >
              <Camera size={16} />
              {isUploadingPhoto ? 'Uploading photo...' : 'Change photo'}
            </Button>
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
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <p className="text-xs text-libsmart-slate uppercase font-semibold mb-2">Membership ID</p>
              <p className="text-2xl font-bold text-libsmart-blue mb-4">{membershipId || 'Not requested yet'}</p>
            </div>
            <Button
              type="button"
              onClick={handleRequestMembershipId}
              disabled={isLoadingMembership}
              variant="outline"
              className="gap-2 border-libsmart-slate/20 text-libsmart-blue hover:bg-libsmart-blue/10"
            >
              <KeyRound size={16} />
              {isLoadingMembership ? 'Requesting' : membershipId ? 'Refresh ID' : 'Request ID'}
            </Button>
          </div>
          <p className="text-sm text-libsmart-slate">Use this ID for in-library identification</p>
        </div>
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6">
          <p className="text-xs text-libsmart-slate uppercase font-semibold mb-2">Member Since</p>
          <p className="text-2xl font-bold text-libsmart-blue mb-4">{memberSince}</p>
          <p className="text-sm text-libsmart-slate">Account created from your real profile record</p>
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
