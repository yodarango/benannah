import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BooksResponse, ChaptersResponse } from '../types';

const Home: React.FC = () => {
  const [books, setBooks] = useState<string[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [chapters, setChapters] = useState<number[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (selectedBook) {
      fetchChapters(selectedBook);
    }
  }, [selectedBook]);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      const data: BooksResponse = await response.json();
      setBooks(data.books);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  const fetchChapters = async (book: string) => {
    try {
      const response = await fetch(`/api/chapters/${book}`);
      const data: ChaptersResponse = await response.json();
      setChapters(data.chapters);
      setSelectedChapter(null);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  const handleReadChapter = () => {
    if (selectedBook && selectedChapter) {
      navigate(`/${selectedBook}/${selectedChapter}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Bible Reader
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Select a Book and Chapter
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Books Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book
              </label>
              <select
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a book...</option>
                {books.map((book) => (
                  <option key={book} value={book}>
                    {book.charAt(0).toUpperCase() + book.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Chapters Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chapter
              </label>
              <select
                value={selectedChapter || ''}
                onChange={(e) => setSelectedChapter(Number(e.target.value))}
                disabled={!selectedBook}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select a chapter...</option>
                {chapters.map((chapter) => (
                  <option key={chapter} value={chapter}>
                    Chapter {chapter}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleReadChapter}
              disabled={!selectedBook || !selectedChapter}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Read Chapter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
