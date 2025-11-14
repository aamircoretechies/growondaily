// import { Container } from '@/components/container';
// import { KeenIcon } from '@/components';
// import { LucideSearch, LucideArrowUpDown, LucideCalendar, LucidePencil, LucideTrash2 } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useReflection } from "@/providers/ReflectionProvider";
// import { useBible } from "@/providers/BibleProvider";
// import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
// import axios from "axios";




// const ReflectionsPage = () => {
//   const navigate = useNavigate();
//   const { selectBook, selectChapter, fetchSingleVerse, books, toggleVerseBookmark } = useBible();
//   const { dailyReflection, loading, error, bookmarks, bmLoading, fetchBookmarks, setBookmarks, allNotes, fetchAllNotes, notesLoading, deleteNote } = useReflection();



//   // Get current date in the format "Thu, Aug 07, 2025"
//   const getCurrentDate = () => {
//     const date = new Date();
//     return date.toLocaleDateString('en-US', {
//       weekday: 'short',
//       month: 'short',
//       day: '2-digit',
//       year: 'numeric'
//     });
//   };

//   // const handleReflectAndJournal = () => {
//   //   console.log('Reflect & Journal clicked');
//   // };

//   const handleReflectAndJournal = async () => {
//     try {
//       console.log("Reflection data:", dailyReflection);

//       if (!dailyReflection || !dailyReflection.verse_reference) {
//         console.warn("No verse reference found in reflection");
//         return;
//       }
//       const match = dailyReflection.verse_reference.match(/([A-Za-z ]+)\s+(\d+):(\d+)/);
//       if (!match) {
//         console.warn("Invalid verse reference format:", dailyReflection.verse_reference);
//         return;
//       }

//       const [, bookName, chapter, verse] = match;
//       const bookSlug = bookName.trim().toLowerCase().replace(/\s+/g, "-");

//       const book = books?.find(
//         (b: any) => b.name.toLowerCase() === bookName.trim().toLowerCase()
//       );

//       if (book) {
//         await selectBook(book.book_id, book.name);
//         await selectChapter(Number(chapter));
//         await fetchSingleVerse(book.book_id, Number(chapter), Number(verse), dailyReflection.version || "KJV");
//       }
//       navigate(`/bible?bible=${bookSlug}&chapter=${chapter}&verse=${verse}`);
//     } catch (error) {
//       console.error("Error in handleReflectAndJournal:", error);
//     }
//   };



//   const handleEditReflection = (id: string) => {
//     console.log('Edit reflection:', id);
//   };

//   // const handleDeleteReflection = (id: string) => {
//   //   console.log('Delete reflection:', id);
//   // };

//   // const handleDeleteReflection = async (entry: any) => {
//   //   try {
//   //     const noteId = entry.note_id;
//   //     await axios.delete(`${import.meta.env.VITE_APP_API_URL}/api/reflections/notes/${noteId}`);

//   //     await fetchAllNotes();

//   //     console.log("Note deleted successfully:", noteId);
//   //   } catch (err: any) {
//   //     console.error(" Error deleting note:", err.response?.data || err.message);
//   //   }
//   // };

//   const handleDeleteReflection = async (entry: any) => {
//     const noteId = entry.note_id;
//     await deleteNote(noteId);
//   };




//   // Mock data for journal entries
//   // const journalEntries = [
//   //   {
//   //     id: '1',
//   //     date: 'August 6, 2025',
//   //     verse: 'Romans 8:28',
//   //     content: "I've been reminded that even hard moments are being used for something good...",
//   //     tags: ['faith', 'growth']
//   //   },
//   //   {
//   //     id: '2',
//   //     date: 'August 3, 2025',
//   //     verse: 'Psalm 23:1',
//   //     content: "I feel like I'm learning to rest more instead of stressing...",
//   //     tags: ['peace', 'trust']
//   //   }
//   // ];

//   const latestNotes = allNotes
//     ?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
//     ?.slice(0, 2) || [];



//   // open bookmark (same as BookmarksPage)
//   const handleOpenBookmark = async (entry: any) => {
//     const { book, chapter, verse, version } = entry;
//     if (!book || !chapter || !verse) return;

//     const bookSlug = book.trim().toLowerCase().replace(/\s+/g, "-");
//     const foundBook = books?.find(
//       (b: any) => b.name.toLowerCase() === book.trim().toLowerCase()
//     );

//     if (foundBook) {
//       await selectBook(foundBook.book_id, foundBook.name);
//       await selectChapter(Number(chapter));
//       await fetchSingleVerse(foundBook.book_id, Number(chapter), Number(verse), version || "KJV");
//     }

