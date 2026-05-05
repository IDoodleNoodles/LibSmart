import React, { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { borrowBook, getBooks, getCategories, LibraryBook } from '../services/api';

export default function UserBrowse() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [borrowingBookId, setBorrowingBookId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [booksData, categoriesData] = await Promise.all([getBooks(), getCategories()]);
      setBooks(booksData);
      setCategories(['All', ...categoriesData.map((category) => category.name)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load books');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredBooks = useMemo(() => {
    if (selectedCategory === 'All') {
      return books;
    }
    return books.filter((book) => book.category?.name === selectedCategory);
  }, [books, selectedCategory]);

  const handleBorrow = async (bookId: number) => {
    setBorrowingBookId(bookId);
    setBooks((prev) =>
      prev.map((book) =>
        book.id === bookId && book.availableQuantity > 0
          ? { ...book, availableQuantity: book.availableQuantity - 1 }
          : book
      )
    );
    try {
      await borrowBook(bookId);
    } catch (err) {
      await loadData();
      alert(err instanceof Error ? err.message : 'Failed to borrow book');
    } finally {
      setBorrowingBookId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Browse Books</h1>
        <p className="text-libsmart-slate">Explore our collection and find your next great read</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-libsmart-blue text-white'
                : 'bg-libsmart-slate/10 text-libsmart-slate hover:bg-libsmart-slate/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-sm text-libsmart-slate">Loading books...</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white border border-libsmart-slate/20 rounded-lg p-5 hover:shadow-lg transition-shadow">
              <div className="h-40 bg-libsmart-slate/10 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-libsmart-slate font-medium mb-1">Book Cover</p>
                  <p className="text-xs text-libsmart-slate/70">BK-{String(book.id).padStart(3, '0')}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-black mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-libsmart-slate mb-2">{book.author}</p>
                  <span className="inline-block px-2 py-1 bg-libsmart-blue/10 text-libsmart-blue text-xs font-medium rounded">
                    {book.category?.name || 'Uncategorized'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-libsmart-slate/20'} />
                    ))}
                  </div>
                  <span className="text-xs text-libsmart-slate">4.0</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-libsmart-slate/10">
                  <div>
                    <p className="text-xs text-libsmart-slate">Available</p>
                    <p className="text-sm font-semibold text-libsmart-blue">{book.availableQuantity}</p>
                  </div>
                  <Button
                    onClick={() => handleBorrow(book.id)}
                    disabled={book.availableQuantity <= 0 || borrowingBookId === book.id}
                    className="bg-libsmart-blue hover:bg-libsmart-blue/90 disabled:opacity-50"
                  >
                    {borrowingBookId === book.id ? 'Borrowing...' : 'Borrow'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredBooks.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-libsmart-slate text-lg">No books found in this category.</p>
          <Button
            onClick={() => setSelectedCategory('All')}
            variant="outline"
            className="mt-4 border-libsmart-slate/20 text-libsmart-blue hover:bg-libsmart-blue/10"
          >
            View All Books
          </Button>
        </div>
      )}
    </div>
  );
}
