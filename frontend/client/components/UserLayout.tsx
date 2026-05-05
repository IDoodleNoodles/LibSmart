import React, { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Search, LogOut, Home, BookOpen, History, User as UserIcon } from 'lucide-react';
import { getProfile } from '../services/api';

interface UserLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: 'Browse Books', icon: BookOpen, key: 'browse' },
  { label: 'My Books', icon: History, key: 'my-books' },
];

export default function UserLayout({ children }: UserLayoutProps) {
  const location = useLocation();
  const { username } = useParams();
  const [profile, setProfile] = useState({ fullName: 'Loading...', username: username || 'user' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const basePath = `/${username || profile.username}`;
  const dashboardPath = `${basePath}/dashboard`;
  const browsePath = `${basePath}/browse`;
  const myBooksPath = `${basePath}/my-books`;
  const profilePath = `${basePath}/profile`;
  
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
            <li>
              <Link
                to={dashboardPath}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === dashboardPath
                    ? 'bg-libsmart-blue text-white'
                    : 'text-libsmart-slate hover:bg-libsmart-slate/10'
                }`}
              >
                <Home size={20} />
                <span className="font-medium">Dashboard</span>
              </Link>
            </li>
            {navItems.map((item) => {
              const Icon = item.icon;
              const itemPath = item.key === 'browse' ? browsePath : myBooksPath;
              const isActive = location.pathname === itemPath;
              return (
                <li key={item.key}>
                  <Link
                    to={itemPath}
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
            <li>
              <Link
                to={profilePath}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === profilePath
                    ? 'bg-libsmart-blue text-white'
                    : 'text-libsmart-slate hover:bg-libsmart-slate/10'
                }`}
              >
                <UserIcon size={20} />
                <span className="font-medium">Profile</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-libsmart-slate/20">
          <div className="mb-4 pb-4 border-b border-libsmart-slate/20">
            <p className="font-semibold text-black text-sm">{profile.fullName}</p>
            <p className="text-xs text-libsmart-slate">Member</p>
          </div>
          <Link
            to="/welcome"
            onClick={() => {
              localStorage.removeItem('auth_token');
              localStorage.removeItem('auth_user');
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
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-libsmart-slate/50" />
                <input
                  type="text"
                  placeholder="Search books or authors"
                  className="w-full pl-10 pr-4 py-2 border border-libsmart-slate/20 rounded-lg bg-white text-black placeholder-libsmart-slate/50 focus:outline-none focus:ring-2 focus:ring-libsmart-blue focus:border-transparent"
                />
              </div>
            </div>

            <div className="w-10 h-10 rounded-full bg-libsmart-blue/20 flex items-center justify-center">
              <UserIcon size={20} className="text-libsmart-blue" />
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
