import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

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
  selectBook: (bookId: string, name: string,chapter?: number) => Promise<void>;
  selectChapter: (chapter: number) => Promise<void>;
  fetchDeepStudy: (bookId: string, chapter: number, version: string) => Promise<any>;
  fetchDeepStudyForVerse: (bookId: string, chapter: number, verse: number, version: string) => Promise<any>;
  saveNote: (book_id: string,chapter: number,verse: number,content: string,emotion_tags: string[]) => Promise<void>;
  toggleVerseBookmark: (book: string,chapter: number,verse: number,version: string) => Promise<void>;
  showDeepStudy: boolean;
  setShowDeepStudy: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  verseActiveTab: string;
  setVerseActiveTab: React.Dispatch<React.SetStateAction<string>>;
  toggleVerseStatus: (book_id: string,chapter: number,verse: number,version: string) => Promise<{ success: boolean; is_read: boolean }>;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [deepStudyData, setDeepStudyData] = useState<any | null>(null);
  // const [deepStudyData, setDeepStudyData] = useState<Record<string, any>>({});
  const [deepStudyData, setDeepStudyData] = useState<Record<string, any> | null>(null);

  const [showDeepStudy, setShowDeepStudy] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('original');
  const [verseActiveTab, setVerseActiveTab] = useState<string>('explanations');




  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        // const res = await axios.get("https://api.growondaily.com/api/bible/books");
        const res = await axios.get("/api/bible/books");
        const data = res.data?.data?.books || [];
        setBooks(data);
        
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
          await fetchChapters(targetBookId, "KJV");
          await fetchVerses(targetBookId, targetChapter, "KJV");
          
          // If verse is in URL or localStorage, fetch it
          if (targetVerse && !isNaN(targetVerse)) {
            await fetchSingleVerse(targetBookId, targetChapter, targetVerse, "KJV");
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
      // const url = `https://api.growondaily.com/api/bible/books/${bookId}/chapters/${version}`;
      const url = `/api/bible/books/${bookId}/chapters/${version}`;

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
      // const url = `https://api.growondaily.com/api/bible/books/${bookId}/chapters/${chapter}/verses/${version}`;
      const url = `/api/bible/books/${bookId}/chapters/${chapter}/verses/${version}`;

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
    if (selectedVerse) {
      localStorage.setItem("bible.selectedVerse", JSON.stringify(selectedVerse));
    } else {
      localStorage.removeItem("bible.selectedVerse");
    }
  }, [selectedBookId, selectedBookName, selectedChapter, selectedVerse]);


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
    // Reset verse to null when chapter changes (edge case)
    setSelectedVerse(null);
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
      // const url = `https://api.growondaily.com/api/bible/books/${bookId}/chapters/${chapter}/verses/${verse}/${version}`;
      const url = `/api/bible/books/${bookId}/chapters/${chapter}/verses/${verse}/${version}`
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


  const fetchDeepStudy = async (
    bookId: string,
    chapter: number,
    version: string,
    verse?: string | number // optional verse param
  ) => {
    try {
      setLoading(true);
      const contexts = ["original","explanations","historical","cultural","theological","practical","commentary","ground_text","special","daily_life","cross_reference","key_takeaways","reflection",];

      // Check if verse is passed
      // const baseUrl = verse
      //   ? `https://api.growondaily.com/api/bible/deep-study/${bookId}/${chapter}/${verse}/${version}`
      //   : `https://api.growondaily.com/api/bible/deep-study/${bookId}/${chapter}/${version}`;
      const baseUrl = verse
        ? `/api/bible/deep-study/${bookId}/${chapter}/${verse}/${version}`
        : `/api/bible/deep-study/${bookId}/${chapter}/${version}`;


      const requests = contexts.map((ctx) =>
        axios
          .get(`${baseUrl}?deep-study-context=${ctx}`)
          .then((res) => ({ [ctx]: res.data?.data || null }))
          .catch(() => ({ [ctx]: null }))
      );

      const results = await Promise.all(requests);
      const allResponses = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});

      const key = verse
        ? `${bookId}-${chapter}-${verse}`
        : `${bookId}-${chapter}`;

      setDeepStudyData((prev: any) => {
        const safePrev = prev || {};
        const prevData = safePrev[key] || {};
        
        // Merge notes from previous data with new data, avoiding duplicates
        const merged = { ...allResponses };
        Object.keys(merged).forEach((tabId) => {
          const prevTab = prevData[tabId] || {};
          const newTab = merged[tabId] || {};
          
          // Merge notes by note_id to avoid duplicates
          const prevNotes = prevTab.notes || [];
          const newNotes = newTab.notes || [];
          
          // Create a map of existing notes by note_id
          const notesMap = new Map();
          prevNotes.forEach((note: any) => {
            if (note.note_id) {
              notesMap.set(note.note_id, note);
            }
          });
          
          // Add new notes, updating existing ones if they have the same note_id
          newNotes.forEach((note: any) => {
            if (note.note_id) {
              notesMap.set(note.note_id, note);
            } else {
              // If no note_id, add it (might be a new note from API)
              notesMap.set(Date.now().toString() + Math.random(), note);
            }
          });
          
          const mergedNotes = Array.from(notesMap.values());
          
          merged[tabId] = {
            ...newTab,
            notes: mergedNotes.length > 0 ? mergedNotes : undefined,
          };
        });
        
        return {
          ...safePrev,
          [key]: merged,
        };
      });

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
          // .get(`https://api.growondaily.com/api/bible/deep-study/${bookId}/${chapter}/${verse}/${version}?deep-study-context=${ctx}`)
          .get(`/api/bible/deep-study/${bookId}/${chapter}/${verse}/${version}?deep-study-context=${ctx}`)
          .then(res => ({ [ctx]: res.data?.data || null }))
          .catch(() => ({ [ctx]: null }))
      );

      const results = await Promise.all(requests);
      const allResponses = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      
      const key = `${bookId}-${chapter}-${verse}`;
      
      setDeepStudyData((prev: any) => {
        const safePrev = prev || {};
        const prevData = safePrev[key] || {};
        
        // Merge notes from previous data with new data, avoiding duplicates
        const merged = { ...allResponses };
        Object.keys(merged).forEach((tabId) => {
          const prevTab = prevData[tabId] || {};
          const newTab = merged[tabId] || {};
          
          // Merge notes by note_id to avoid duplicates
          const prevNotes = prevTab.notes || [];
          const newNotes = newTab.notes || [];
          
          // Create a map of existing notes by note_id
          const notesMap = new Map();
          prevNotes.forEach((note: any) => {
            if (note.note_id) {
              notesMap.set(note.note_id, note);
            }
          });
          
          // Add new notes, updating existing ones if they have the same note_id
          newNotes.forEach((note: any) => {
            if (note.note_id) {
              notesMap.set(note.note_id, note);
            } else {
              // If no note_id, add it (might be a new note from API)
              notesMap.set(Date.now().toString() + Math.random(), note);
            }
          });
          
          const mergedNotes = Array.from(notesMap.values());
          
          merged[tabId] = {
            ...newTab,
            notes: mergedNotes.length > 0 ? mergedNotes : undefined,
          };
        });
        
        return {
          ...safePrev,
          [key]: merged,
        };
      });

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
      let res;

      // API call (chapter vs verse note)
      if (verse === 0) {
        const payload = { book_id, chapter, content, emotion_tags };
        // res = await axios.post("https://api.growondaily.com/api/bible/chapter-notes", payload);
        res = await axios.post("/api/bible/chapter-notes", payload);
      } else {
        const payload = { book_id, chapter, verse, content, emotion_tags };
        // res = await axios.post("https://api.growondaily.com/api/bible/notes", payload);
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

      // Background refresh (non-blocking)
      if (verse === 0) {
        fetchDeepStudy(book_id, chapter, version);
      } else {
        fetchDeepStudyForVerse(book_id, chapter, verse, version);
      }

      console.log("Note saved successfully:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("Error saving note:", err.response?.data || err.message);
      setError("Failed to save note");
      throw err;
    } finally {
      //  Don’t trigger loading spinner here (keeps UI instant)
      setLoading(false);
    }
  };

  // const toggleVerseBookmark = async (book: string, chapter: number, verse: number, version: string) => {
  //   try {
  //     const res = await axios.post("/api/bible/toggle-verse-bookmark",
  //       { book, chapter, verse, version }
  //     );
  //     const data = res.data;
  //     if (data?.status === 1) {
  //       console.log(data.message, data.data);
  //       toast("Verse bookmarked!", {
  //         description: `${book} ${chapter}:${verse}`,
  //       });
  //     } else {
  //       console.warn("Bookmark toggle failed:", data);
  //       toast("Could not bookmark verse.");
  //     }
  //   } catch (error) {
  //     console.error("Bookmark API Error:", error);
  //     toast("An error occurred.");
  //   }
  // };

  const toggleVerseBookmark = async (book: string, chapter: number, verse: number, version: string) => {
  try {
    const res = await axios.post(`/api/bible/toggle-verse-bookmark`, {
      book,chapter,verse,version,
    });

    const msg = res?.data?.message?.toLowerCase() || "";

    if (msg.includes("removed") || msg.includes("unbookmarked")) {
      toast.success("Bookmark removed successfully");
    } else if (msg.includes("added") || msg.includes("bookmarked")) {
      toast.success("Bookmark added successfully");
    } else {
      toast.info(res?.data?.message || "Updated");
    }
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
      value={{ books,chapters,verses,loading,error,version,saveNote,deepStudyData,selectedBookId,selectedBookName,selectedChapter,
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
