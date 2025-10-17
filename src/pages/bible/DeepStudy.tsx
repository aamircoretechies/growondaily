import { useState } from 'react';
import { KeenIcon } from '@/components';

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

const DeepStudy = ({ showDeepStudyButton, onDeepStudyToggle, isDeepStudyActive }: DeepStudyProps) => {
  const [activeTab, setActiveTab] = useState('explanation');

  const tabs: TabItem[] = [
    {
      id: 'explanation',
      title: 'Explanation',
      icon: 'book-open',
      content: 'This section provides a detailed explanation of the biblical text, breaking down complex concepts and theological meanings. It helps readers understand the deeper significance of the passage and its relevance to faith.'
    },
    {
      id: 'historical-context',
      title: 'Historical Context',
      icon: 'calendar',
      content: 'Explore the historical background, cultural setting, and time period in which this passage was written. Understanding the historical context helps illuminate the meaning and significance of the text.'
    },
    {
      id: 'ground-text-analysis',
      title: 'Ground Text Analysis',
      icon: 'document',
      content: 'Dive into the original language, word studies, and textual analysis. This section examines the Hebrew, Aramaic, or Greek text to uncover deeper meanings and nuances.'
    },
    {
      id: 'special-insights',
      title: 'Special Insights',
      icon: 'lightbulb',
      content: 'Discover unique perspectives, hidden meanings, and special revelations within the text. This section highlights extraordinary insights that may not be immediately apparent.'
    },
    {
      id: 'daily-life-application',
      title: 'Daily Life Application',
      icon: 'home',
      content: 'Learn how to apply the biblical principles to everyday life situations. This section provides practical guidance for living out the teachings in modern contexts.'
    },
    {
      id: 'cross-reference',
      title: 'Cross Reference',
      icon: 'link',
      content: 'Explore related passages throughout Scripture that connect to this text. Cross-references help build a comprehensive understanding of biblical themes and teachings.'
    },
    {
      id: 'commentary-insights',
      title: 'Commentary Insights',
      icon: 'users',
      content: 'Gain wisdom from biblical scholars, theologians, and commentators throughout history. This section presents diverse perspectives and interpretations from respected sources.'
    },
    {
      id: 'key-takeaways',
      title: 'Key Takeaways',
      icon: 'star',
      content: 'Summarize the most important lessons and principles from this passage. These key takeaways serve as memorable points for reflection and application.'
    },
    {
      id: 'reflection-prompts',
      title: 'Reflection Prompts',
      icon: 'question',
      content: 'Engage with thoughtful questions designed to deepen your understanding and personal connection to the text. Use these prompts for personal meditation and group discussion.'
    }
  ];

  return (
    <div className="min-h-screen text-primary  overflow-hidden">
      <div className="max-w-4xl mx-auto overflow-hidden">
      {/* Title Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-2">
          <div className="flex-1 min-w-0">
            <h1 className="font-merriweather text-2xl sm:text-2xl text-primary break-words">
              Shepherd's Psalm
            </h1>
            <p className="font-merriweather text-sm text-gray-600 mt-1 break-words">
              (Psalm 23 KJV)
            </p>
          </div>
          {showDeepStudyButton && onDeepStudyToggle && (
            <button
              onClick={onDeepStudyToggle}
              className={`flex items-center justify-center gap-2 px-4 py-2 w-full lg:w-auto rounded-lg font-medium transition-colors text-sm ${
                isDeepStudyActive 
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

      {/* Main Content Card */}
      <div className="bg-white/40 dark:bg-transparent backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
        {/* Tab Content */}
        <div className="p-4 sm:p-6 w-full overflow-hidden">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`${
                activeTab === tab.id ? 'block' : 'hidden'
              }`}
            >
              {/* Main Content */}
              <div className="mb-4 sm:mb-6">
                <p className="font-merriweather text-base sm:text-lg leading-relaxed text-primary break-words">
                  {tab.id === 'explanation' 
                    ? "This verse uses the imagery of a shepherd to emphasize God's care and provision. It reassures us that with God, we lack nothing that we truly need."
                    : tab.content
                  }
                </p>
              </div>

              {/* Nested Card */}
              <div className="bg-white/60 dark:bg-gray-200 rounded-lg p-2 sm:p-3 lg:p-4 overflow-hidden w-full">
                <div className="flex items-center gap-3 mb-2">
                  <KeenIcon icon="calendar" className="text-gray-500 text-sm dark:text-gray-700" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-700">
                    August 3, 2025 - Psalm 23:1
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-merriweather dark:text-gray-800">
                  I feel like I'm learning to rest more instead of stressing...
                </p>
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