//     navigate(`/bible?bible=${bookSlug}&chapter=${chapter}&verse=${verse}`);
//   };

//   // delete bookmark using provider toggle API and remove from UI
//   const handleDeleteBookmark = async (entry: any) => {
//     try {
//       await toggleVerseBookmark(entry.book, Number(entry.chapter), Number(entry.verse), entry.version || "KJV");
//       setBookmarks((prev: any[]) => prev.filter((b) => b.bookmark_id !== entry.bookmark_id));
//       console.log("Bookmark deleted:", entry.reference || entry.verse_text);
//     } catch (err) {
//       console.error("Error deleting bookmark:", err);
//     }
//   };

//   useEffect(() => {
//     fetchAllNotes();
//   }, []);

//   // open notes (similar to bookmarks)
//   const handleOpenNote = async (entry: any) => {
//     try {
//       const { book, chapter, verse, version } = entry;
//       if (!book || !chapter) return;

//       const bookSlug = book.trim().toLowerCase().replace(/\s+/g, "-");
//       const foundBook = books?.find(
//         (b: any) => b.name.toLowerCase() === book.trim().toLowerCase()
//       );

//       if (foundBook) {
//         await selectBook(foundBook.book_id, foundBook.name);
//         await selectChapter(Number(chapter));

//         if (verse) {
//           // verse-level note
//           await fetchSingleVerse(foundBook.book_id, Number(chapter), Number(verse), version || "KJV");
//           navigate(`/bible?bible=${bookSlug}&chapter=${chapter}&verse=${verse}`);
//         } else {
//           // chapter-level note
//           navigate(`/bible?bible=${bookSlug}&chapter=${chapter}`);
//         }
//       }
//     } catch (err) {
//       console.error("Error opening note:", err);
//     }
//   };




//   return (
//     <Container>
//       <div className="min-h-screen p-0">
//         {/* Grid Layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

//           {/* Left Column - Saved Journal List */}
//           <div className="lg:col-span-1">
//             <div className="flex items-center justify-between mb-2">
//               <h3 className="font-merriweather text-2xl text-primary">
//                 Saved Journal List
//               </h3>
//               <button
//                 onClick={() => navigate('/reflections/journal')}
//                 className="text-sm text-gray-600 hover:text-primary transition-colors"
//               >
//                 View All
//               </button>
//             </div>

//             {/* Search and Sort Section */}
//             <div className="mb-6 space-y-3">
//               {/* Search Bar */}
//               <div className="relative">
//                 <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search by keywords or tags.."
//                   className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-0 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sand/50"
//                 />
//               </div>
//             </div>

//             <h4 className="font-merriweather text-sm text-gray-600 mb-2">
//               Showing 2 Items
//             </h4>

//             {/* Journal Entries List */}
//             <div className="space-y-4">
//               {notesLoading ? (
//                 <p className="text-gray-500 text-sm">Loading notes...</p>
//               ) : latestNotes.length === 0 ? (
//                 <p className="text-gray-500 text-sm">No saved notes yet.</p>
//               ) : (
//                 latestNotes.map((entry: any) => (
//                   <div
//                     key={entry.note_id}
//                     onClick={() => handleOpenNote(entry)}
//                     className="bg-white/80 dark:bg-transparent rounded-xl p-4 border border-transparent dark:border-gray-400 cursor-pointer"
//                   >
//                     {/* Entry Header */}
//                     <div className="flex items-center gap-2 mb-3">
//                       <LucideCalendar className="text-amber-600 w-4 h-4" />
//                       <span className="text-gray-600 text-sm">
//                         {new Date(entry.created_at).toLocaleDateString('en-US', {
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric',
//                         })}{" "}
//                         –{" "}
//                         {entry.book && entry.chapter
//                           ? `${entry.book} ${entry.chapter}${entry.verse ? ':' + entry.verse : ''}`
//                           : '—'}
//                       </span>
//                     </div>

//                     {/* Entry Content */}
                  
//                     <p className="text-primary text-sm leading-relaxed mb-4 line-clamp-3 overflow-hidden text-ellipsis">
//                       {entry.content || 'No content'}
//                     </p>


