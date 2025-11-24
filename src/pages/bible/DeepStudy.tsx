import { useEffect } from 'react';
import { KeenIcon } from '@/components';
import { useBible } from '@/providers/BibleProvider';

interface TabItem {
  id: string;
  title: string;
  icon: string;
  content: string;
}

interface DeepStudyProps {
  showDeepStudyButton?: boolean;
  onDeepStudyToggle?: () => void;
  isDeepStudyActive?: boolean;
}

const DeepStudy = ({ showDeepStudyButton, onDeepStudyToggle, isDeepStudyActive, }: DeepStudyProps) => {
  const { selectedBookId, selectedChapter, version, deepStudyData, fetchDeepStudy, selectedBookName, loadingDeepStudy, activeTab, setActiveTab } = useBible();

  useEffect(() => {
    if (selectedBookId && selectedChapter && version) {
      fetchDeepStudy(selectedBookId, selectedChapter, version);
    }
  }, [selectedBookId, selectedChapter, version]);

  const tabs: TabItem[] = [
    { id: 'original', title: 'Original', icon: 'document', content: '' },
    { id: 'explanations', title: 'Explanation', icon: 'book-open', content: '' },
    { id: 'historical', title: 'Historical Context', icon: 'calendar', content: '' },
    { id: 'cultural', title: 'Cultural Context', icon: 'users', content: '' },
    { id: 'theological', title: 'Theological Insights', icon: 'book', content: '' },
    { id: 'practical', title: 'Practical Lessons', icon: 'check', content: '' },
    { id: 'commentary', title: 'Commentary Insights', icon: 'users', content: '' },
    { id: 'ground_text', title: 'Ground Text Analysis', icon: 'document', content: '' },
    { id: 'special', title: 'Special Insights', icon: 'lightbulb', content: '' },
    { id: 'daily_life', title: 'Daily Life Application', icon: 'home', content: '' },
    { id: 'cross_reference', title: 'Cross Reference', icon: 'link', content: '' },
    { id: 'key_takeaways', title: 'Key Takeaways', icon: 'star', content: '' },
    { id: 'reflection', title: 'Reflection Prompts', icon: 'question', content: '' },
  ];

  const getTabContent = (tabId: string) => {
    if (loadingDeepStudy) return 'Loading deep study content...';
    if (!deepStudyData) return 'No data available.';
    const currentKey = `${selectedBookId}-${selectedChapter}`;
    const ctx = deepStudyData?.[currentKey]?.[tabId];
    if (!ctx) return 'Content not available.';
    return (ctx.content || '').replace(/\*/g, '') || 'Content not available.';
  };

  return (
    <div className="min-h-screen text-primary overflow-hidden">
      <div className="max-w-4xl mx-auto overflow-hidden">
        {/* Title Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h1 className="font-merriweather text-2xl sm:text-2xl text-primary break-words">
                {selectedBookName || 'Selected Book'}
              </h1>
              <p className="font-merriweather text-sm text-gray-600 mt-1 break-words">
                (Chapter {selectedChapter} {version})
              </p>
            </div>
            {showDeepStudyButton && onDeepStudyToggle && (
              <button
                onClick={onDeepStudyToggle}
                className={`flex items-center justify-center gap-2 px-4 py-2 w-full lg:w-auto rounded-lg font-medium transition-colors text-sm ${isDeepStudyActive
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-sand text-primary hover:bg-sand/80'
                  }`}
              >
                <KeenIcon icon="book" className="w-4 h-4" />
                {isDeepStudyActive ? 'Hide Deep Study' : 'Deep Study'}
              </button>
            )}
          </div>
        </div>

        {/* Tab Buttons - Outside Card */}
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`grid grid-flow-col auto-cols-max items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
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

        {/* Main Content Card */}
        <div className="bg-white/40 dark:bg-transparent backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
          <div className="p-4 sm:p-6 w-full overflow-hidden">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`${activeTab === tab.id ? 'block' : 'hidden'}`}
              >
                {/* Main Content */}
                <div className="mb-4 sm:mb-6">
                  <p className="font-merriweather text-base sm:text-lg leading-relaxed text-primary break-words whitespace-pre-line">
                    {getTabContent(tab.id)}
                  </p>
                </div>

                {/* Nested Card (Notes & Date Section) */}
                <div className="bg-white/60 dark:bg-gray-200 rounded-lg p-2 sm:p-3 lg:p-4 overflow-hidden w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <KeenIcon
                      icon="calendar"
                      className="text-gray-500 text-sm dark:text-gray-700"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-700">
                      {(() => {
                        const currentKey = `${selectedBookId}-${selectedChapter}`;
                        const ctx = deepStudyData?.[currentKey]?.[tab.id];
                        const date = ctx?.generated_at
                          ? new Date(ctx.generated_at).toLocaleDateString()
                          : '';
                        const chapterLabel = ctx?.chapter ?? selectedChapter;
                        return `${date} - ${selectedBookName || ''
                          } ${chapterLabel}`.trim();
                      })()}
                    </span>
                  </div>

                  {/* User Notes Section - Only show in original tab */}
                  {tab.id === "original" && deepStudyData?.[`${selectedBookId}-${selectedChapter}`]?.original
                    ?.notes?.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <h3 className="text-sm font-semibold text-primary mb-2 ">Your Notes</h3>
                        {deepStudyData[`${selectedBookId}-${selectedChapter}`].original.notes.map((note: any, idx: number) => (
                          <div
                            key={note.note_id || idx}
                            className="border border-gray-200 bg-white/80 dark:bg-gray-100 rounded-lg p-2 sm:p-3"
                          >
                            <p className="text-sm text-gray-800 font-merriweather whitespace-pre-wrap break-words break-all">
                              {note.content}
                            </p>
                            {note.emotion_tags?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
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
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { DeepStudy };
