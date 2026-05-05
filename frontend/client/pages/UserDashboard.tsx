import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useParams } from 'react-router-dom';
import { defaultUserName } from '../lib/mockData';
import { borrowBook, getAuthUser, getBooks, getMyBorrowings, BorrowingItem, LibraryBook } from '../services/api';

export default function UserDashboard() {
  const { username } = useParams();
  const authUser = getAuthUser() as { fullName?: string; username?: string } | null;
  const displayName = authUser?.fullName || username || 'Library Member';
  const browsePath = `/${username ?? defaultUserName}/browse`;
  const myBooksPath = `/${username ?? defaultUserName}/my-books`;

  const [borrowings, setBorrowings] = useState<BorrowingItem[]>([]);
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [borrowingsData, booksData] = await Promise.all([getMyBorrowings(), getBooks()]);
      setBorrowings(borrowingsData);
      setBooks(booksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentlyBorrowed = useMemo(
    () => borrowings.filter((item) => item.status === 'BORROWED' || item.status === 'OVERDUE'),
    [borrowings]
  );

  const popularBooks = useMemo(
    () => [...books].sort((a, b) => b.availableQuantity - a.availableQuantity).slice(0, 3),
    [books]
  );

  const handleBorrowNow = async (bookId: number) => {
    try {
      await borrowBook(bookId);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to borrow book');
    }
  };

  const activeLoans = currentlyBorrowed.length;
  const returnedCount = Math.max(borrowings.length - currentlyBorrowed.length, 0);
  const monthsSinceJoin = 18;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Welcome back, {displayName}!</h1>
        <p className="text-libsmart-slate">Manage your books and explore our library</p>
      </div>

      {isLoading ? (
        <div className="text-sm text-libsmart-slate">Loading dashboard...</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-libsmart-slate mb-2">Books Borrowed</p>
              <p className="text-3xl font-bold text-black">{activeLoans}</p>
            </div>
            <BookOpen size={24} className="text-libsmart-blue" />
          </div>
          <p className="text-xs text-libsmart-slate">Active loans</p>
        </div>

        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-libsmart-slate mb-2">Books Returned</p>
              <p className="text-3xl font-bold text-black">{returnedCount}</p>
            </div>
            <Clock size={24} className="text-green-600" />
          </div>
          <p className="text-xs text-libsmart-slate">Total lifetime</p>
        </div>

        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-libsmart-slate mb-2">Member Since</p>
              <p className="text-3xl font-bold text-black">{monthsSinceJoin}</p>
            </div>
            <Sparkles size={24} className="text-purple-600" />
          </div>
          <p className="text-xs text-libsmart-slate">Months</p>
        </div>
      </div>

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
          {currentlyBorrowed.length > 0 ? (
            currentlyBorrowed.map((book) => (
              <div key={book.id} className="px-6 py-4 border-b border-libsmart-slate/10 hover:bg-libsmart-slate/5 transition-colors last:border-b-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">{book.book.title}</h3>
                    <p className="text-sm text-libsmart-slate mb-2">{book.book.author}</p>
                    <p className="text-xs text-libsmart-slate">Due: {new Date(book.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right ml-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      book.status === 'OVERDUE'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {book.status === 'OVERDUE' ? 'Overdue' : `${Math.max(0, Math.ceil((new Date(book.dueDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000)))} days left`}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-sm text-libsmart-slate">No active loans right now.</div>
          )}
        </div>
      </div>

      <div className="bg-white border border-libsmart-slate/20 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-libsmart-slate/20 flex items-center justify-between">
          <h2 className="text-lg font-bold text-black">Popular This Month</h2>
          <Link to={browsePath}>
            <Button className="gap-2 bg-libsmart-blue hover:bg-libsmart-blue/90">Browse All</Button>
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
                    {book.category?.name || 'Uncategorized'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600 font-medium">{book.availableQuantity}</span>
                  <span className="text-libsmart-slate">available</span>
                </div>
                <Button
                  onClick={() => handleBorrowNow(book.id)}
                  disabled={book.availableQuantity <= 0}
                  className="w-full bg-libsmart-blue hover:bg-libsmart-blue/90 disabled:opacity-50"
                >
                  Borrow Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