//                     {/* Action Buttons */}
//                     <div className="flex justify-end gap-2">
//                       <button
//                         onClick={() => handleEditReflection(entry.note_id)}
//                         className="w-8 h-8 bg-sand rounded-full flex items-center justify-center hover:bg-primary transition-colors"
//                       >
//                         <LucidePencil className="text-white w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDeleteReflection(entry);
//                         }}
//                         className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-300 transition-colors"
//                       >
//                         <LucideTrash2 className="text-red-500 w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>





//           </div>

//           {/* Middle Column - Today's Reflection */}
//           <div className="lg:col-span-2">
//             {/* Header Section */}
//             <div className="mb-8">
//               <h1 className="font-merriweather text-2xl text-primary mb-2">
//                 Today's Reflection
//               </h1>
//               <p className="text-gray-600 text-sm">
//                 {getCurrentDate()}
//               </p>
//             </div>

//             {/* Main Reflection Card */}
//             {/* <div className="bg-white/40 dark:bg-gray-200 backdrop-blur-sm rounded-2xl  p-8">
          
//               <div className="mb-6">
//                 <h2 className="font-merriweather text-2xl text-primary leading-relaxed mb-2">
//                   "The Lord is my shepherd; I shall not want."
//                 </h2>
//                 <p className="text-gray-600 text-sm">
//                   (Psalm 23:1 KJV)
//                 </p>
//               </div>

//               <div className="mb-8">
//                 <p className="text-gray-700 text-base leading-relaxed">
//                   This verse reminds us that God provides, leads, and watches over us—just like a shepherd cares for his sheep.
//                 </p>
//               </div>

//               <div>
//                 <button
//                   onClick={handleReflectAndJournal}
//                   className="bg-transparent border border-gray-500 text-primary hover:text-white px-8 py-3 rounded-lg font-medium hover:bg-sand transition-colors duration-200"
//                 >
//                   Reflect & Journal
//                 </button>
//               </div>
//             </div> */}

//             <div className="bg-white/40 dark:bg-gray-200 backdrop-blur-sm rounded-2xl p-8">
//               {loading ? (
//                 <p className="text-gray-600">Loading reflection...</p>
//               ) : error ? (
//                 <p className="text-red-500">{error}</p>
//               ) : dailyReflection ? (
//                 <>
//                   {/* Bible Verse */}
//                   <div className="mb-6">
//                     <h2 className="font-merriweather text-2xl text-primary leading-relaxed mb-2">
//                       "{dailyReflection.verse_text}"
//                     </h2>
//                     <p className="text-gray-600 text-sm">
//                       ({dailyReflection.reference || `${dailyReflection.book} ${dailyReflection.chapter}:${dailyReflection.verse}`}{" "}
//                       {dailyReflection.version})
//                     </p>
//                   </div>

//                   {/* Explanation */}
//                   <div className="mb-8">
//                     <p className="text-gray-700 text-base leading-relaxed">
//                       {dailyReflection.content}
//                     </p>
//                   </div>

//                   {/* Action Button */}
//                   <div>
//                     <button
//                       onClick={handleReflectAndJournal}
//                       className="bg-transparent border border-gray-500 text-primary hover:text-white px-8 py-3 rounded-lg font-medium hover:bg-sand transition-colors duration-200"
//                     >
//                       Reflect & Journal
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <p className="text-gray-500">No reflection found for today.</p>
//               )}
//             </div>



//           </div>

//           {/* Right Column - Bookmarks */}
//           <div className="lg:col-span-1">
//             <div className="flex items-center justify-between mb-2">
//               <h3 className="font-merriweather text-2xl text-primary">
//                 Bookmarks
//               </h3>
//               <button
//                 onClick={() => navigate('/reflections/bookmarks')}
//                 className="text-sm text-gray-600 hover:text-primary transition-colors"
//               >
//                 View All
//               </button>
//             </div>

//             {/* Search and Sort Section */}
//             <div className="mb-6 space-y-3">
//               <div className="relative">
//                 <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search bookmarks.."
//                   className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-0 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sand/50"
//                 // optional: you can wire a local search state to filter bookmarks
//                 />
//               </div>
//             </div>

//             <h4 className="font-merriweather text-sm text-gray-600 mb-2">
//               Showing {bookmarks && bookmarks.length > 0 ? Math.min(2, bookmarks.length) : 2} Items
//             </h4>

