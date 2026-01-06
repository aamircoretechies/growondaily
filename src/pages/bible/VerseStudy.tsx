
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { KeenIcon } from '@/components';
import { useBible } from '@/providers/BibleProvider';
import { toast } from "sonner";
import { useDashboard } from '@/pages/dashboards/providers/DashboardProvider';
import { useReflection } from "@/providers/ReflectionProvider";
import { FormattedMessage } from 'react-intl';



interface TabItem {
  id: string;
  title: string;
  icon: string;
}

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-6 h-6 border-2 border-gray-400 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
};


const VerseStudy = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportIssue, setReportIssue] = useState('');
  const [reportCategory, setReportCategory] = useState('');
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const { submitReport } = useReflection();



  const { books, loadingDeepStudy, fetchSingleVerse, fetchDeepStudyForVerse, deepStudyData, toggleVerseStatus, verseActiveTab, setVerseActiveTab, version } = useBible();
  const { refetch: refetchDashboard } = useDashboard();

  const book = searchParams.get('bible') || 'genesis';
  const chapter = searchParams.get('chapter') || '1';
  const verse = searchParams.get('verse') || '1';

  const verseKey = `${book}-${chapter}-${verse}-${version || 'KJV'}`;

  // Always initialize to false - will be updated by useEffect when verse loads
  const [isRead, setIsRead] = useState(false);

  useEffect(() => {
    const currentVerseKey = `${book}-${chapter}-${verse}-${version || 'KJV'}`;
    setIsRead(false);

    // Then check localStorage for the current verse
    const saved = localStorage.getItem(`verse-read-${currentVerseKey}`);
    // Only set to true if localStorage explicitly has 'true' for THIS specific verse
    if (saved === 'true') {
      setIsRead(true);
    } else {
      // Explicitly set to false if not found or not 'true'
      setIsRead(false);
    }
  }, [book, chapter, verse, version]);

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
      version || "KJV"
    );

    console.log("MARK AS READ RESPONSE:", response);

    if (response.success) {
      setIsRead(response.is_read);
      localStorage.setItem(`verse-read-${verseKey}`, response.is_read.toString());

      const foundBook = books.find(
        (b) =>
          (b.name || "")
            .toLowerCase()
            .replace(/\s+/g, "-") === book.toLowerCase()
      );
      const bookName = foundBook?.name || book;

      const verseUpdateData = {
        book_id: bookId,
        book: bookName,
        book_slug: book,
        chapter: Number(chapter),
        verse: Number(verse),
        version: version || "KJV",
        is_read: response.is_read,
        timestamp: new Date().toISOString()
      };

      // Store latest read verse for Continue Reading card (only when marked as read)
      if (response.is_read) {
        localStorage.setItem('latest-read-verse', JSON.stringify(verseUpdateData));
      }

      // Dispatch custom event to notify DashboardProvider to refresh progress bar
      // This should happen for both read and unread to update the progress bar
      // window.dispatchEvent(new CustomEvent('verse-read-updated', {
      //   detail: verseUpdateData
      // }));

      // Refresh dashboard data to update progress bar immediately
      setTimeout(() => {
        refetchDashboard();
      }, 300);

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
        await fetchSingleVerse(bookId, Number(chapter), Number(verse), version || 'KJV');
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
  }, [book, chapter, verse, books, version]);

  // Separate effect for lazy loading deep study content
  useEffect(() => {
    const loadDeepStudy = async () => {
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
        await fetchDeepStudyForVerse(bookId, Number(chapter), Number(verse), version || 'KJV', verseActiveTab);
      }
    };
    loadDeepStudy();
  }, [book, chapter, verse, books, verseActiveTab, version]);




  const [enabledTabs, setEnabledTabs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('reflection_feature_preferences');
      const prefs = saved ? JSON.parse(saved) : {};

      // Default to true if not set (backward compatibility)
      const isEnabled = (id: string) => prefs[id] !== false;

      const newEnabledTabs = ['original', 'explanations'];
      if (isEnabled('historical')) newEnabledTabs.push('historical');
      if (isEnabled('cultural')) newEnabledTabs.push('cultural'); // Assuming cultural maps to something or always shown? User didn't specify cultural in the list, but it's in the tabs. I'll assume it's always shown or maps to historical? The user list: Historical, Ground Text, Special, Daily Life, Cross Ref, Commentary, Key Takeaways, Reflection. Cultural is NOT in the user list. I will assume it is always enabled or maybe grouped with historical? The user said "All of these options are enabled by default". If cultural isn't in the list, maybe it shouldn't be filtered? Or maybe it's part of historical? I'll leave it enabled for now to be safe, or maybe it's missing from the settings? The user instructions were specific about the list. I will leave 'cultural' and 'theological' and 'practical' enabled as they are not in the toggle list.
      if (isEnabled('theological')) newEnabledTabs.push('theological');
      if (isEnabled('practical')) newEnabledTabs.push('practical');
      if (isEnabled('commentary')) newEnabledTabs.push('commentary');
      if (isEnabled('ground_text')) newEnabledTabs.push('ground_text');
      if (isEnabled('special')) newEnabledTabs.push('special');
      if (isEnabled('daily_life')) newEnabledTabs.push('daily_life');
      if (isEnabled('cross_reference')) newEnabledTabs.push('cross_reference');
      if (isEnabled('key_takeaways')) newEnabledTabs.push('key_takeaways');
      if (isEnabled('reflection')) newEnabledTabs.push('reflection');

      setEnabledTabs(newEnabledTabs);
    } catch {
      // If error, show all
      setEnabledTabs(['original', 'explanations', 'historical', 'cultural', 'theological', 'practical', 'commentary', 'ground_text', 'special', 'daily_life', 'cross_reference', 'key_takeaways', 'reflection']);
    }
  }, []);

  const allTabs: TabItem[] = useMemo(() => [
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
  ], []);

  const tabs = useMemo(() => allTabs.filter(t => enabledTabs.includes(t.id) || enabledTabs.length === 0), [allTabs, enabledTabs]);

  // Reset active tab if it becomes disabled
  useEffect(() => {
    if (enabledTabs.length > 0 && !enabledTabs.includes(verseActiveTab)) {
      setVerseActiveTab('original');
    }
  }, [enabledTabs, verseActiveTab, setVerseActiveTab]);



  const getTabContent = useCallback((tabId: string) => {
    if (loadingDeepStudy) return <Loader />;
    if (!deepStudyData) return 'No data available.';

    // Find the correct bookId - optimizing this inside the callback to avoid complex dependency
    let bookId = book;
    if (books.length > 0 && book.length !== 36) {
      const found = books.find(
        (b) => (b.name || '').toLowerCase().replace(/\s+/g, '-') === book.toLowerCase()
      );
      if (found) bookId = found.book_id;
    }

    const verseKey = `${bookId}-${chapter}-${verse}-${version || 'KJV'}`;

    const deepData = deepStudyData?.[verseKey];
    const ctx = deepData?.[tabId];

    if (ctx?.error) return <span className="text-red-500">{ctx.error}</span>;

    if (!ctx) return 'Content not available.';
    const cleanText = (ctx.content || '').replace(/\*/g, '');
    return cleanText || 'Content not available.';
  }, [deepStudyData, book, books, chapter, verse, version, loadingDeepStudy]);


  // const handleReportSubmit = async () => {
  //   const wordCount = reportIssue.trim().split(/\s+/).length;
  //   if (wordCount > 200) {
  //     toast.error("Word limit exceeded (maximum 200 words)");
  //     return;
  //   }

  //   if (!reportIssue.trim() || !reportCategory) {
  //     toast.error("Please fill all fields");
  //     return;
  //   }

  //   const payload = {
  //     book: book.charAt(0).toUpperCase() + book.slice(1),
  //     chapter: Number(chapter),
  //     verse: Number(verse),
  //     version: "KJV",
  //     description: reportIssue,
  //     tags: [reportCategory.toLowerCase()]
  //   };

  //   console.log("REPORT PAYLOAD:", payload);

  //   const response = await submitReport(payload);
  //   console.log("REPORT RESPONSE:", response); 

  //   if (response.success) {
  //     toast.success("Report submitted successfully!");

  //     setReportIssue("");
  //     setReportCategory("");
  //     setShowReportModal(false);
  //   } else {
  //     toast.error(response?.message || "Something went wrong, please try again.");
  //   }
  // };

  const handleReportSubmit = async () => {
    if (!reportIssue.trim() || !reportCategory) {
      toast.error("Please fill all fields");
      return;
    }

    // ✅ Strict sanitation
    const cleanDescription = reportIssue
      .replace(/\n+/g, " ")
      .replace(/"/g, "")
      .trim();

    const wordCount = cleanDescription.split(/\s+/).length;

    if (wordCount > 200) {
      toast.error("Maximum 200 words allowed");
      return;
    }

    const payload = {
      book: book.charAt(0).toUpperCase() + book.slice(1),
      chapter: Number(chapter),
      verse: Number(verse),
      version: version || "KJV",
      description: cleanDescription,
      tags: [reportCategory.toLowerCase()]
    };

    console.log("REPORT PAYLOAD:", payload);

    const response = await submitReport(payload);

    console.log("REPORT RESPONSE:", response);

    if (response?.success === true) {
      toast.success("Report submitted successfully!");
      setReportIssue("");
      setReportCategory("");
      setShowReportModal(false);
    } else {
      toast.error(response?.message || "Something went wrong");
    }
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
            <span className="text-sm font-medium">
              <FormattedMessage id="COMMON.BACK_TO_BIBLE" />
            </span>
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
              {isRead ? <FormattedMessage id="BIBLE.MARK_AS_UNREAD" /> : <FormattedMessage id="BIBLE.MARK_AS_READ" />}
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
          ({book.charAt(0).toUpperCase() + book.slice(1)} {chapter}:{verse} {version})
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
                {/* <p className="font-merriweather text-lg leading-relaxed text-primary whitespace-pre-line">
                  {getTabContent(tab.id)}
                </p> */}
                <div className="font-merriweather text-lg leading-relaxed text-primary whitespace-pre-line">
                  {loadingDeepStudy ? <Loader /> : getTabContent(tab.id)}
                </div>
              </div>

              {/* Nested Card */}
              {tab.id === "original" && (() => {
                // Find the correct bookId
                let bookId = book;
                if (books.length > 0 && book.length !== 36) {
                  const found = books.find(
                    (b) => (b.name || '').toLowerCase().replace(/\s+/g, '-') === book.toLowerCase()
                  );
                  if (found) bookId = found.book_id;
                }
                const verseKey = `${bookId}-${chapter}-${verse}-${version || 'KJV'}`;
                const verseNotes = deepStudyData?.[verseKey]?.original?.notes || [];

                return (
                  <div className="mt-6 bg-white/70 dark:bg-gray-300 rounded-lg p-4 border border-gray-200 dark:border-gray-400">
                    <h3 className="text-lg font-semibold text-primary mb-3">
                      <FormattedMessage id="COMMON.YOUR_NOTES" />
                    </h3>

                    {verseNotes.length > 0 ? (
                      <div className="space-y-3">
                        {verseNotes.map((note: any, index: number) => (
                          <div
                            key={note.note_id || index}
                            className="p-3 bg-white/80 dark:bg-gray-100 rounded-lg border border-gray-200 dark:border-gray-400 shadow-sm"
                          >
                            <p className="text-gray-700 dark:text-gray-800 mb-2 whitespace-pre-line font-merriweather break-words break-all">
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
                      <p className="text-gray-500 italic">
                        <FormattedMessage id="COMMON.NO_NOTES" />
                      </p>
                    )}
                  </div>
                );
              })()}
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
                    "I feel like I'm learning to rest more instead of stressing..."}
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-100 text-primary placeholder-gray-400 max-h-32 overflow-y-auto resize-none"
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
