import React, { useState } from 'react';
import { RotateCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { userBorrowedBooks } from '../lib/mockData';

interface BorrowedBook {
  id: string;
  title: string;
  author: string;
  borrowDate: string;
  dueDate: string;
  daysLeft: number;
  copies: number;
}

export default function UserMyBooks() {
  const [books, setBooks] = useState<BorrowedBook[]>(userBorrowedBooks);

  const handleRenew = (id: string) => {
    setBooks(books.map(book => 
      book.id === id 
        ? { ...book, dueDate: new Date(new Date(book.dueDate).getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }), daysLeft: book.daysLeft + 14 }
        : book
    ));
  };

  const handleReturn = (id: string) => {
    setBooks(books.filter(book => book.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">My Borrowed Books</h1>
        <p className="text-libsmart-slate">Manage your current loans and borrowing history</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6">
          <p className="text-sm text-libsmart-slate mb-2">Currently Borrowed</p>
          <p className="text-3xl font-bold text-black">{books.length}</p>
        </div>
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6">
          <p className="text-sm text-libsmart-slate mb-2">Overdue Books</p>
          <p className="text-3xl font-bold text-red-600">{books.filter(b => b.daysLeft < 0).length}</p>
        </div>
        <div className="bg-white border border-libsmart-slate/20 rounded-lg p-6">
          <p className="text-sm text-libsmart-slate mb-2">Total Books This Year</p>
          <p className="text-3xl font-bold text-libsmart-blue">47</p>
        </div>
      </div>

      {/* Books List */}
      {books.length > 0 ? (
        <div className="space-y-4">
          {books.map((book) => (
            <div key={book.id} className="bg-white border border-libsmart-slate/20 rounded-lg p-6">
              <div className="flex items-start justify-between gap-6">
                {/* Book Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black mb-1">{book.title}</h3>
                  <p className="text-sm text-libsmart-slate mb-4">{book.author}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Borrowed</p>
                      <p className="text-sm text-black">{book.borrowDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Due Date</p>
                      <p className="text-sm text-black">{book.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Days Left</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        book.daysLeft > 7
                          ? 'bg-green-100 text-green-700'
                          : book.daysLeft > 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {book.daysLeft > 0 ? `${book.daysLeft} days` : 'Overdue'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-libsmart-slate uppercase font-semibold mb-1">Copies Borrowed</p>
                      <p className="text-sm text-black">{book.copies}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    onClick={() => handleRenew(book.id)}
                    variant="outline"
                    className="gap-2 border-libsmart-slate/20 text-libsmart-blue hover:bg-libsmart-blue/10"
                  >
                    <RotateCw size={16} />
                    Renew
                  </Button>
                  <Button
                    onClick={() => handleReturn(book.id)}
                    variant="outline"
                    className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Return
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-libsmart-slate/5 border border-libsmart-slate/20 rounded-lg p-12 text-center">
          <p className="text-libsmart-slate text-lg mb-4">You have no borrowed books</p>
          <p className="text-sm text-libsmart-slate mb-6">Start exploring our library to find your next favorite book!</p>
          <Button className="bg-libsmart-blue hover:bg-libsmart-blue/90">
            Browse Books
          </Button>
        </div>
      )}

      {/* Borrowing Rules */}
      <div className="bg-libsmart-blue/5 border border-libsmart-blue/20 rounded-lg p-6">
        <h3 className="font-semibold text-black mb-4">Library Borrowing Rules</h3>
        <ul className="space-y-2 text-sm text-libsmart-slate">
          <li className="flex gap-3">
            <span className="text-libsmart-blue font-semibold">•</span>
            <span>Maximum 5 books can be borrowed at once</span>
          </li>
          <li className="flex gap-3">
            <span className="text-libsmart-blue font-semibold">•</span>
            <span>Borrowing period is 21 days per book</span>
          </li>
          <li className="flex gap-3">
            <span className="text-libsmart-blue font-semibold">•</span>
            <span>You can renew books twice before return</span>
          </li>
          <li className="flex gap-3">
            <span className="text-libsmart-blue font-semibold">•</span>
            <span>Late returns incur a fine of $0.25 per day</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