//             <div className="space-y-4">
//               {bmLoading ? (
//                 <div className="text-sm text-gray-500">Loading bookmarks...</div>
//               ) : bookmarks && bookmarks.length > 0 ? (
//                 // show top 2 bookmarks
//                 bookmarks.slice(0, 2).map((entry: any) => (
//                   <div
//                     key={entry.bookmark_id}
//                     onClick={() => handleOpenBookmark(entry)}
//                     className="bg-white/80 dark:bg-transparent rounded-xl p-4 border border-transparent dark:border-gray-400 hover:shadow-lg transition-shadow cursor-pointer"
//                   >
//                     <div className="flex items-center gap-2 mb-3">
//                       <LucideCalendar className="text-amber-600 w-4 h-4" />
//                       <span className="text-gray-600 text-sm">
//                         {entry.reference || `${entry.book} ${entry.chapter}:${entry.verse}`}
//                       </span>
//                     </div>

//                     <p className="text-primary text-sm leading-relaxed mb-4 line-clamp-3">
//                       {entry.verse_text}
//                     </p>

//                     <div className="flex justify-end gap-2">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation(); // stop card click
//                           handleDeleteBookmark(entry);
//                         }}
//                         className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-300 transition-colors"
//                       >
//                         <LucideTrash2 className="text-red-500 w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500 text-sm">No bookmarks found.</p>
//               )}
//             </div>



//           </div>


//         </div>
//       </div>
//     </Container>
//   );
// };

// export { ReflectionsPage };





























































import { Container } from '@/components/container';
import { KeenIcon } from '@/components';
import { LucideSearch, LucideArrowUpDown, LucideCalendar, LucidePencil, LucideTrash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReflection } from "@/providers/ReflectionProvider";
import { useBible } from "@/providers/BibleProvider";
import { useState, useEffect } from "react";
import axios from "axios";
// import { useLanguage } from "@/hooks/useLanguage"; 
import { useLanguage } from "@/providers/TranslationProvider";




