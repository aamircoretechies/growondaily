import { Container } from '@/components/container';
import { KeenIcon } from '@/components';
import { LucideSearch, LucideCalendar, LucidePencil, LucideTrash2, LucideArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useReflection } from '@/providers/ReflectionProvider';
import { useBible } from "@/providers/BibleProvider";
import EditNotePopup from "@/components/makenote/EditNotePopup";
import { toast } from "sonner";
import { FormattedMessage } from 'react-intl';




const SavedJournalListPage = () => {
  const navigate = useNavigate();
  const { allNotes, fetchAllNotes, notesLoading, deleteNote } = useReflection();
  const { selectBook, selectChapter, fetchSingleVerse, books, version, fetchDeepStudy, fetchDeepStudyForVerse, setShowDeepStudy, setActiveTab, setVerseActiveTab } = useBible();
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");


  const Loader = () => (
    <div className="flex justify-center items-center py-6">
      <div className="w-6 h-6 border-2 border-gray-400 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  const handleOpenNote = (entry: any) => {
    const { book, chapter, verse, version: noteVersion } = entry;
    if (!book || !chapter) return;

    const bookSlug = book.trim().toLowerCase().replace(/\s+/g, "-");
    const foundBook = books?.find(
      (b: any) => b.name.toLowerCase() === book.trim().toLowerCase()
    );

    if (!foundBook) return;

    // Set tab state synchronously before navigation
    if (verse) {
      setVerseActiveTab('original'); // Ensure original tab is active to show notes
      // Navigate immediately - let VerseStudy component handle data fetching
      navigate(`/bible?bible=${bookSlug}&chapter=${chapter}&verse=${verse}`);
    } else {
      setShowDeepStudy(true);
      setActiveTab('original'); // Ensure original tab is active to show notes
      // Navigate immediately - let DeepStudy component handle data fetching
      navigate(`/bible?bible=${bookSlug}&chapter=${chapter}`);
    }

    // Fetch data in background (non-blocking)
    selectBook(foundBook.book_id, foundBook.name);
    selectChapter(Number(chapter));

    if (verse) {
      fetchSingleVerse(foundBook.book_id, Number(chapter), Number(verse), noteVersion || version || "KJV");
      fetchDeepStudyForVerse(foundBook.book_id, Number(chapter), Number(verse), noteVersion || version || "KJV");
    } else {
      fetchDeepStudy(foundBook.book_id, Number(chapter), noteVersion || version || "KJV");
    }
  };

  const handleEditReflection = (entry: any) => {
    setSelectedNote(entry);
    setIsEditPopupOpen(true);
  };


  const handleDeleteReflection = async (id: string) => {
    const success = await deleteNote(id);

    if (success) {
      toast.success("Note deleted successfully");
    } else {
      toast.error("Failed to delete note");
    }
  };

  const journalEntries = allNotes || [];

  // const filteredEntries = journalEntries.filter((entry: any) =>
  //   entry.content?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
  //   entry.book?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
  //   (entry.emotion_tags?.join(' ') || '').toLowerCase().includes(searchQuery.trim().toLowerCase())
  // );

  const filteredEntries = journalEntries.filter((entry: any) => {
    const reference = `${entry.book || ""} ${entry.chapter || ""}${entry.verse ? ":" + entry.verse : ""}`;
    const tags = (entry.emotion_tags?.join(" ") || "").toLowerCase();

    return (
      reference.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      entry.content?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      tags.includes(searchQuery.trim().toLowerCase())
    );
  });



  const visibleEntries = filteredEntries.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(6);
  }, [searchQuery]);


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
              <span className="text-sm font-medium">
                <FormattedMessage id="COMMON.BACK_TO_REFLECTIONS" />
              </span>
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-0 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sand/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <h2 className="font-merriweather text-lg text-gray-600">
            {/* Showing {journalEntries.length} Journal Entries */}
            Showing {filteredEntries.length} Journal Entries
          </h2>
        </div>

        {notesLoading ? (
          <Loader />
        ) : filteredEntries.length === 0 ? (
          <p className="text-gray-500 italic">No journal entries found</p>
        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {visibleEntries.map((entry: any) => (
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
                  {(entry.emotion_tags !== undefined && entry.emotion_tags !== null
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
        )}

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
              // onClick={() => setVisibleCount(journalEntries.length)}
              onClick={() => setVisibleCount(filteredEntries.length)}
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
