import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chapter } from '../types';

const ChapterReader: React.FC = () => {
  const { book, chapter } = useParams<{ book: string; chapter: string }>();
  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (book && chapter) {
      fetchChapter(book, chapter);
    }
  }, [book, chapter]);

  const fetchChapter = async (bookName: string, chapterNum: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/chapter/${bookName}/${chapterNum}?lang=eng`);
      
      if (!response.ok) {
        throw new Error('Chapter not found');
      }
      
      const data: Chapter = await response.json();
      setChapterData(data);
    } catch (error) {
      console.error('Error fetching chapter:', error);
      setError('Failed to load chapter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading chapter...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!chapterData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Chapter not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            ← Back to Home
          </button>
          
          <h1 className="text-4xl font-bold text-gray-800">
            {chapterData.book.charAt(0).toUpperCase() + chapterData.book.slice(1)} {chapterData.chapter}
          </h1>
        </div>

        {/* Chapter Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-4">
            {chapterData.verses.map((verse) => (
              <div key={verse.verse} className="flex">
                <span className="text-sm font-bold text-gray-500 mr-4 mt-1 min-w-[2rem]">
                  {verse.verse}
                </span>
                <p className="text-lg text-gray-800 leading-relaxed">
                  {verse.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => {
              const prevChapter = parseInt(chapter!) - 1;
              if (prevChapter > 0) {
                navigate(`/${book}/${prevChapter}`);
              }
            }}
            disabled={parseInt(chapter!) <= 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Previous Chapter
          </button>
          
          <button
            onClick={() => {
              const nextChapter = parseInt(chapter!) + 1;
              navigate(`/${book}/${nextChapter}`);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Next Chapter
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChapterReader;
