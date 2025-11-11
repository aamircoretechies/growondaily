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
  deepStudyData: any | null;
  version: string;
  setVersion: (v: string) => void;
  fetchChapters: (bookId: string, version: string) => Promise<void>;
  fetchVerses: (bookId: string, chapter: number, version: string) => Promise<void>;
  fetchSingleVerse: (bookId: string, chapter: number, verse: number, version: string) => Promise<void>;
  setSelectedVerse: (v: Verse | null) => void;
  selectBook: (bookId: string, name: string) => Promise<void>;
  selectChapter: (chapter: number) => Promise<void>;
  fetchDeepStudy: (bookId: string, chapter: number, version: string) => Promise<any>;
  fetchDeepStudyForVerse: (bookId: string, chapter: number, verse: number, version: string) => Promise<any>;


  saveNote: (
    book_id: string,
    chapter: number,
    verse: number,
    content: string,
    emotion_tags: string[]
  ) => Promise<void>;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [deepStudyData, setDeepStudyData] = useState<any | null>(null);
  // const [deepStudyData, setDeepStudyData] = useState<Record<string, any>>({});
  const [deepStudyData, setDeepStudyData] = useState<Record<string, any> | null>(null);



  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://api.growondaily.com/api/bible/books");
        const data = res.data?.data?.books || [];
        setBooks(data);

        const savedBookId = localStorage.getItem("bible.selectedBookId");
        const savedBookName = localStorage.getItem("bible.selectedBookName");
        const savedChapter = Number(localStorage.getItem("bible.selectedChapter") || "1");

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

  const getLocalNote = (bookId: string, chapter: number, verse: number) => {
    const localNotes = JSON.parse(localStorage.getItem("localNotes") || "{}");
    const verseKey = `${bookId}-${chapter}-${verse}`;
    const chapterKey = `${bookId}-${chapter}-all`;
    return localNotes[verseKey] || localNotes[chapterKey] || "";
  };

  const fetchChapters = async (bookId: string, version: string) => {
    try {
      setLoading(true);
      const url = `https://api.growondaily.com/api/bible/books/${bookId}/chapters/${version}`;
      const res = await axios.get(url);
      setChapters(res.data?.data?.chapters || []);
    } catch (err) {
      console.error("Chapters Fetch Error:", err);
      setError("Failed to load chapters");
    } finally {
      setLoading(false);
    }
  };

  const fetchVerses = async (bookId: string, chapter: number, version: string) => {
    try {
      setLoading(true);
      const url = `https://api.growondaily.com/api/bible/books/${bookId}/chapters/${chapter}/verses/${version}`;
      const res = await axios.get(url);
      setVerses(res.data?.data?.verses || []);
      setSelectedVerse(null);
    } catch (err) {
      console.error("Verse Fetch Error:", err);
      setError("Failed to load verses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBookId) localStorage.setItem("bible.selectedBookId", selectedBookId);
    if (selectedBookName) localStorage.setItem("bible.selectedBookName", selectedBookName);
    localStorage.setItem("bible.selectedChapter", String(selectedChapter || 1));
  }, [selectedBookId, selectedBookName, selectedChapter]);


  const selectBook = async (bookId: string, name: string, chapter: number = 1) => {
    try {
      setLoading(true);
      setSelectedBookId(bookId);
      setSelectedBookName(name);
      setSelectedChapter(chapter);

      await Promise.all([
        fetchChapters(bookId, "KJV"),
        fetchVerses(bookId, chapter, "KJV"),
      ]);

      setTimeout(() => {
        fetchDeepStudyForVerse(bookId, chapter, 1, "KJV");
      }, 2000);
    } catch (err) {
      console.error("Error selecting book:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectChapter = async (chapter: number) => {
    if (!selectedBookId) return;
    setSelectedChapter(chapter);
    await fetchVerses(selectedBookId, chapter, "KJV");
  };

  const fetchSingleVerse = async (
    bookId: string,
    chapter: number,
    verse: number,
    version: string
  ) => {
    try {
      setLoading(true);
      const url = `https://api.growondaily.com/api/bible/books/${bookId}/chapters/${chapter}/verses/${verse}/${version}`;
      const res = await axios.get(url);
      const verseData = res.data?.data?.verse as Verse | undefined;
      setSelectedVerse(verseData || null);
    } catch (error) {
      console.error("Error fetching single verse:", error);
      setSelectedVerse(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeepStudy = async (bookId: string, chapter: number, version: string) => {
    try {
      setLoading(true);

      const contexts = ["original", "explanations", "historical", "cultural", "theological", "practical", "commentary", "ground_text", "special", "daily_life", "cross_reference", "key_takeaways", "reflection",];

      const requests = contexts.map(ctx =>
        axios
          .get(`https://api.growondaily.com/api/bible/deep-study/${bookId}/${chapter}/${version}?deep-study-context=${ctx}`)
          .then(res => ({ [ctx]: res.data?.data || null }))
          .catch(() => ({ [ctx]: null }))
      );

      const results = await Promise.all(requests);
      const allResponses = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});

      setDeepStudyData((prev: any) => ({
        ...prev,
        [`${bookId}-${chapter}`]: allResponses,
      }));

      return allResponses;
    } catch (error) {
      console.error("Deep Study Fetch Error:", error);
      setDeepStudyData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeepStudyForVerse = async (
    bookId: string,
    chapter: number,
    verse: number,
    version: string
  ) => {
    try {
      setLoading(true);

      const contexts = ["original", "explanations", "historical", "cultural", "theological", "practical", "commentary", "ground_text", "special", "daily_life", "cross_reference", "key_takeaways", "reflection",];

      const requests = contexts.map(ctx =>
        axios
          .get(`https://api.growondaily.com/api/bible/deep-study/${bookId}/${chapter}/${verse}/${version}?deep-study-context=${ctx}`)
          .then(res => ({ [ctx]: res.data?.data || null }))
          .catch(() => ({ [ctx]: null }))
      );

      const results = await Promise.all(requests);
      const allResponses = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setDeepStudyData((prev: any) => ({
        ...prev,
        // [`${bookId}-${chapter}`]: allResponses,
        [`${bookId}-${chapter}-${verse}`]: allResponses,
      }));

      return allResponses;
    } catch (error) {
      console.error("Deep Study Verse Fetch Error:", error);
      setDeepStudyData(null);
    } finally {
      setLoading(false);
    }
  };



  const saveNote = async (
    book_id: string,
    chapter: number,
    verse: number,
    content: string,
    emotion_tags: string[] = []
  ) => {
    try {
      setLoading(true);
      let res;
      if (verse === 0) {

        const payload = { book_id, chapter, content, emotion_tags };
        res = await axios.post("https://api.growondaily.com/api/bible/chapter-notes", payload);
      } else {

        const payload = { book_id, chapter, verse, content, emotion_tags };
        res = await axios.post("https://api.growondaily.com/api/bible/notes", payload);
      }

      const noteKey = verse === 0 ? `${book_id}-${chapter}-all` : `${book_id}-${chapter}-${verse}`;
      const localNotes = JSON.parse(localStorage.getItem("localNotes") || "{}");
      localNotes[noteKey] = { content, emotion_tags };
      localStorage.setItem("localNotes", JSON.stringify(localNotes));

      setDeepStudyData((prev: any) => {
        const key = `${book_id}-${chapter}`;
        const prevChapter = prev?.[key] || {};
        const updated = { ...prev };

        const ctx = prevChapter["original"] || {};
        const newNote = {
          content,
          emotion_tags,
          note_id: res.data?.data?.note?.note_id || Date.now().toString(),
          created_at: res.data?.data?.note?.created_at || new Date().toISOString()
        };

        const updatedChapter = {
          ...prevChapter,
          original: {
            ...ctx,
            notes: ctx.notes ? [...ctx.notes, newNote] : [newNote],
          },
        };

        updated[key] = updatedChapter;
        return updated;
      });


      if (verse === 0) {
        await fetchDeepStudy(book_id, chapter, version);
      } else {
        await fetchDeepStudyForVerse(book_id, chapter, verse, version);
      }

      console.log("Note saved successfully:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("Error saving note:", err.response?.data || err.message);
      setError("Failed to save note");
      throw err;
    } finally {
      setLoading(false);
    }
  };



  return (
    <BibleContext.Provider
      value={{
        books,
        chapters,
        verses,
        loading,
        error,
        version,
        saveNote,
        deepStudyData,
        selectedBookId,
        selectedBookName,
        selectedChapter,
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
      }}
    >
      {children}
    </BibleContext.Provider>
  );
};

export const useBible = () => useContext(BibleContext);
