
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { KeenIcon } from '@/components';
import { useBible } from '@/providers/BibleProvider';
import { toast } from "sonner";


interface TabItem {
  id: string;
  title: string;
  icon: string;
}

const VerseStudy = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportIssue, setReportIssue] = useState('');
  const [reportCategory, setReportCategory] = useState('');
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState("");


  const { books, loading, fetchSingleVerse, fetchDeepStudyForVerse, deepStudyData, toggleVerseStatus, verseActiveTab, setVerseActiveTab } = useBible();

  const book = searchParams.get('bible') || 'genesis';
  const chapter = searchParams.get('chapter') || '1';
  const verse = searchParams.get('verse') || '1';

  const verseKey = `${book}-${chapter}-${verse}`;

  const [isRead, setIsRead] = useState(() => {
    const saved = localStorage.getItem(`verse-read-${verseKey}`);
    return saved === 'true';
  });

  const getBookId = () => {
  if (book.length === 36) return book;
  if (books.length > 0) {
    const found = books.find(
      (b) =>
        (b.name || "")
          .toLowerCase()
          .replace(/\s+/g, "-") === book.toLowerCase()
    );
    if (found) return found.book_id;
  }

  return book; 
};



  // const toggleReadStatus = () => {
  //   const newStatus = !isRead;
  //   setIsRead(newStatus);
  //   localStorage.setItem(`verse-read-${verseKey}`, newStatus.toString());
  // };

  const toggleReadStatus = async () => {
  const bookId = getBookId();

  const response = await toggleVerseStatus(
    bookId,
    Number(chapter),
    Number(verse),
    "KJV"
  );

  console.log("MARK AS READ RESPONSE:", response); 

  if (response.success) {
    setIsRead(response.is_read);
    localStorage.setItem(`verse-read-${verseKey}`, response.is_read.toString());

    // Store latest read verse for Continue Reading card
    if (response.is_read) {
      const foundBook = books.find(
        (b) =>
          (b.name || "")
            .toLowerCase()
            .replace(/\s+/g, "-") === book.toLowerCase()
      );
      const bookName = foundBook?.name || book;
      
      const latestReadVerse = {
        book_id: bookId,
        book: bookName,
        book_slug: book,
        chapter: Number(chapter),
        verse: Number(verse),
        version: "KJV",
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('latest-read-verse', JSON.stringify(latestReadVerse));
      
      // Dispatch custom event to notify HomePage
      window.dispatchEvent(new CustomEvent('verse-read-updated', { 
        detail: latestReadVerse 
      }));
    }

    toast.success(
      response.is_read ? "Marked as Read" : "Marked as Unread"
    );
  } else {
    toast.error("Something went wrong");
  }
};






  useEffect(() => {
    const loadVerse = async () => {
      let bookId = book;
      if (books.length > 0 && book.length !== 36) {
        const found = books.find(
          (b) =>
            (b.name || '').toLowerCase().replace(/\s+/g, '-') ===
            book.toLowerCase()
        );
        if (found) bookId = found.book_id;
      }

      if (bookId) {
        await Promise.all([
          fetchSingleVerse(bookId, Number(chapter), Number(verse), 'KJV'),
          fetchDeepStudyForVerse(bookId, Number(chapter), Number(verse), 'KJV'),
        ]);
      }
    };

    const noteKey = `note-${book}-${chapter}-${verse}`;
    const saved = localStorage.getItem(noteKey);
    if (saved) {
      setSavedNote(saved);
    } else {
      setSavedNote("");
    }
    loadVerse();
  }, [book, chapter, verse, books]);




  const tabs: TabItem[] = [
    { id: 'original', title: 'Original', icon: 'document' },
    { id: 'explanations', title: 'Explanation', icon: 'book-open' },
    { id: 'historical', title: 'Historical Context', icon: 'calendar' },
    { id: 'cultural', title: 'Cultural Context', icon: 'users' },
    { id: 'theological', title: 'Theological Insights', icon: 'book' },
    { id: 'practical', title: 'Practical Lessons', icon: 'check' },
    { id: 'commentary', title: 'Commentary Insights', icon: 'users' },
    { id: 'ground_text', title: 'Ground Text Analysis', icon: 'document' },
    { id: 'special', title: 'Special Insights', icon: 'lightbulb' },
    { id: 'daily_life', title: 'Daily Life Application', icon: 'home' },
    { id: 'cross_reference', title: 'Cross Reference', icon: 'link' },
    { id: 'key_takeaways', title: 'Key Takeaways', icon: 'star' },
    { id: 'reflection', title: 'Reflection Prompts', icon: 'question' },
  ];



  const getTabContent = (tabId: string) => {
    if (loading) return 'Loading...';
    if (!deepStudyData) return 'No data available.';

    // Find the correct bookId
    let bookId = book;
    if (books.length > 0 && book.length !== 36) {
      const found = books.find(
        (b) => (b.name || '').toLowerCase().replace(/\s+/g, '-') === book.toLowerCase()
      );
      if (found) bookId = found.book_id;
    }

    const verseKey = `${bookId}-${chapter}-${verse}`;

    const deepData = deepStudyData?.[verseKey];
    const ctx = deepData?.[tabId];
    if (!ctx) return 'Content not available.';
    const cleanText = (ctx.content || '').replace(/\*/g, '');
    return cleanText || 'Content not available.';
  };



  // const currentDate = new Date().toLocaleDateString();

  const handleReportSubmit = () => {
    if (!reportIssue.trim() || !reportCategory) {
      alert('Please fill in all required fields.');
      return;
    }

    console.log('Report submitted:', {
      verse: `${book} ${chapter}:${verse}`,
      issue: reportIssue,
      category: reportCategory,
      timestamp: new Date().toISOString(),
    });

    setReportIssue('');
    setReportCategory('');
    setShowReportModal(false);
    alert('Report submitted successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">

      <div className="mb-8">

        <div className="mb-4">
          <button
            onClick={() => navigate('/bible')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200"
          >
            <KeenIcon icon="black-left-line" className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Bible</span>
          </button>
        </div>

        <div className="flex items-center justify-between mb-2">
          <h1 className="font-merriweather text-4xl text-primary">
            {book.charAt(0).toUpperCase() + book.slice(1)} {chapter}:{verse}
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleReadStatus}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${isRead
                ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
            >
              <KeenIcon icon={isRead ? 'check' : 'book'} className="w-4 h-4" />
              {isRead ? 'Mark as Unread' : 'Mark as Read'}
            </button>


            <button
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              onClick={() => setShowReportModal(true)}
              title="Options"
            >
              <KeenIcon icon="dots-vertical" className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="font-merriweather text-xl text-gray-600 dark:text-gray-400">
          ({book.charAt(0).toUpperCase() + book.slice(1)} {chapter}:{verse} KJV)
        </p>
      </div>

      <div className="bg-white/40 dark:bg-gray-200 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-400">

        <div className="p-6 pb-0">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setVerseActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${verseActiveTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-300 text-gray-600 dark:text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-400 hover:text-gray-800'
                  }`}
              >
                <KeenIcon icon={tab.icon} className="text-base" />
                {tab.title}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`${verseActiveTab === tab.id ? 'block' : 'hidden'}`}
            >
              <div className="mb-6">
                <p className="font-merriweather text-lg leading-relaxed text-primary whitespace-pre-line">
                  {getTabContent(tab.id)}
                </p>
              </div>

              {/* Nested Card */}
              {tab.id === "original" && (
                <div className="mt-6 bg-white/70 dark:bg-gray-300 rounded-lg p-4 border border-gray-200 dark:border-gray-400">
                  <h3 className="text-lg font-semibold text-primary mb-3">Your Notes</h3>

                  {deepStudyData?.[`${book}-${chapter}-${verse}`]?.original?.notes?.length > 0 ? (
                    <div className="space-y-3">
                      {deepStudyData[`${book}-${chapter}-${verse}`].original.notes.map((note: any, index: number) => (
                        <div
                          key={note.note_id || index}
                          className="p-3 bg-white/80 dark:bg-gray-100 rounded-lg border border-gray-200 dark:border-gray-400 shadow-sm"
                        >
                          <p className="text-gray-700 dark:text-gray-800 mb-2 whitespace-pre-line font-merriweather">
                            {note.content}
                          </p>

                          {note.emotion_tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {note.emotion_tags.map((tag: string, i: number) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(note.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No saved notes yet.</p>
                  )}



                  {/* 
        {deepStudyData?.original?.notes &&
 deepStudyData.original.notes.filter(
   (n: any) =>
     n.chapter === Number(chapter) &&
     n.book_id === book &&
     (n.verse === 0 || n.verse === Number(verse))
 ).length > 0 ? (
  <div className="space-y-3">
    {deepStudyData.original.notes
      .filter(
        (n: any) =>
          n.chapter === Number(chapter) &&
          n.book_id === book &&
          (n.verse === 0 || n.verse === Number(verse))
      )
      .map((note: any, index: number) => (
        <div
          key={note.note_id || index}
          className="p-3 bg-white/80 dark:bg-gray-100 rounded-lg border border-gray-200 dark:border-gray-400 shadow-sm"
        >
          <p className="text-gray-700 dark:text-gray-800 mb-2 whitespace-pre-line font-merriweather">
            {note.content}
          </p>
          {note.emotion_tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {note.emotion_tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            {new Date(note.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
  </div>
) : (
  <p className="text-gray-500 italic">No saved notes yet.</p>
)} */}

                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/40 dark:bg-gray-200 backdrop-blur-sm rounded-xl shadow-xl max-w-md w-full mx-4 border border-gray-200 dark:border-gray-400">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-400">
              <h3 className="text-lg font-semibold text-primary">REPORT</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <KeenIcon icon="cross" className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-3 flex items-center gap-3 border border-primary/20">
                <KeenIcon icon="document" className="text-primary w-5 h-5" />
                <span className="text-primary font-medium">
                  {book.charAt(0).toUpperCase() + book.slice(1)} {chapter}:{verse}
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-300 rounded-lg p-3 border border-gray-200 dark:border-gray-400">
                <p className="text-sm text-primary">
                  {deepStudyData?.[verseActiveTab]?.emotion_tags?.join(', ') ||
                    'I feel like I’m learning to rest more instead of stressing...'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Describe the issue and share your thoughts
                </label>
                <textarea
                  value={reportIssue}
                  onChange={(e) => setReportIssue(e.target.value)}
                  placeholder="Describe the issue and share your thoughts"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-100 text-primary placeholder-gray-400"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Category
                </label>
                <div className="flex gap-2">
                  {['Content', 'Audio', 'Other'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setReportCategory(category)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${reportCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 dark:bg-gray-300 text-primary hover:bg-primary/10 dark:hover:bg-primary/20'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleReportSubmit}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { VerseStudy };
