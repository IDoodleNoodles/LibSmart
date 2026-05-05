import React, { useEffect, useMemo, useState } from 'react';
import { Trash2, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BorrowingItem, getMyBorrowings, returnBook } from '../services/api';

export default function UserMyBooks() {
  const [borrowings, setBorrowings] = useState<BorrowingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [returningId, setReturningId] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadBorrowings();
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadBorrowings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyBorrowings();
      setBorrowings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load borrowed books');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBorrowings();
  }, []);

  const currentlyBorrowed = useMemo(
    () => borrowings.filter((item) => item.status === 'BORROWED' || item.status === 'OVERDUE'),
    [borrowings]
  );

  const overdueCount = useMemo(
    () => currentlyBorrowed.filter((item) => item.status === 'OVERDUE').length,
    [currentlyBorrowed]
  );

  const handleReturn = async (borrowingId: number) => {
    setReturningId(borrowingId);
    try {
      await returnBook(borrowingId);
      await loadBorrowings();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to return book');
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">My Borrowed Books</h1>
          <p className="text-libsmart-slate">Manage your current loans and borrowing history</p>
        </div>
        <Button onClick={handleManualRefresh} disabled={isRefreshing} variant="outline" className="gap-2 border-libsmart-slate/20 text-libsmart-blue hover:bg-libsmart-blue/10">
          <RotateCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6">
          <p className="text-sm text-libsmart-slate mb-2">Currently Borrowed</p>
          <p className="text-3xl font-bold text-black">{currentlyBorrowed.length}</p>
        </div>
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6">
          <p className="text-sm text-libsmart-slate mb-2">Overdue Books</p>
          <p className="text-3xl font-bold text-red-600">{overdueCount}</p>
        </div>
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6">
          <p className="text-sm text-libsmart-slate mb-2">Total Borrowing Records</p>
          <p className="text-3xl font-bold text-libsmart-blue">{borrowings.length}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm text-libsmart-slate">Loading borrowed books...</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : currentlyBorrowed.length > 0 ? (
        <div className="space-y-4">
          {currentlyBorrowed.map((item) => (
            <div key={item.id} className="bg-white border border-libsmart-slate/20 rounded-lg p-6">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black mb-1">{item.book.title}</h3>
                  <p className="text-sm text-libsmart-slate mb-4">{item.book.author}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Borrowed</p>
                      <p className="text-sm text-black">{new Date(item.borrowDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Due Date</p>
                      <p className="text-sm text-black">{new Date(item.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'OVERDUE'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Branch</p>
                      <p className="text-sm text-black">{item.book.branch?.name || '-'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    onClick={() => handleReturn(item.id)}
                    variant="outline"
                    disabled={returningId === item.id}
                    className="gap-2 border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    {returningId === item.id ? 'Returning...' : 'Return'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-libsmart-slate/5 border border-libsmart-slate/20 rounded-lg p-12 text-center">
          <p className="text-libsmart-slate text-lg mb-4">You have no borrowed books</p>
          <p className="text-sm text-libsmart-slate mb-6">Start exploring our library to find your next favorite book.</p>
        </div>
      )}

      <div className="bg-libsmart-blue/5 border border-libsmart-blue/20 rounded-lg p-6">
        <h3 className="font-semibold text-black mb-4">Library Borrowing Rules</h3>
        <ul className="space-y-2 text-sm text-libsmart-slate">
          <li className="flex gap-3"><span className="text-libsmart-blue font-semibold">•</span><span>Maximum 5 books can be borrowed at once</span></li>
          <li className="flex gap-3"><span className="text-libsmart-blue font-semibold">•</span><span>Borrowing period is 7 days per book in current backend setup</span></li>
          <li className="flex gap-3"><span className="text-libsmart-blue font-semibold">•</span><span>Use return action to make books available for other users</span></li>
        </ul>
      </div>
    </div>
  );
}
