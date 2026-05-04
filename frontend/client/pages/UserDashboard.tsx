import React from 'react';
import { BookOpen, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useParams } from 'react-router-dom';
import { defaultUserName, userBorrowedBooks, userPopularBooks } from '../lib/mockData';

export default function UserDashboard() {
  const { username } = useParams();
  const browsePath = `/${username ?? defaultUserName}/browse`;
  const myBooksPath = `/${username ?? defaultUserName}/my-books`;
  const borrowedBooks = userBorrowedBooks;
  const popularBooks = userPopularBooks;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Welcome back, Sarah!</h1>
        <p className="text-libsmart-slate">Manage your books and explore our library</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-libsmart-slate mb-2">Books Borrowed</p>
              <p className="text-3xl font-bold text-black">3</p>
            </div>
            <BookOpen size={24} className="text-libsmart-blue" />
          </div>
          <p className="text-xs text-libsmart-slate">Active loans</p>
        </div>
        
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-libsmart-slate mb-2">Books Returned</p>
              <p className="text-3xl font-bold text-black">27</p>
            </div>
            <Clock size={24} className="text-green-600" />
          </div>
          <p className="text-xs text-libsmart-slate">Total lifetime</p>
        </div>

        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-libsmart-slate mb-2">Member Since</p>
              <p className="text-3xl font-bold text-black">18</p>
            </div>
            <Sparkles size={24} className="text-purple-600" />
          </div>
          <p className="text-xs text-libsmart-slate">Months</p>
        </div>
      </div>

      {/* Currently Borrowed Books */}
      <div className="bg-white border border-libsmart-slate/20 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-libsmart-slate/20 flex items-center justify-between">
          <h2 className="text-lg font-bold text-black">Currently Borrowed Books</h2>
          <Link to={myBooksPath}>
            <Button variant="outline" className="border-libsmart-slate/20 text-libsmart-blue hover:bg-libsmart-blue/10">
              View All
            </Button>
          </Link>
        </div>
        <div className="space-y-0">
          {borrowedBooks.map((book) => (
            <div key={book.id} className="px-6 py-4 border-b border-libsmart-slate/10 hover:bg-libsmart-slate/5 transition-colors last:border-b-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-black mb-1">{book.title}</h3>
                  <p className="text-sm text-libsmart-slate mb-2">{book.author}</p>
                  <p className="text-xs text-libsmart-slate">Due: {book.dueDate}</p>
                </div>
                <div className="text-right ml-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    book.daysLeft > 7
                      ? 'bg-green-100 text-green-700'
                      : book.daysLeft > 3
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {book.daysLeft} days left
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Books */}
      <div className="bg-white border border-libsmart-slate/20 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-libsmart-slate/20 flex items-center justify-between">
          <h2 className="text-lg font-bold text-black">Popular This Month</h2>
          <Link to={browsePath}>
            <Button className="gap-2 bg-libsmart-blue hover:bg-libsmart-blue/90">
              Browse All
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x md:divide-libsmart-slate/20">
          {popularBooks.map((book) => (
            <div key={book.id} className="px-6 py-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-black mb-1">{book.title}</h3>
                  <p className="text-sm text-libsmart-slate mb-1">{book.author}</p>
                  <span className="inline-block px-2 py-1 bg-libsmart-blue/10 text-libsmart-blue text-xs font-medium rounded">
                    {book.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600 font-medium">{book.available}</span>
                  <span className="text-libsmart-slate">available</span>
                </div>
                <Button className="w-full bg-libsmart-blue hover:bg-libsmart-blue/90">
                  Borrow Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-libsmart-blue/5 border border-libsmart-blue/20 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertCircle size={24} className="text-libsmart-blue flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-black mb-2">Renew Your Books</h3>
              <p className="text-sm text-libsmart-slate mb-3">Extend your due dates for borrowed books that you'd like to keep longer.</p>
              <Button variant="outline" className="border-libsmart-blue text-libsmart-blue hover:bg-libsmart-blue/10">
                Renew Books
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Sparkles size={24} className="text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-black mb-2">Earn Badges</h3>
              <p className="text-sm text-libsmart-slate mb-3">Return books on time and collect achievements to unlock special features.</p>
              <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                View Badges
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
