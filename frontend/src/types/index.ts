export interface Verse {
  verse: number;
  text: string;
}

export interface Chapter {
  book: string;
  chapter: number;
  language: string;
  verses: Verse[];
}

export interface BooksResponse {
  books: string[];
}

export interface ChaptersResponse {
  chapters: number[];
}
