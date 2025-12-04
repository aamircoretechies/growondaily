import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import debounce from "lodash/debounce";

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
  loading: boolean; // General loading state (kept for backward compatibility)
  loadingBooks: boolean;
  loadingChapters: boolean;
  loadingVerses: boolean;
  loadingDeepStudy: boolean;
  isInitialized: boolean;
  error: string | null;
  selectedBookId: string | null;
  selectedBookName: string | null;
  selectedChapter: number;
  selectedVerse: Verse | null;
  deepStudyData: any | null;
  version: string;
  setVersion: (v: string) => void;
  fetchChapters: (bookId: string, version: string) => Promise<void>;
  fetchVerses: (bookId: string, chapter: number, version: string) => Promise<void>;
  fetchSingleVerse: (bookId: string, chapter: number, verse: number, version: string) => Promise<void>;
  setSelectedVerse: (v: Verse | null) => void;
  selectBook: (bookId: string, name: string, chapter?: number) => Promise<void>;
  selectChapter: (chapter: number) => Promise<void>;
  fetchDeepStudy: (bookId: string, chapter: number, version: string, context?: string, verse?: string | number) => Promise<any>;
  fetchDeepStudyForVerse: (bookId: string, chapter: number, verse: number, version: string, context?: string) => Promise<any>;
  saveNote: (book_id: string, chapter: number, verse: number, content: string, emotion_tags: string[]) => Promise<void>;
  toggleVerseBookmark: (book: string, chapter: number, verse: number, version: string) => Promise<void>;
  showDeepStudy: boolean;
  setShowDeepStudy: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  verseActiveTab: string;
  setVerseActiveTab: React.Dispatch<React.SetStateAction<string>>;
  toggleVerseStatus: (book_id: string, chapter: number, verse: number, version: string) => Promise<{ success: boolean; is_read: boolean }>;
}

const BibleContext = createContext<BibleContextType>({
  books: [],
  chapters: [],
  verses: [],
  loading: false,
  loadingBooks: false,
  loadingChapters: false,
  loadingVerses: false,
  loadingDeepStudy: false,
  isInitialized: false,
  error: null,
  selectedBookId: null,
  selectedBookName: null,
  selectedChapter: 1,
  selectedVerse: null,
  version: "KJV",
  deepStudyData: null,
  setVersion: () => { },
  fetchChapters: async () => { },
  fetchVerses: async () => { },
  setSelectedVerse: () => { },
  fetchSingleVerse: async () => { },
  selectBook: async () => { },
  selectChapter: async () => { },
  fetchDeepStudy: async () => { },
  fetchDeepStudyForVerse: async () => { },
  saveNote: async () => { },
  toggleVerseBookmark: async () => { },
  showDeepStudy: false,
  setShowDeepStudy: () => { },
  activeTab: 'original',
  setActiveTab: () => { },
  verseActiveTab: 'explanations',
  setVerseActiveTab: () => { },
  toggleVerseStatus: async () => ({ success: false, is_read: false }),
});