const ReflectionsPage = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { selectBook, selectChapter, fetchSingleVerse, books, toggleVerseBookmark } = useBible();
  const { dailyReflection, loading, error, bookmarks, bmLoading, fetchBookmarks, setBookmarks, allNotes, fetchAllNotes, notesLoading, deleteNote } = useReflection();



  // Get current date in the format "Thu, Aug 07, 2025"
 const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString(currentLanguage.code === 'nl' ? 'nl-NL' : 'en-US', { 
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  // const handleReflectAndJournal = () => {
  //   console.log('Reflect & Journal clicked');
  // };

  const handleReflectAndJournal = async () => {
    try {
      console.log("Reflection data:", dailyReflection);

      if (!dailyReflection || !dailyReflection.verse_reference) {
        console.warn("No verse reference found in reflection");
        return;
      }
      const match = dailyReflection.verse_reference.match(/([A-Za-z ]+)\s+(\d+):(\d+)/);
      if (!match) {
        console.warn("Invalid verse reference format:", dailyReflection.verse_reference);
        return;
      }

      const [, bookName, chapter, verse] = match;
      const bookSlug = bookName.trim().toLowerCase().replace(/\s+/g, "-");

      const book = books?.find(
        (b: any) => b.name.toLowerCase() === bookName.trim().toLowerCase()
      );

      if (book) {
        await selectBook(book.book_id, book.name);
        await selectChapter(Number(chapter));
        await fetchSingleVerse(book.book_id, Number(chapter), Number(verse), dailyReflection.version || "KJV");
      }
      navigate(`/bible?bible=${bookSlug}&chapter=${chapter}&verse=${verse}`);
    } catch (error) {
      console.error("Error in handleReflectAndJournal:", error);
    }
  };



  const handleEditReflection = (id: string) => {
    console.log('Edit reflection:', id);
  };

  // const handleDeleteReflection = (id: string) => {
  //   console.log('Delete reflection:', id);
  // };

  // const handleDeleteReflection = async (entry: any) => {
  //   try {
  //     const noteId = entry.note_id;
  //     await axios.delete(`${import.meta.env.VITE_APP_API_URL}/api/reflections/notes/${noteId}`);

  //     await fetchAllNotes();

  //     console.log("Note deleted successfully:", noteId);
  //   } catch (err: any) {
  //     console.error(" Error deleting note:", err.response?.data || err.message);
  //   }
  // };

  const handleDeleteReflection = async (entry: any) => {
    const noteId = entry.note_id;
    await deleteNote(noteId);
  };




  // Mock data for journal entries
  // const journalEntries = [
  //   {
  //     id: '1',
  //     date: 'August 6, 2025',
  //     verse: 'Romans 8:28',
  //     content: "I've been reminded that even hard moments are being used for something good...",
  //     tags: ['faith', 'growth']
  //   },
  //   {
  //     id: '2',
  //     date: 'August 3, 2025',
  //     verse: 'Psalm 23:1',
  //     content: "I feel like I'm learning to rest more instead of stressing...",
  //     tags: ['peace', 'trust']
  //   }
  // ];

  const latestNotes = allNotes
    ?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    ?.slice(0, 2) || [];



  // open bookmark (same as BookmarksPage)
  const handleOpenBookmark = async (entry: any) => {
    const { book, chapter, verse, version } = entry;
    if (!book || !chapter || !verse) return;

    const bookSlug = book.trim().toLowerCase().replace(/\s+/g, "-");
    const foundBook = books?.find(
      (b: any) => b.name.toLowerCase() === book.trim().toLowerCase()
    );

    if (foundBook) {
      await selectBook(foundBook.book_id, foundBook.name);
      await selectChapter(Number(chapter));
      await fetchSingleVerse(foundBook.book_id, Number(chapter), Number(verse), version || "KJV");
    }

    navigate(`/bible?bible=${bookSlug}&chapter=${chapter}&verse=${verse}`);
  };

  // delete bookmark using provider toggle API and remove from UI
  const handleDeleteBookmark = async (entry: any) => {
    try {
      await toggleVerseBookmark(entry.book, Number(entry.chapter), Number(entry.verse), entry.version || "KJV");
      setBookmarks((prev: any[]) => prev.filter((b) => b.bookmark_id !== entry.bookmark_id));
      console.log("Bookmark deleted:", entry.reference || entry.verse_text);
    } catch (err) {
      console.error("Error deleting bookmark:", err);
    }
  };

  useEffect(() => {
    fetchAllNotes();
  }, [currentLanguage.code]);

  // open notes (similar to bookmarks)
  const handleOpenNote = async (entry: any) => {
    try {
      const { book, chapter, verse, version } = entry;
      if (!book || !chapter) return;

      const bookSlug = book.trim().toLowerCase().replace(/\s+/g, "-");
      const foundBook = books?.find(
        (b: any) => b.name.toLowerCase() === book.trim().toLowerCase()
      );

      if (foundBook) {
        await selectBook(foundBook.book_id, foundBook.name);
        await selectChapter(Number(chapter));

        if (verse) {
          // verse-level note
          await fetchSingleVerse(foundBook.book_id, Number(chapter), Number(verse), version || "KJV");
          navigate(`/bible?bible=${bookSlug}&chapter=${chapter}&verse=${verse}`);
        } else {
          // chapter-level note
          navigate(`/bible?bible=${bookSlug}&chapter=${chapter}`);
        }
      }
    } catch (err) {
      console.error("Error opening note:", err);
    }
  };




  return (
    <Container>
      <div className="min-h-screen p-0">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Left Column - Saved Journal List */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-merriweather text-2xl text-primary">
                Saved Journal List
              </h3>
              <button
                onClick={() => navigate('/reflections/journal')}
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                View All
              </button>
            </div>

            {/* Search and Sort Section */}
            <div className="mb-6 space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by keywords or tags.."
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-0 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sand/50"
                />
              </div>
            </div>

            <h4 className="font-merriweather text-sm text-gray-600 mb-2">
              Showing 2 Items
            </h4>

            {/* Journal Entries List */}
            <div className="space-y-4">
              {notesLoading ? (
                <p className="text-gray-500 text-sm">Loading notes...</p>
              ) : latestNotes.length === 0 ? (
                <p className="text-gray-500 text-sm">No saved notes yet.</p>
              ) : (
                latestNotes.map((entry: any) => (
                  <div
                    key={entry.note_id}
                    onClick={() => handleOpenNote(entry)}
                    className="bg-white/80 dark:bg-transparent rounded-xl p-4 border border-transparent dark:border-gray-400 cursor-pointer"
                  >
                    {/* Entry Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <LucideCalendar className="text-amber-600 w-4 h-4" />
                      <span className="text-gray-600 text-sm">
                        {new Date(entry.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}{" "}
                        –{" "}
                        {entry.book && entry.chapter
                          ? `${entry.book} ${entry.chapter}${entry.verse ? ':' + entry.verse : ''}`
                          : '—'}
                      </span>
                    </div>

                    {/* Entry Content */}
                  
                    <p className="text-primary text-sm leading-relaxed mb-4 line-clamp-3 overflow-hidden text-ellipsis">
                      {entry.content || 'No content'}
                    </p>


                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditReflection(entry.note_id)}
                        className="w-8 h-8 bg-sand rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                      >
                        <LucidePencil className="text-white w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReflection(entry);
                        }}
                        className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-300 transition-colors"
                      >
                        <LucideTrash2 className="text-red-500 w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>





          </div>

          {/* Middle Column - Today's Reflection */}
          <div className="lg:col-span-2">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="font-merriweather text-2xl text-primary mb-2">
                Today's Reflection
              </h1>
              <p className="text-gray-600 text-sm">
                {getCurrentDate()}
              </p>
            </div>

            {/* Main Reflection Card */}
            {/* <div className="bg-white/40 dark:bg-gray-200 backdrop-blur-sm rounded-2xl  p-8">
          
              <div className="mb-6">
                <h2 className="font-merriweather text-2xl text-primary leading-relaxed mb-2">
                  "The Lord is my shepherd; I shall not want."
                </h2>
                <p className="text-gray-600 text-sm">
                  (Psalm 23:1 KJV)
                </p>
              </div>

              <div className="mb-8">
                <p className="text-gray-700 text-base leading-relaxed">
                  This verse reminds us that God provides, leads, and watches over us—just like a shepherd cares for his sheep.
                </p>
              </div>

              <div>
                <button
                  onClick={handleReflectAndJournal}
                  className="bg-transparent border border-gray-500 text-primary hover:text-white px-8 py-3 rounded-lg font-medium hover:bg-sand transition-colors duration-200"
                >
                  Reflect & Journal
                </button>
              </div>
            </div> */}

            <div className="bg-white/40 dark:bg-gray-200 backdrop-blur-sm rounded-2xl p-8">
              {loading ? (
                <p className="text-gray-600">Loading reflection...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : dailyReflection ? (
                <>
                  {/* Bible Verse */}
                  <div className="mb-6">
                    <h2 className="font-merriweather text-2xl text-primary leading-relaxed mb-2">
                      "{dailyReflection.verse_text}"
                    </h2>
                    <p className="text-gray-600 text-sm">
                      ({dailyReflection.reference || `${dailyReflection.book} ${dailyReflection.chapter}:${dailyReflection.verse}`}{" "}
                      {dailyReflection.version})
                    </p>
                  </div>

                  {/* Explanation */}
                  <div className="mb-8">
                    <p className="text-gray-700 text-base leading-relaxed">
                      {dailyReflection.content}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div>
                    <button
                      onClick={handleReflectAndJournal}
                      className="bg-transparent border border-gray-500 text-primary hover:text-white px-8 py-3 rounded-lg font-medium hover:bg-sand transition-colors duration-200"
                    >
                      Reflect & Journal
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">No reflection found for today.</p>
              )}
            </div>



          </div>

          {/* Right Column - Bookmarks */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-merriweather text-2xl text-primary">
                Bookmarks
              </h3>
              <button
                onClick={() => navigate('/reflections/bookmarks')}
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                View All
              </button>
            </div>

            {/* Search and Sort Section */}
            <div className="mb-6 space-y-3">
              <div className="relative">
                <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search bookmarks.."
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-0 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sand/50"
                // optional: you can wire a local search state to filter bookmarks
                />
              </div>
            </div>

            <h4 className="font-merriweather text-sm text-gray-600 mb-2">
              Showing {bookmarks && bookmarks.length > 0 ? Math.min(2, bookmarks.length) : 2} Items
            </h4>

            <div className="space-y-4">
              {bmLoading ? (
                <div className="text-sm text-gray-500">Loading bookmarks...</div>
              ) : bookmarks && bookmarks.length > 0 ? (
                // show top 2 bookmarks
                bookmarks.slice(0, 2).map((entry: any) => (
                  <div
                    key={entry.bookmark_id}
                    onClick={() => handleOpenBookmark(entry)}
                    className="bg-white/80 dark:bg-transparent rounded-xl p-4 border border-transparent dark:border-gray-400 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <LucideCalendar className="text-amber-600 w-4 h-4" />
                      <span className="text-gray-600 text-sm">
                        {entry.reference || `${entry.book} ${entry.chapter}:${entry.verse}`}
                      </span>
                    </div>

                    <p className="text-primary text-sm leading-relaxed mb-4 line-clamp-3">
                      {entry.verse_text}
                    </p>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // stop card click
                          handleDeleteBookmark(entry);
                        }}
                        className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-300 transition-colors"
                      >
                        <LucideTrash2 className="text-red-500 w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No bookmarks found.</p>
              )}
            </div>



          </div>


        </div>
      </div>
    </Container>
  );
};

export { ReflectionsPage };

