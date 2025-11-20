import { Container } from '@/components/container';
import { KeenIcon } from '@/components';
import { LucideSearch, LucideCalendar, LucidePencil, LucideTrash2, LucideArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useReflection } from '@/providers/ReflectionProvider';
import { useBible } from "@/providers/BibleProvider";
import EditNotePopup from "@/components/makenote/EditNotePopup";
import { toast } from "sonner";




const SavedJournalListPage = () => {
  const navigate = useNavigate();
  const { allNotes, fetchAllNotes, notesLoading, deleteNote } = useReflection();
  const { selectBook, selectChapter, fetchSingleVerse, books, version, fetchDeepStudy, setShowDeepStudy } = useBible();
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [visibleCount, setVisibleCount] = useState(6);



  const handleOpenNote = async (entry: any) => {
    const { book, chapter, verse, version: noteVersion } = entry;
    if (!book || !chapter) return;

    const bookSlug = book.trim().toLowerCase().replace(/\s+/g, "-");
    const foundBook = books?.find(
      (b: any) => b.name.toLowerCase() === book.trim().toLowerCase()
    );

    if (!foundBook) return;

    await selectBook(foundBook.book_id, foundBook.name);
    await selectChapter(Number(chapter));

    if (verse) {
      await fetchSingleVerse(foundBook.book_id, Number(chapter), Number(verse), noteVersion || version || "KJV");
      navigate(`/bible?bible=${bookSlug}&chapter=${chapter}&verse=${verse}`);
    } else {
      // await fetchDeepStudy(foundBook.book_id, Number(chapter), noteVersion || version || "KJV");
      // navigate(`/bible?bible=${bookSlug}&chapter=${chapter}`);
      setShowDeepStudy(true);
      await fetchDeepStudy(foundBook.book_id, Number(chapter), noteVersion || version || "KJV");
      navigate(`/bible?bible=${bookSlug}&chapter=${chapter}`);

    }
  };


  // const handleEditReflection = (id: string) => {
  //   console.log('Edit reflection:', id);
  // };

  const handleEditReflection = (entry: any) => {
    setSelectedNote(entry);
    setIsEditPopupOpen(true);
  };


  // const handleDeleteReflection = (id: string) => {
  //   console.log('Delete reflection:', id);
  // };

  const handleDeleteReflection = async (id: string) => {
    const success = await deleteNote(id);

    if (success) {
      toast.success("Note deleted successfully");
    } else {
      toast.error("Failed to delete note");
    }
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
  //   },
  //   {
  //     id: '3',
  //     date: 'August 1, 2025',
  //     verse: 'John 3:16',
  //     content: "God's love is so overwhelming that He gave His only Son for us...",
  //     tags: ['love', 'sacrifice']
  //   },
  //   {
  //     id: '4',
  //     date: 'July 30, 2025',
  //     verse: 'Philippians 4:13',
  //     content: "I can do all things through Christ who strengthens me...",
  //     tags: ['strength', 'perseverance']
  //   }
  // ];

  const journalEntries = allNotes || [];


  useEffect(() => {
    fetchAllNotes();
  }, [fetchAllNotes]);

  return (
    <Container>
      <div className="min-h-screen p-0">
        {/* Header Section */}
        <div className="mb-8">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={() => navigate('/reflections')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200"
            >
              <LucideArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Reflections</span>
            </button>
          </div>

          <h1 className="font-merriweather text-4xl text-primary mb-2">
            Saved Journal List
          </h1>
          <p className="text-gray-600 text-lg">
            All your journal entries and reflections
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="bg-white/40 dark:bg-gray-200 backdrop-blur-sm rounded-xl p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by keywords, verses, or tags..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-0 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sand/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <h2 className="font-merriweather text-lg text-gray-600">
            Showing {journalEntries.length} Journal Entries
          </h2>
        </div>

        {/* Journal Entries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {journalEntries.slice(0, visibleCount).map((entry: any) => (
            <div key={entry.note_id} onClick={() => handleOpenNote(entry)} className="bg-white/80 dark:bg-transparent rounded-xl p-6 border border-transparent dark:border-gray-400 hover:shadow-lg transition-shadow cursor-pointer">
              {/* Entry Header */}
              <div className="flex items-center gap-2 mb-4">
                <LucideCalendar className="text-amber-600 w-4 h-4" />
                <span className="text-gray-600 text-sm font-medium">
                  {new Date(entry.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>

              {/* Verse */}
              <div className="mb-4">
                <h3 className="font-merriweather text-lg text-primary font-semibold">
                  {entry.book && entry.chapter
                    ? `${entry.book} ${entry.chapter}${entry.verse ? ':' + entry.verse : ''}`
                    : '—'}
                </h3>
              </div>

              {/* Entry Content */}
              <p className="text-primary text-sm leading-relaxed mb-4 line-clamp-3 ">
                {entry.content || 'No content'}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4 ">
                {(entry.emotion_tags?.length
                  ? entry.emotion_tags
                  : entry.original_tags || []
                ).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full font-medium "
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  // onClick={() => handleEditReflection(entry.note_id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditReflection(entry);
                  }}
                  className="w-8 h-8 bg-sand rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <LucidePencil className="text-white w-4 h-4" />
                </button>
                <button
                  // onClick={() => handleDeleteReflection(entry.note_id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    // handleEditReflection(entry);
                    handleDeleteReflection(entry.note_id);
                  }}
                  className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-300 transition-colors"
                >
                  <LucideTrash2 className="text-red-500 w-4 h-4" />
                </button>
              </div>
            </div>
          ))}


        </div>

        {/* Load More Button */}
        {/* <div className="mt-8 text-center">
          <button 
          className="px-6 py-3 bg-sand text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium">
            Load More Entries
          </button>
        </div> */}

        {journalEntries.length > visibleCount && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setVisibleCount(journalEntries.length)}
              className="px-6 py-3 bg-sand text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium"
            >
              Load More Entries
            </button>
          </div>
        )}

      </div>
      {isEditPopupOpen && selectedNote && (
        <EditNotePopup
          note={selectedNote}
          onClose={() => setIsEditPopupOpen(false)}
        />
      )}

    </Container>
  );
};

export { SavedJournalListPage };
