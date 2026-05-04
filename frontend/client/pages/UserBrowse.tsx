import React, { useState } from 'react';
import { Search, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { userBrowseBooks, userBrowseCategories } from '../lib/mockData';

export default function UserBrowse() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const books = userBrowseBooks;
  const categories = userBrowseCategories;

  const filteredBooks = selectedCategory === 'All' 
    ? books 
    : books.filter(book => book.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Browse Books</h1>
        <p className="text-libsmart-slate">Explore our collection and find your next great read</p>
      </div>

      {/* Categories */}
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

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-white border border-libsmart-slate/20 rounded-lg p-5 hover:shadow-lg transition-shadow">
            {/* Book Cover Placeholder */}
            <div className="h-40 bg-libsmart-slate/10 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-libsmart-slate font-medium mb-1">Book Cover</p>
                <p className="text-xs text-libsmart-slate/70">{book.id}</p>
              </div>
            </div>

            {/* Book Info */}
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-black mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-sm text-libsmart-slate mb-2">{book.author}</p>
                <span className="inline-block px-2 py-1 bg-libsmart-blue/10 text-libsmart-blue text-xs font-medium rounded">
                  {book.category}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(book.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-libsmart-slate/20'}
                    />
                  ))}
                </div>
                <span className="text-xs text-libsmart-slate">{book.rating}</span>
              </div>

              {/* Availability */}
              <div className="flex items-center justify-between pt-2 border-t border-libsmart-slate/10">
                <div>
                  <p className="text-xs text-libsmart-slate">Available</p>
                  <p className="text-sm font-semibold text-libsmart-blue">{book.available}</p>
                </div>
                <Button className="bg-libsmart-blue hover:bg-libsmart-blue/90">
                  Borrow
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
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
