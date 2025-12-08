import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useLanguage } from "@/providers/TranslationProvider";
import { useDashboard } from "@/pages/dashboards/providers/DashboardProvider";
import { I18N_LANGUAGES } from "@/i18n";
import { toast } from "sonner";

interface ReportPayload {
  book: string;
  chapter: number;
  verse: number;
  version: string;
  description: string;
  tags: string[];
}


const ReflectionContext = createContext<any>(null);

export const ReflectionProvider = ({ children }: any) => {
  const { currentLanguage } = useLanguage();
  const { isLoaded: dashboardLoaded } = useDashboard(); // Wait for dashboard to load
  const [dailyReflection, setDailyReflection] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [bmLoading, setBmLoading] = useState(false);
  const [allNotes, setAllNotes] = useState<any[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);

  //  Fetch today's reflection (with language param)
  const fetchDailyReflection = useCallback(async (timezone = "UTC", personalize = true) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/reflections/daily?timezone=${timezone}&personalize=${personalize}&lang=${currentLanguage.code}`, { withCredentials: true });

      setDailyReflection(res.data?.data?.reflection || null);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching daily reflection:", err.response?.data || err.message);
      setError("Failed to fetch reflection");
    } finally {
      setLoading(false);
    }
  }, [currentLanguage.code]);

  //  Fetch bookmarks (with language param)
  const fetchBookmarks = useCallback(async () => {
    try {
      setBmLoading(true);
      const res = await axios.get(`/api/bible/bookmarks?limit=100&offset=0&lang=${currentLanguage.code}`, { withCredentials: true });

      if (res.data?.status === 1) {
        const list = res.data.data.bookmarks || [];
        setBookmarks(list);
      }
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    } finally {
      setBmLoading(false);
    }
  }, [currentLanguage.code]);

  // Fetch all notes (for ALL languages)
  const fetchAllNotes = useCallback(async () => {
    try {
      setNotesLoading(true);

      // Create an array of promises for each supported language
      const requests = I18N_LANGUAGES.map(lang =>
        axios.get(`/api/reflections/notes?lang=${lang.code}`, { withCredentials: true })
          .then(res => res.data?.status === 1 ? res.data.data?.notes || [] : [])
          .catch(err => {
            console.error(`Error fetching notes for ${lang.code}:`, err);
            return [];
          })
      );

      // Wait for all requests to complete
      const results = await Promise.all(requests);

      // Flatten the array of arrays
      const allFetchedNotes = results.flat();

      // Remove duplicates based on note_id
      const uniqueNotes = Array.from(
        new Map(allFetchedNotes.map(note => [note.note_id, note])).values()
      );

      setAllNotes(uniqueNotes);

    } catch (err: any) {
      console.error("Error fetching notes:", err.response?.data || err.message);
      setAllNotes([]);
    } finally {
      setNotesLoading(false);
    }
  }, []);

  // Delete note (no need for language param)
  const deleteNote = useCallback(async (noteId: string) => {
    try {
      const res = await axios.delete(`/api/reflections/notes/${noteId}`, { withCredentials: true });
      if (res.data?.status === 1) {
        setAllNotes((prev) => prev.filter((n) => n.note_id !== noteId));
        // toast.success("Note deleted successfully");
        return true;
      } else {
        toast.error(res.data?.message || "Failed to delete note");
        return false;
      }
    } catch (err: any) {
      toast.error("Error deleting note");
      console.error("Error deleting note:", err.response?.data || err.message);
      return false;
    }
  }, []);


  // Update a note
  const updateNote = useCallback(async (noteId: string, updatedContent: string, updatedTags?: string[]) => {
    try {
      const payload: any = { content: updatedContent };
      if (updatedTags) payload.emotion_tags = updatedTags;

      const res = await axios.put(`/api/reflections/notes/${noteId}`, payload, {
        withCredentials: true,
      });

      if (res.data?.status === 1) {
        setAllNotes((prev) =>
          prev.map((note) =>
            note.note_id === noteId
              ? { ...note, content: updatedContent, emotion_tags: updatedTags }
              : note
          )
        );

        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating note:", err);
      return false;
    }
  }, []);

  // const submitReport = useCallback(async (payload: ReportPayload) => {
  //   try {
  //     const res = await axios.post(`/api/bible/report`,
  //       payload,
  //       { withCredentials: true }
  //     );

  //     if (res.data?.status === 1) {
  //       // toast.success("Report submitted successfully!");
  //       return { success: true, data: res.data.data };
  //     } else {
  //       // toast.error(res.data?.message || "Failed to submit report");
  //       return { success: false };
  //     }

  //   } catch (error) {
  //     console.log("REPORT ERROR:", error);
  //     // toast.error("Something went wrong!");
  //     return { success: false };
  //   }
  // }, []);

  const submitReport = useCallback(async (payload: ReportPayload) => {
    try {
      const res = await axios.post(`/api/bible/report`, payload, {
        withCredentials: true,
      });

      if (res.data?.status === 1) {
        return { success: true, data: res.data.data };
      }

      return {
        success: false,
        message: res.data?.message || "Report failed",
      };

    } catch (error: any) {
      console.log("REPORT ERROR:", error.response?.data || error.message);

      return {
        success: false,
        message:
          error?.response?.data?.message ||
          "Something went wrong",
      };
    }
  }, []);




  useEffect(() => {
    // Only fetch reflection data after dashboard is loaded
    if (!dashboardLoaded) return;

    fetchDailyReflection();
    fetchBookmarks();
    fetchAllNotes();

    // Listen for bookmark updates from BibleProvider
    const handleBookmarkUpdate = () => {
      console.log("Bookmark update event received, reloading bookmarks...");
      fetchBookmarks();
    };

    window.addEventListener('bookmark-updated', handleBookmarkUpdate);

    return () => {
      window.removeEventListener('bookmark-updated', handleBookmarkUpdate);
    };
  }, [dashboardLoaded, currentLanguage.code, fetchDailyReflection, fetchBookmarks, fetchAllNotes]);

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
        updateNote,
        submitReport,
      }}
    >
      {children}
    </ReflectionContext.Provider>
  );
};

export const useReflection = () => useContext(ReflectionContext);
