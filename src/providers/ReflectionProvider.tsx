// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// const ReflectionContext = createContext<any>(null);

// export const ReflectionProvider = ({ children }: any) => {
//   const [dailyReflection, setDailyReflection] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [bookmarks, setBookmarks] = useState<any[]>([]);
//   const [bmLoading, setBmLoading] = useState(false);
//   const [allNotes, setAllNotes] = useState<any[]>([]);
//   const [notesLoading, setNotesLoading] = useState(false);

//   const fetchDailyReflection = async (timezone = "UTC", personalize = true) => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`https://api.growondaily.com/api/reflections/daily?timezone=${timezone}&personalize=${personalize}`,
//         { withCredentials: true }
//       );
//       setDailyReflection(res.data?.data?.reflection || null);
//       setError(null);
//     } catch (err: any) {
//       console.error("Error fetching daily reflection:", err.response?.data || err.message);
//       setError("Failed to fetch reflection");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const fetchBookmarks = async () => {
//     try {
//       setBmLoading(true);
//       const res = await axios.get(
//         "https://api.growondaily.com/api/bible/bookmarks?limit=100&offset=0",
//         { withCredentials: true }
//       );
//       if (res.data?.status === 1) {
//         const list = res.data.data.bookmarks || [];
//         setBookmarks(list);
//       }
//     } catch (err) {
//       console.error("Error fetching bookmarks:", err);
//     } finally {
//       setBmLoading(false);
//     }
//   };

//   const fetchAllNotes = async () => {
//     try {
//       setNotesLoading(true);
//       const res = await axios.get("https://api.growondaily.com/api/reflections/notes",
//         { withCredentials: true }
//       );
//       if (res.data?.status === 1) {
//         const notes = res.data.data?.notes || [];
//         setAllNotes(notes);
//       } else {
//         console.error("Failed to fetch notes:", res.data?.message);
//         setAllNotes([]);
//       }
//     } catch (err: any) {
//       console.error("Error fetching notes:", err.response?.data || err.message);
//       setAllNotes([]);
//     } finally {
//       setNotesLoading(false);
//     }
//   };

//   const deleteNote = async (noteId: string) => {
//     try {
//       const res = await axios.delete(`https://api.growondaily.com/api/reflections/notes/${noteId}`,
//         { withCredentials: true }
//       );

//       if (res.data?.status === 1) {
//         setAllNotes((prev) => prev.filter((n) => n.note_id !== noteId));
//         console.log("Note deleted successfully:", noteId);
//       } else {
//         console.error("Failed to delete note:", res.data?.message);
//       }
//     } catch (err: any) {
//       console.error("Error deleting note:", err.response?.data || err.message);
//     }
//   };


//   useEffect(() => {
//     fetchDailyReflection();
//     fetchBookmarks();
//     fetchAllNotes();
//   }, []);





//   return (
//     <ReflectionContext.Provider
//       value={{
//         dailyReflection,
//         loading,
//         error,
//         fetchDailyReflection,
//         bookmarks,
//         bmLoading,
//         fetchBookmarks,
//         setBookmarks,
//         allNotes,
//         notesLoading,
//         fetchAllNotes,
//         deleteNote,
//       }}
//     >
//       {children}
//     </ReflectionContext.Provider>
//   );
// };

// export const useReflection = () => useContext(ReflectionContext);

























import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "@/providers/TranslationProvider";
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
  const [dailyReflection, setDailyReflection] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [bmLoading, setBmLoading] = useState(false);
  const [allNotes, setAllNotes] = useState<any[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);

  //  Fetch today's reflection (with language param)
  const fetchDailyReflection = async (timezone = "UTC", personalize = true) => {
    try {
      setLoading(true);
      // const res = await axios.get(
      //   `https://api.growondaily.com/api/reflections/daily?timezone=${timezone}&personalize=${personalize}&lang=${currentLanguage.code}`,
      //   { withCredentials: true }
      // );
      const res = await axios.get(`/api/reflections/daily?timezone=${timezone}&personalize=${personalize}&lang=${currentLanguage.code}`, { withCredentials: true });

      setDailyReflection(res.data?.data?.reflection || null);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching daily reflection:", err.response?.data || err.message);
      setError("Failed to fetch reflection");
    } finally {
      setLoading(false);
    }
  };

  //  Fetch bookmarks (with language param)
  const fetchBookmarks = async () => {
    try {
      setBmLoading(true);
      // const res = await axios.get(
      //   `https://api.growondaily.com/api/bible/bookmarks?limit=100&offset=0&lang=${currentLanguage.code}`,
      //   { withCredentials: true }
      // );
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
  };

  // Fetch all notes (with language param)
  const fetchAllNotes = async () => {
    try {
      setNotesLoading(true);
      // const res = await axios.get(
      //   `https://api.growondaily.com/api/reflections/notes?lang=${currentLanguage.code}`,
      //   { withCredentials: true }
      // );

      const res = await axios.get(`/api/reflections/notes?lang=${currentLanguage.code}`, { withCredentials: true });

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

  // Delete note (no need for language param)
  const deleteNote = async (noteId: string) => {
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
  };


  // Update a note
  const updateNote = async (noteId: string, updatedContent: string, updatedTags?: string[]) => {
    try {
      const payload: any = { content: updatedContent };
      if (updatedTags) payload.tags = updatedTags;

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
  };

  const submitReport = async (payload: ReportPayload) => {
  try {
    const res = await axios.post(`/api/bible/report`,
      payload,
      { withCredentials: true }
    );

    if (res.data?.status === 1) {
      // toast.success("Report submitted successfully!");
      return { success: true, data: res.data.data };
    } else {
      // toast.error(res.data?.message || "Failed to submit report");
      return { success: false };
    }

  } catch (error) {
    console.log("REPORT ERROR:", error);
    toast.error("Something went wrong!");
    return { success: false };
  }
};





  useEffect(() => {
    fetchDailyReflection();
    fetchBookmarks();
    fetchAllNotes();
  }, [currentLanguage.code]);

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
