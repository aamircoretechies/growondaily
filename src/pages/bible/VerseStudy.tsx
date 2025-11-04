import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { KeenIcon } from '@/components';
import { useBible } from '@/providers/BibleProvider';

interface TabItem {
  id: string;
  title: string;
  icon: string;
}

const VerseStudy = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('original');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportIssue, setReportIssue] = useState('');
  const [reportCategory, setReportCategory] = useState('');

  const {
    books,
    selectedVerse,
    loading,
    fetchSingleVerse,
    fetchDeepStudyForVerse,
    deepStudyData,
  } = useBible();

  const book = searchParams.get('bible') || 'psalm';
  const chapter = searchParams.get('chapter') || '23';
  const verse = searchParams.get('verse') || '1';

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

  useEffect(() => {
  const loadVerse = async () => {
    let bookId = book;

    // Try to get from already loaded books list
    if (books.length > 0 && book.length !== 36) {
      const found = books.find(
        (b) =>
          (b.name || "").toLowerCase().replace(/\s+/g, "-") ===
          book.toLowerCase()
      );
      if (found) bookId = found.book_id;
    }

    // ✅ Don't wait for books if we already have a valid bookId in URL
    if (bookId) {
      // run both calls in parallel (faster)
      await Promise.all([
        fetchSingleVerse(bookId, Number(chapter), Number(verse), "KJV"),
        fetchDeepStudyForVerse(bookId, Number(chapter), Number(verse), "KJV"),
      ]);
    }
  };

  // run immediately, not waiting for books to finish
  loadVerse();
}, [book, chapter, verse]);




  const getTabContent = (tabId: string) => {
    if (loading) return "Loading...";
    if (!deepStudyData) return "No data available.";
    const ctx = deepStudyData?.[tabId];
    if (!ctx) return "Content not available.";
    const cleanText = (ctx.content || "").replace(/\*/g, "");
    if (tabId === "original") return cleanText || "Original text not available.";
    return cleanText || "Content not available.";
  };

  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen text-primary overflow-hidden">
      <div className="max-w-4xl mx-auto overflow-hidden">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h1 className="font-merriweather text-2xl sm:text-2xl text-primary break-words">
                {book.charAt(0).toUpperCase() + book.slice(1)} {chapter}:{verse}
              </h1>
              <p className="font-merriweather text-sm text-gray-600 mt-1 break-words">
                (KJV)
              </p>
            </div>
            <button
              onClick={() => navigate('/bible')}
              className="flex items-center justify-center gap-2 px-4 py-2 w-full lg:w-auto rounded-lg font-medium transition-colors text-sm bg-sand text-primary hover:bg-sand/80"
            >
              <KeenIcon icon="black-left-line" className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`grid grid-flow-col auto-cols-max items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-200 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                }`}
              >
                <KeenIcon icon={tab.icon} className="text-base" />
                <span>{tab.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content (same as DeepStudy) */}
        <div className="bg-white/40 dark:bg-transparent backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
          <div className="p-4 sm:p-6 w-full overflow-hidden">
            {tabs.map((tab) => (
              <div key={tab.id} className={`${activeTab === tab.id ? 'block' : 'hidden'}`}>
                <div className="mb-4 sm:mb-6">
                  <p className="font-merriweather text-base sm:text-lg leading-relaxed text-primary break-words whitespace-pre-line">
                    {getTabContent(tab.id)}
                  </p>
                </div>

                {deepStudyData && (
                  <div className="bg-white/60 dark:bg-gray-200 rounded-lg p-2 sm:p-3 lg:p-4 overflow-hidden w-full">
                    <div className="flex items-center gap-3 mb-2">
                      <KeenIcon icon="calendar" className="text-gray-500 text-sm dark:text-gray-700" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-700">
                        {(() => {
                          const ctx = deepStudyData?.[tab.id];
                          const date = ctx?.generated_at
                            ? new Date(ctx.generated_at).toLocaleDateString()
                            : currentDate;
                          return `${date} - ${book.charAt(0).toUpperCase() + book.slice(1)} ${chapter}:${verse}`;
                        })()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-merriweather dark:text-gray-800">
                      {deepStudyData?.[tab.id]?.emotion_tags?.join(', ') || 'No emotion tags'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { VerseStudy };