export const BibleProvider = ({ children }: { children: React.ReactNode }) => {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedBookName, setSelectedBookName] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [version, setVersion] = useState<string>("KJV");

  // Granular loading states
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [loadingDeepStudy, setLoadingDeepStudy] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [deepStudyData, setDeepStudyData] = useState<Record<string, any> | null>(null);

  const [showDeepStudy, setShowDeepStudy] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('original');
  const [verseActiveTab, setVerseActiveTab] = useState<string>('explanations');

  // Caching Refs
  const booksCache = useRef<BibleBook[] | null>(null);
  const chaptersCache = useRef<Record<string, any[]>>({});
  const versesCache = useRef<Record<string, Verse[]>>({});
  const deepStudyCache = useRef<Record<string, any>>({});

  // Abort Controllers for Cancellation
  const abortControllerChapters = useRef<AbortController | null>(null);
  const abortControllerVerses = useRef<AbortController | null>(null);
  const abortControllerDeepStudy = useRef<AbortController | null>(null);

  // Derived general loading state
  const loading = loadingBooks || loadingChapters || loadingVerses;

  // --- Helper: Get Book Info ---
  const getBookInfo = useCallback((bookId: string) => {
    return books.find(b => b.book_id === bookId);
  }, [books]);

  // --- Pre-fetching Logic ---
  const prefetchAdjacentChapters = useCallback(async (bookId: string, currentChapter: number, version: string) => {
    const book = getBookInfo(bookId);
    if (!book) return;

    const nextChapter = currentChapter + 1;
    const prevChapter = currentChapter - 1;

    // Prefetch Next Chapter
    if (nextChapter <= book.total_chapters) {
      const cacheKey = `${bookId}-${nextChapter}-${version}`;
      if (!versesCache.current[cacheKey]) {
        try {
          const url = `/api/bible/books/${bookId}/chapters/${nextChapter}/verses/${version}`;
          const res = await axios.get(url);
          versesCache.current[cacheKey] = res.data?.data?.verses || [];
          console.log(`Prefetched Chapter ${nextChapter}`);
        } catch (e) {
          console.warn(`Failed to prefetch chapter ${nextChapter}`, e);
        }
      }
    }

    // Prefetch Previous Chapter
    if (prevChapter >= 1) {
      const cacheKey = `${bookId}-${prevChapter}-${version}`;
      if (!versesCache.current[cacheKey]) {
        try {
          const url = `/api/bible/books/${bookId}/chapters/${prevChapter}/verses/${version}`;
          const res = await axios.get(url);
          versesCache.current[cacheKey] = res.data?.data?.verses || [];
          console.log(`Prefetched Chapter ${prevChapter}`);
        } catch (e) {
          console.warn(`Failed to prefetch chapter ${prevChapter}`, e);
        }
      }
    }
  }, [getBookInfo]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoadingBooks(true);

        // Check Cache
        if (booksCache.current) {
          setBooks(booksCache.current);
          setLoadingBooks(false);
          setIsInitialized(true);
          return;
        }

        const res = await axios.get("/api/bible/books");
        const data = res.data?.data?.books || [];
        setBooks(data);
        booksCache.current = data;

        // Check URL parameters first (they take precedence on page refresh)
        const urlParams = new URLSearchParams(window.location.search);
        const urlBookSlug = urlParams.get('bible');
        const urlChapter = urlParams.get('chapter');
        const urlVerse = urlParams.get('verse');

        let targetBookId: string | null = null;
        let targetBookName: string | null = null;
        let targetChapter: number = 1;
        let targetVerse: number | null = null;

        // If URL params exist, use them
        if (urlBookSlug && data.length > 0) {
          const getBookIdFromSlug = (slug: string): { id: string | null; name: string | null } => {
            if (slug.length === 36) {
              const found = data.find((b: BibleBook) => b.book_id === slug);
              return { id: slug, name: found?.name || null };
            }
            const found = data.find(
              (b: BibleBook) => (b.name || '').toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
            );
            return { id: found?.book_id || null, name: found?.name || null };
          };

          const bookInfo = getBookIdFromSlug(urlBookSlug);
          if (bookInfo.id) {
            targetBookId = bookInfo.id;
            targetBookName = bookInfo.name;
            targetChapter = urlChapter ? Number(urlChapter) : 1;
            targetVerse = urlVerse ? Number(urlVerse) : null;
          }
        }

        // Fall back to localStorage if no URL params
        if (!targetBookId) {
          const savedBookId = localStorage.getItem("bible.selectedBookId");
          const savedBookName = localStorage.getItem("bible.selectedBookName");
          const savedChapter = Number(localStorage.getItem("bible.selectedChapter") || "1");
          const savedVerseStr = localStorage.getItem("bible.selectedVerse");

          if (savedBookId && data.some((b: BibleBook) => b.book_id === savedBookId)) {
            targetBookId = savedBookId;
            targetBookName = savedBookName || (data.find((b: BibleBook) => b.book_id === savedBookId)?.name ?? null);
            targetChapter = savedChapter || 1;

            if (savedVerseStr) {
              try {
                const savedVerse = JSON.parse(savedVerseStr);
                targetVerse = savedVerse.verse || null;
              } catch (e) {
                console.error("Error parsing saved verse:", e);
              }
            }
          }
        }

        // Default to Genesis if nothing found
        if (!targetBookId) {
          const genesis = data.find((b: any) => b.name.toLowerCase() === "genesis");
          if (genesis) {
            targetBookId = genesis.book_id;
            targetBookName = genesis.name;
            targetChapter = 1;
            targetVerse = null;
          }
        }

        // Set state and fetch data
        if (targetBookId) {
          setSelectedBookId(targetBookId);
          setSelectedBookName(targetBookName);
          setSelectedChapter(targetChapter);

          // Fetch chapters and verses in parallel
          await Promise.all([
            fetchChapters(targetBookId, "KJV"),
            fetchVerses(targetBookId, targetChapter, "KJV")
          ]);

          // If verse is in URL or localStorage, fetch it
          if (targetVerse && !isNaN(targetVerse)) {
            await fetchSingleVerse(targetBookId, targetChapter, targetVerse, "KJV");
          }
        }
      } catch (err) {
        console.error("Bible Books Error:", err);
        // setError("Failed to load books");
        setTimeout(fetchBooks, 3000);
        return;
      } finally {
        // setLoadingBooks(false);
        // setIsInitialized(true);
        if (booksCache.current) {
          setLoadingBooks(false);
        }
      }
    };
    fetchBooks();
  }, []);

  const fetchChapters = async (bookId: string, version: string) => {
    try {
      // Check Cache
      const cacheKey = `${bookId}-${version}`;
      if (chaptersCache.current[cacheKey]) {
        setChapters(chaptersCache.current[cacheKey]);
        return;
      }

      // Cancel previous request
      if (abortControllerChapters.current) {
        abortControllerChapters.current.abort();
      }
      abortControllerChapters.current = new AbortController();

      setLoadingChapters(true);
      const url = `/api/bible/books/${bookId}/chapters/${version}`;
      const res = await axios.get(url, { signal: abortControllerChapters.current.signal });

      const data = res.data?.data?.chapters || [];
      setChapters(data);
      chaptersCache.current[cacheKey] = data;

    } catch (err: any) {
      if (axios.isCancel(err)) {
        console.log("Chapters fetch cancelled");
        return;
      }
      console.error("Chapters Fetch Error:", err);
      setError("Failed to load chapters");
    } finally {
      setLoadingChapters(false);
    }
  };

  const fetchVerses = async (bookId: string, chapter: number, version: string) => {
    try {
      // Check Cache
      const cacheKey = `${bookId}-${chapter}-${version}`;
      if (versesCache.current[cacheKey]) {
        setVerses(versesCache.current[cacheKey]);
        setSelectedVerse(null);
        // Trigger prefetch even if cached
        prefetchAdjacentChapters(bookId, chapter, version);
        return;
      }

      // Cancel previous request
      if (abortControllerVerses.current) {
        abortControllerVerses.current.abort();
      }
      abortControllerVerses.current = new AbortController();

      setLoadingVerses(true);
      const url = `/api/bible/books/${bookId}/chapters/${chapter}/verses/${version}`;
      const res = await axios.get(url, { signal: abortControllerVerses.current.signal });

      const data = res.data?.data?.verses || [];
      setVerses(data);
      versesCache.current[cacheKey] = data;
      setSelectedVerse(null);

      // Trigger prefetch
      prefetchAdjacentChapters(bookId, chapter, version);

    } catch (err: any) {
      if (axios.isCancel(err)) {
        console.log("Verses fetch cancelled");
        return;
      }
      console.error("Verse Fetch Error:", err);
      setError("Failed to load verses");
    } finally {
      setLoadingVerses(false);
    }
  };

  useEffect(() => {
    if (selectedBookId) localStorage.setItem("bible.selectedBookId", selectedBookId);
    if (selectedBookName) localStorage.setItem("bible.selectedBookName", selectedBookName);
    localStorage.setItem("bible.selectedChapter", String(selectedChapter || 1));
    if (selectedVerse) {
      localStorage.setItem("bible.selectedVerse", JSON.stringify(selectedVerse));
    } else {
      localStorage.removeItem("bible.selectedVerse");
    }
  }, [selectedBookId, selectedBookName, selectedChapter, selectedVerse]);


  // Debounced Select Book
  const debouncedSelectBook = useCallback(debounce(async (bookId: string, name: string, chapter: number) => {
    try {
      setSelectedBookId(bookId);
      setSelectedBookName(name);
      setSelectedChapter(chapter);

      // Parallel fetch for chapters and verses
      await Promise.all([
        fetchChapters(bookId, "KJV"),
        fetchVerses(bookId, chapter, "KJV"),
      ]);

      // Fetch deep study in background without blocking
      // Only fetch 'original' tab initially for lazy loading
      fetchDeepStudyForVerse(bookId, chapter, 1, "KJV", "original");

    } catch (err) {
      console.error("Error selecting book:", err);
    }
  }, 300), []);

  const selectBook = async (bookId: string, name: string, chapter: number = 1) => {
    // Update state immediately for UI responsiveness
    setSelectedBookId(bookId);
    setSelectedBookName(name);
    setSelectedChapter(chapter);
    // Trigger debounced fetch
    debouncedSelectBook(bookId, name, chapter);
  };

  // Debounced Select Chapter
  const debouncedSelectChapter = useCallback(debounce(async (chapter: number, bookId: string) => {
    // Reset verse to null when chapter changes (edge case)
    setSelectedVerse(null);
    await fetchVerses(bookId, chapter, "KJV");
  }, 300), []);

  const selectChapter = async (chapter: number) => {
    if (!selectedBookId) return;
    setSelectedChapter(chapter);
    debouncedSelectChapter(chapter, selectedBookId);
  };

  const fetchSingleVerse = async (
    bookId: string,
    chapter: number,
    verse: number,
    version: string
  ) => {
    try {
      // Check if verse exists in current verses list first
      const existingVerse = verses.find(v => v.verse === verse && v.chapter === chapter && v.book === bookId);
      if (existingVerse) {
        setSelectedVerse(existingVerse);
        return;
      }

      // Don't set global loading for single verse fetch to avoid full screen flicker
      const url = `/api/bible/books/${bookId}/chapters/${chapter}/verses/${verse}/${version}`
      const res = await axios.get(url);
      const verseData = res.data?.data?.verse as Verse | undefined;
      setSelectedVerse(verseData || null);
    } catch (error) {
      console.error("Error fetching single verse:", error);
      setSelectedVerse(null);
    }
  };


  const fetchDeepStudy = async (
    bookId: string,
    chapter: number,
    version: string,
    context: string = 'original', // Default to original if not specified
    verse?: string | number
  ) => {
    try {
      const key = verse
        ? `${bookId}-${chapter}-${verse}`
        : `${bookId}-${chapter}`;

      // Check Cache for specific context
      if (deepStudyCache.current[key] && deepStudyCache.current[key][context]) {
        setDeepStudyData((prev: any) => ({
          ...prev,
          [key]: {
            ...prev?.[key],
            [context]: deepStudyCache.current[key][context]
          }
        }));
        // Do NOT set loading to true if we have data
        return;
      }

      setLoadingDeepStudy(true);

      const baseUrl = verse
        ? `/api/bible/deep-study/${bookId}/${chapter}/${verse}/${version}`
        : `/api/bible/deep-study/${bookId}/${chapter}/${version}`;

      const res = await axios.get(`${baseUrl}?deep-study-context=${context}`);
      const data = res.data?.data || null;

      // Update Cache
      if (!deepStudyCache.current[key]) deepStudyCache.current[key] = {};
      deepStudyCache.current[key][context] = data;

      setDeepStudyData((prev: any) => {
        const safePrev = prev || {};
        const prevData = safePrev[key] || {};

        // Merge with existing data
        const merged = { ...prevData, [context]: data };

        // Handle Notes Merging if applicable (mostly for 'original' context)
        if (context === 'original' && data?.notes) {
          const prevNotes = Array.isArray(prevData[context]?.notes) ? prevData[context].notes : [];
          const newNotes = Array.isArray(data.notes) ? data.notes : [];

          const notesMap = new Map();
          prevNotes.forEach((note: any) => note.note_id && notesMap.set(note.note_id, note));
          newNotes.forEach((note: any) => {
            if (note.note_id) notesMap.set(note.note_id, note);
            else notesMap.set(Date.now().toString() + Math.random(), note);
          });

          merged[context].notes = Array.from(notesMap.values());
        }

        return {
          ...safePrev,
          [key]: merged,
        };
      });

      return { [context]: data };
    } catch (error) {
      console.error("Deep Study Fetch Error:", error);
      // Don't clear deep study data on error, just keep old data
    } finally {
      setLoadingDeepStudy(false);
    }
  };

  const fetchDeepStudyForVerse = async (
    bookId: string,
    chapter: number,
    verse: number,
    version: string,
    context: string = 'original'
  ) => {
    return fetchDeepStudy(bookId, chapter, version, context, verse);
  };

  const saveNote = async (
    book_id: string,
    chapter: number,
    verse: number,
    content: string,
    emotion_tags: string[] = []
  ) => {
    try {
      let res;

      // API call (chapter vs verse note)
      if (verse === 0) {
        const payload = { book_id, chapter, content, emotion_tags };
        res = await axios.post("/api/bible/chapter-notes", payload);
      } else {
        const payload = { book_id, chapter, verse, content, emotion_tags };
        res = await axios.post("/api/bible/notes", payload);
      }

      // Save local backup
      const noteKey = verse === 0 ? `${book_id}-${chapter}-all` : `${book_id}-${chapter}-${verse}`;
      const localNotes = JSON.parse(localStorage.getItem("localNotes") || "{}");
      localNotes[noteKey] = { content, emotion_tags };
      localStorage.setItem("localNotes", JSON.stringify(localNotes));

      // Instantly update UI (without waiting for refetch)
      setDeepStudyData((prev: any) => {
        const safePrev = prev || {};
        const key = verse === 0 ? `${book_id}-${chapter}` : `${book_id}-${chapter}-${verse}`;
        const prevData = safePrev[key] || {};
        const updated = { ...safePrev };

        const ctx = prevData["original"] || {};
        const newNote = {
          content,
          emotion_tags,
          note_id: res.data?.data?.note?.note_id || Date.now().toString(),
          created_at: res.data?.data?.note?.created_at || new Date().toISOString(),
        };

        const updatedData = {
          ...prevData,
          original: {
            ...ctx,
            notes: ctx.notes ? [...ctx.notes, newNote] : [newNote],
          },
        };

        updated[key] = updatedData;
        return updated;
      });

      // Switch to original tab to show the note immediately
      if (verse === 0) {
        setActiveTab('original'); // Chapter-level note
      } else {
        setVerseActiveTab('original'); // Verse-level note
      }

      // Update cache as well
      const key = verse === 0 ? `${book_id}-${chapter}` : `${book_id}-${chapter}-${verse}`;
      if (deepStudyCache.current[key] && deepStudyCache.current[key]['original']) {
        const ctx = deepStudyCache.current[key]['original'];
        const newNote = {
          content,
          emotion_tags,
          note_id: res.data?.data?.note?.note_id || Date.now().toString(),
          created_at: res.data?.data?.note?.created_at || new Date().toISOString(),
        };
        deepStudyCache.current[key]['original'] = {
          ...ctx,
          notes: ctx.notes ? [...ctx.notes, newNote] : [newNote]
        };
      }


      console.log("Note saved successfully:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("Error saving note:", err.response?.data || err.message);
      setError("Failed to save note");
      throw err;
    }
  };

  const toggleVerseBookmark = async (book: string, chapter: number, verse: number, version: string) => {
    try {
      const res = await axios.post(`/api/bible/toggle-verse-bookmark`, {
        book, chapter, verse, version,
      });

      const msg = res?.data?.message?.toLowerCase() || "";

      if (msg.includes("removed") || msg.includes("unbookmarked")) {
        toast.success("Bookmark removed successfully");
      } else if (msg.includes("added") || msg.includes("bookmarked")) {
        toast.success("Bookmark added successfully");
      } else {
        toast.info(res?.data?.message || "Updated");
      }

      // Dispatch event to notify ReflectionProvider to reload bookmarks
      window.dispatchEvent(new CustomEvent('bookmark-updated'));
    } catch (err) {
      console.error("Bookmark toggle error:", err);
      toast.error("Something went wrong");
    }
  };

  const toggleVerseStatus = async (book_id: string, chapter: number, verse: number, version: string) => {
    try {
      const res = await axios.post("/api/bible/toggle-verse-status", {
        book: book_id,
        chapter,
        verse,
        version,
      });

      const apiData = res.data;
      console.log("API RAW RESPONSE => ", apiData);

      const isRead = apiData?.data?.mark_as_read ?? false;

      return {
        success: apiData.status === 1,
        is_read: isRead,
      };
    } catch (err) {
      console.error("Toggle Verse Error:", err);
      return { success: false, is_read: false };
    }
  };


  return (
    <BibleContext.Provider
      value={{
        books, chapters, verses,
        loading, loadingBooks, loadingChapters, loadingVerses, loadingDeepStudy, isInitialized,
        error, version, saveNote, deepStudyData, selectedBookId, selectedBookName, selectedChapter,
        selectedVerse,
        fetchChapters,
        fetchVerses,
        fetchSingleVerse,
        setSelectedVerse,
        setVersion,
        selectBook,
        selectChapter,
        fetchDeepStudy,
        fetchDeepStudyForVerse,
        toggleVerseBookmark,
        showDeepStudy,
        setShowDeepStudy,
        activeTab,
        setActiveTab,
        verseActiveTab,
        setVerseActiveTab,
        toggleVerseStatus,

      }}
    >
      {children}
    </BibleContext.Provider>
  );
};

export const useBible = () => useContext(BibleContext);
