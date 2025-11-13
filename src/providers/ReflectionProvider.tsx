import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const ReflectionContext = createContext<any>(null);

export const ReflectionProvider = ({ children }: any) => {
  const [dailyReflection, setDailyReflection] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [bmLoading, setBmLoading] = useState(false);
  const [allNotes, setAllNotes] = useState<any[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);

  // Fetch today's reflection
  const fetchDailyReflection = async (timezone = "UTC", personalize = true) => {
    try {
      setLoading(true);
      const res = await axios.get(`https://api.growondaily.com/api/reflections/daily?timezone=${timezone}&personalize=${personalize}`,
        { withCredentials: true }
      );
      setDailyReflection(res.data?.data?.reflection || null);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching daily reflection:", err.response?.data || err.message);
      setError("Failed to fetch reflection");
    } finally {
      setLoading(false);
    }
  };


  const fetchBookmarks = async () => {
    try {
      setBmLoading(true);
      const res = await axios.get(
        "https://api.growondaily.com/api/bible/bookmarks?limit=100&offset=0",
        { withCredentials: true }
      );
      if (res.data?.status === 1) {
        const list = res.data.data.bookmarks || [];
        setBookmarks(list);
      }
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    } finally {
      setBmLoading(false);
    }
  };

  const fetchAllNotes = async () => {
    try {
      setNotesLoading(true);
      const res = await axios.get("https://api.growondaily.com/api/reflections/notes",
        { withCredentials: true }
      );
      if (res.data?.status === 1) {
        const notes = res.data.data?.notes || [];
        setAllNotes(notes);
      } else {
        console.error("Failed to fetch notes:", res.data?.message);
        setAllNotes([]);
      }
    } catch (err: any) {
      console.error("Error fetching notes:", err.response?.data || err.message);
      setAllNotes([]);
    } finally {
      setNotesLoading(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const res = await axios.delete(`https://api.growondaily.com/api/reflections/notes/${noteId}`,
        { withCredentials: true }
      );

      if (res.data?.status === 1) {
        setAllNotes((prev) => prev.filter((n) => n.note_id !== noteId));
        console.log("Note deleted successfully:", noteId);
      } else {
        console.error("Failed to delete note:", res.data?.message);
      }
    } catch (err: any) {
      console.error("Error deleting note:", err.response?.data || err.message);
    }
  };



  // Auto-fetch on load
  useEffect(() => {
    fetchDailyReflection();
    fetchBookmarks();
    fetchAllNotes();
  }, []);





  return (
    <ReflectionContext.Provider
      value={{
        dailyReflection,
        loading,
        error,
        fetchDailyReflection,
        bookmarks,
        bmLoading,
        fetchBookmarks,
        setBookmarks,
        allNotes,
        notesLoading,
        fetchAllNotes,
        deleteNote,
      }}
    >
      {children}
    </ReflectionContext.Provider>
  );
};

export const useReflection = () => useContext(ReflectionContext);
