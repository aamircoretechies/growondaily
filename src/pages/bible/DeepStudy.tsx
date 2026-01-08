import { useEffect, useState, useMemo, useCallback } from 'react';
import { KeenIcon } from '@/components';
import { useBible } from '@/providers/BibleProvider';

import { FormattedMessage, useIntl } from 'react-intl';

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

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-6 h-6 border-2 border-gray-400 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
};


const DeepStudy = ({ showDeepStudyButton, onDeepStudyToggle, isDeepStudyActive, }: DeepStudyProps) => {
  const { selectedBookId, selectedChapter, version, deepStudyData, fetchDeepStudy, selectedBookName, loadingDeepStudy, activeTab, setActiveTab } = useBible();
  const { formatMessage } = useIntl();
  const [enabledTabs, setEnabledTabs] = useState<string[]>([]);

  // Pre-fetch all active tabs for better performance with priority
  useEffect(() => {
    if (selectedBookId && selectedChapter && version && enabledTabs.length > 0) {
      // 1. Prioritize current active tab
      fetchDeepStudy(selectedBookId, selectedChapter, version, activeTab, undefined, false);

      // 2. Stagger background tabs to avoid connection congestion
      const backgroundTabs = enabledTabs.filter(t => t !== activeTab);
      backgroundTabs.forEach((tab, index) => {
        setTimeout(() => {
          fetchDeepStudy(selectedBookId!, selectedChapter!, version!, tab, undefined, true);
        }, (index + 1) * 100);
      });
    }
  }, [selectedBookId, selectedChapter, version, enabledTabs, activeTab]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('reflection_feature_preferences');
      const prefs = saved ? JSON.parse(saved) : {};

      // Default to true if not set
      const isEnabled = (id: string) => prefs[id] !== false;

      const newEnabledTabs = ['original', 'explanations', 'source'];
      if (isEnabled('historical')) newEnabledTabs.push('historical');
      if (isEnabled('cultural')) newEnabledTabs.push('cultural');
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
      setEnabledTabs(['original', 'explanations', 'source', 'historical', 'cultural', 'theological', 'practical', 'commentary', 'ground_text', 'special', 'daily_life', 'cross_reference', 'key_takeaways', 'reflection']);
    }
  }, []);

  const allTabs: TabItem[] = useMemo(() => [
    { id: 'original', title: formatMessage({ id: 'DEEP_STUDY.TAB.ORIGINAL' }), icon: 'document', content: '' },
    { id: 'explanations', title: formatMessage({ id: 'DEEP_STUDY.TAB.EXPLANATION' }), icon: 'book-open', content: '' },
    { id: 'source', title: formatMessage({ id: 'DEEP_STUDY.TAB.SOURCE' }), icon: 'document', content: '' },
    { id: 'historical', title: formatMessage({ id: 'DEEP_STUDY.TAB.HISTORICAL_CONTEXT' }), icon: 'calendar', content: '' },
    { id: 'cultural', title: formatMessage({ id: 'DEEP_STUDY.TAB.CULTURAL_CONTEXT' }), icon: 'users', content: '' },
    { id: 'theological', title: formatMessage({ id: 'DEEP_STUDY.TAB.THEOLOGICAL_INSIGHTS' }), icon: 'book', content: '' },
    { id: 'practical', title: formatMessage({ id: 'DEEP_STUDY.TAB.PRACTICAL_LESSONS' }), icon: 'check', content: '' },
    { id: 'commentary', title: formatMessage({ id: 'DEEP_STUDY.TAB.COMMENTARY_INSIGHTS' }), icon: 'users', content: '' },
    { id: 'ground_text', title: formatMessage({ id: 'DEEP_STUDY.TAB.GROUND_TEXT_ANALYSIS' }), icon: 'document', content: '' },
    { id: 'special', title: formatMessage({ id: 'DEEP_STUDY.TAB.SPECIAL_INSIGHTS' }), icon: 'lightbulb', content: '' },
    { id: 'daily_life', title: formatMessage({ id: 'DEEP_STUDY.TAB.DAILY_LIFE_APPLICATION' }), icon: 'home', content: '' },
    { id: 'cross_reference', title: formatMessage({ id: 'DEEP_STUDY.TAB.CROSS_REFERENCE' }), icon: 'link', content: '' },
    { id: 'key_takeaways', title: formatMessage({ id: 'DEEP_STUDY.TAB.KEY_TAKEAWAYS' }), icon: 'star', content: '' },
    { id: 'reflection', title: formatMessage({ id: 'DEEP_STUDY.TAB.REFLECTION_PROMPTS' }), icon: 'question', content: '' },
  ], [formatMessage]);

  const tabs = useMemo(() => allTabs.filter(t => enabledTabs.includes(t.id) || enabledTabs.length === 0), [allTabs, enabledTabs]);

  // Reset active tab if it becomes disabled
  useEffect(() => {
    if (enabledTabs.length > 0 && !enabledTabs.includes(activeTab)) {
      setActiveTab('original');
    }
  }, [enabledTabs, activeTab, setActiveTab]);

  const getTabContent = useCallback((tabId: string) => {
    if (loadingDeepStudy) return <Loader />;
    if (!deepStudyData) return 'No data available.';
    const currentKey = `${selectedBookId}-${selectedChapter}-${version}`;
    const ctx = deepStudyData?.[currentKey]?.[tabId];

    if (ctx?.error) return <span className="text-red-500">{ctx.error}</span>;

    if (!ctx) return <Loader />;
    return (ctx.content || '').replace(/\*/g, '') || <Loader />;
  }, [deepStudyData, selectedBookId, selectedChapter, version, loadingDeepStudy]);

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
                  : 'bg-sand hover:bg-sand/80 text-primary dark:!text-white'
                  }`}
              >
                <KeenIcon icon="book" className="w-4 h-4" />
                {isDeepStudyActive ? <FormattedMessage id="BIBLE.HIDE_DEEP_STUDY" /> : <FormattedMessage id="BIBLE.DEEP_STUDY" />}
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
                  {/* <p className="font-merriweather text-base sm:text-lg leading-relaxed text-primary break-words whitespace-pre-line">
                    {getTabContent(tab.id)}
                  </p> */}
                  <div className="font-merriweather text-base sm:text-lg leading-relaxed text-primary break-words whitespace-pre-line">
                    {getTabContent(tab.id)}
                  </div>

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
                        const currentKey = `${selectedBookId}-${selectedChapter}-${version}`;
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
                  {tab.id === "original" && deepStudyData?.[`${selectedBookId}-${selectedChapter}-${version}`]?.original
                    ?.notes?.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <h3 className="text-sm font-semibold text-primary mb-2 ">Your Notes</h3>
                        {deepStudyData[`${selectedBookId}-${selectedChapter}-${version}`].original.notes.map((note: any, idx: number) => (
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
