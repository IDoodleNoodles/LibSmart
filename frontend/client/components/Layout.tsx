import React, { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, BookOpen, Users, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: 'Dashboard', icon: LayoutGrid, path: '/' },
  { label: 'Catalog', icon: BookOpen, path: '/catalog' },
  { label: 'Books', icon: BookOpen, path: '/books' },
  { label: 'Users', icon: Users, path: '/users' },
  { label: 'Branches', icon: MapPin, path: '/branches' },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { logout, user, role } = useAuth();
  const [profileLoaded, setProfileLoaded] = useState(Boolean(user?.fullName));
  const [profile, setProfile] = useState({ fullName: user?.fullName ?? '', role: role ?? 'ADMIN' });

  useEffect(() => {
    if (user?.fullName) {
      setProfile((prev) => ({ ...prev, fullName: user.fullName }));
      setProfileLoaded(true);
    }
  }, [role, user?.fullName]);

  const currentTime = new Date();
  const formattedTime = currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-libsmart-slate/20 flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-libsmart-slate/20">
          <div className="flex items-baseline gap-2">
            <h1 className="text-2xl font-bold text-black">LibSmart</h1>
            <p className="text-xs font-semibold text-libsmart-slate tracking-wider">LIBRARY</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-libsmart-blue text-white'
                        : 'text-libsmart-slate hover:bg-libsmart-slate/10'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-libsmart-slate/20">
          <div className="mb-4 pb-4 border-b border-libsmart-slate/20">
            {profileLoaded ? (
              <p className="font-semibold text-black text-sm">{profile.fullName}</p>
            ) : (
              <SkeletonLoader width={120} height={16} />
            )}
            <p className="text-xs text-libsmart-slate">{profile.role}</p>
          </div>
          <Link
            to="/welcome"
            onClick={(event) => {
              event.preventDefault();
              logout();
            }}
            className="flex w-full items-center gap-2 rounded-md px-4 py-2.5 text-sm text-libsmart-slate transition-colors hover:bg-libsmart-slate/10 hover:text-libsmart-slate"
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-libsmart-slate/20 bg-white">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-libsmart-slate">
              <span className="font-medium">{formattedTime}</span>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
