import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-libsmart-slate/20 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h1 className="text-2xl font-bold text-black">LibSmart</h1>
            <p className="text-xs font-semibold text-libsmart-slate tracking-wider">LIBRARY</p>
          </div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-libsmart-slate hover:text-black hover:bg-libsmart-slate/10">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-libsmart-blue hover:bg-libsmart-blue/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-libsmart-blue/10 rounded-2xl flex items-center justify-center">
              <BookOpen size={40} className="text-libsmart-blue" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h2 className="text-4xl md:text-5xl font-bold text-black">
              Welcome to LibSmart
            </h2>
            <p className="text-xl text-libsmart-slate">
              Your comprehensive library management system for seamless book tracking, user management, and branch operations.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
            <div className="space-y-3">
              <div className="text-4xl font-bold text-libsmart-blue">2.5K+</div>
              <p className="text-libsmart-slate">Active Book Loans</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-libsmart-blue">1.8K+</div>
              <p className="text-libsmart-slate">Registered Users</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-libsmart-blue">12</div>
              <p className="text-libsmart-slate">Branch Locations</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/login" className="flex-1 sm:flex-none">
              <Button className="w-full bg-libsmart-blue hover:bg-libsmart-blue/90 px-8">
                Sign In
              </Button>
            </Link>
            <Link to="/register" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full border-libsmart-slate/20 text-libsmart-slate hover:bg-libsmart-slate/10 px-8">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-libsmart-slate/20 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-libsmart-slate">
          <p>&copy; 2024 LibSmart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
