import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface BibleBook {
  book_id: string;
  name: string;
  total_chapters: number;
  testament: string;
  order: number;
}

interface Verse {
  verse_id: string;
  verse: number;
  text: string;
  book: string;
  book_name: string;
  chapter: number;
  version: string;
}

interface BibleContextType {
  books: BibleBook[];
  chapters: any[];
  verses: Verse[];
  loading: boolean;
  error: string | null;
  selectedBookId: string | null;
  selectedBookName: string | null;
  selectedChapter: number;
  selectedVerse: Verse | null;
  fetchChapters: (bookId: string, version: string) => Promise<void>;
  fetchVerses: (bookId: string, chapter: number, version: string) => Promise<void>;
  setSelectedVerse: (v: Verse | null) => void;
  selectBook: (bookId: string, name: string) => Promise<void>;
  selectChapter: (chapter: number) => Promise<void>;
}


const BibleContext = createContext<BibleContextType>({
  books: [],
  chapters: [],
  verses: [],
  loading: false,
  error: null,
  selectedBookId: null,
  selectedBookName: null,
  selectedChapter: 1,
  selectedVerse: null,
  fetchChapters: async () => {},
  fetchVerses: async () => {},
  setSelectedVerse: () => {},
  selectBook: async () => {},
  selectChapter: async () => {},
});


export const BibleProvider = ({ children }: { children: React.ReactNode }) => {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedBookName, setSelectedBookName] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


 useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://api.growondaily.com/api/bible/books");
        const data = res.data?.data?.books || [];
        setBooks(data);

        // Hydrate selection from storage if present
        const savedBookId = localStorage.getItem('bible.selectedBookId');
        const savedBookName = localStorage.getItem('bible.selectedBookName');
        const savedChapter = Number(localStorage.getItem('bible.selectedChapter') || '1');

        if (savedBookId && data.some((b: BibleBook) => b.book_id === savedBookId)) {
          setSelectedBookId(savedBookId);
          setSelectedBookName(savedBookName || (data.find((b: BibleBook) => b.book_id === savedBookId)?.name ?? null));
          setSelectedChapter(savedChapter || 1);
          await fetchChapters(savedBookId, "KJV");
          await fetchVerses(savedBookId, savedChapter || 1, "KJV");
        } else {
          const genesis = data.find((b: any) => b.name.toLowerCase() === "genesis");
          if (genesis) {
            setSelectedBookId(genesis.book_id);
            setSelectedBookName(genesis.name);
            setSelectedChapter(1);
            await fetchChapters(genesis.book_id, "KJV");
            await fetchVerses(genesis.book_id, 1, "KJV");
          } else {
            console.warn("Genesis not found in books array");
          }
        }
      } catch (err) {
        console.error("Bible Books Error:", err);
        setError("Failed to load books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);


  const fetchChapters = async (bookId: string, version: string) => {
    console.log("Fetching Chapters:", { bookId, version });
    try {
      setLoading(true);
      const url = `https://api.growondaily.com/api/bible/books/${bookId}/chapters/${version}`;
      const res = await axios.get(url);
      const data = res.data?.data?.chapters || [];
      setChapters(data);
      console.log("Chapters Loaded:", data.length, "chapters");
    } catch (err) {
      console.error("Chapters Fetch Error:", err);
      setError("Failed to load chapters");
    } finally {
      setLoading(false);
    }
  };


 const fetchVerses = async (bookId: string, chapter: number, version: string) => {
    console.log("Fetching Verses:", { bookId, chapter, version });
    try {
      setLoading(true);
      const url = `https://api.growondaily.com/api/bible/books/${bookId}/chapters/${chapter}/verses/${version}`;
      const res = await axios.get(url);
      const data = res.data?.data?.verses || [];
      setVerses(data);
      setSelectedVerse(null);
      console.log(` Verses Loaded for Chapter ${chapter}:`, data.length);
    } catch (err) {
      console.error(" Verse Fetch Error:", err);
      setError("Failed to load verses");
    } finally {
      setLoading(false);
    }
  };

  // Persist selection
  useEffect(() => {
    if (selectedBookId) localStorage.setItem('bible.selectedBookId', selectedBookId);
    if (selectedBookName) localStorage.setItem('bible.selectedBookName', selectedBookName);
    localStorage.setItem('bible.selectedChapter', String(selectedChapter || 1));
  }, [selectedBookId, selectedBookName, selectedChapter]);

  const selectBook = async (bookId: string, name: string) => {
    setSelectedBookId(bookId);
    setSelectedBookName(name);
    setSelectedChapter(1);
    await fetchChapters(bookId, 'KJV');
    await fetchVerses(bookId, 1, 'KJV');
  };

  const selectChapter = async (chapter: number) => {
    if (!selectedBookId) return;
    setSelectedChapter(chapter);
    await fetchVerses(selectedBookId, chapter, 'KJV');
  };

 return (
    <BibleContext.Provider
      value={{
        books,
        chapters,
        verses,
        loading,
        error,
        selectedBookId,
        selectedBookName,
        selectedChapter,
        selectedVerse,
        fetchChapters,
        fetchVerses,
        setSelectedVerse,
        selectBook,
        selectChapter,
      }}
    >
      {children}
    </BibleContext.Provider>
  );
};

export const useBible = () => useContext(BibleContext);