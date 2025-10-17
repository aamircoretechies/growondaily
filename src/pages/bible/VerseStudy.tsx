import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { KeenIcon } from '@/components';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/modal';

interface TabItem {
  id: string;
  title: string;
  icon: string;
  content: string;
}

const VerseStudy = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('explanation');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportIssue, setReportIssue] = useState('');
  const [reportCategory, setReportCategory] = useState('');

  // Extract verse information from URL params
  const book = searchParams.get('bible') || 'psalm';
  const chapter = searchParams.get('chapter') || '23';
  const verse = searchParams.get('verse') || '1';

  // Create unique key for this verse
  const verseKey = `${book}-${chapter}-${verse}`;
  
  // State for read/unread status
  const [isRead, setIsRead] = useState(() => {
    const saved = localStorage.getItem(`verse-read-${verseKey}`);
    return saved === 'true';
  });

  // Toggle read status
  const toggleReadStatus = () => {
    const newStatus = !isRead;
    setIsRead(newStatus);
    localStorage.setItem(`verse-read-${verseKey}`, newStatus.toString());
  };

  // Handle report submission
  const handleReportSubmit = () => {
    if (!reportIssue.trim() || !reportCategory) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Here you would typically send the report to your backend
    console.log('Report submitted:', {
      verse: `${book} ${chapter}:${verse}`,
      issue: reportIssue,
      category: reportCategory,
      timestamp: new Date().toISOString()
    });
    
    // Reset form and close modal
    setReportIssue('');
    setReportCategory('');
    setShowReportModal(false);
    alert('Report submitted successfully!');
  };

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

  // Get verse text based on the current verse
  const getVerseText = () => {
    const psalm23Verses = [
      "The LORD is my shepherd; I shall not want.",
      "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
      "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
      "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
      "You prepare a table before me, in the presence of my enemies. You anoint my head with oil; my cup overflows.",
      "Surely goodness and love will follow me all the days of my life, and I will dwell in the house of the LORD forever."
    ];
    
    const verseIndex = parseInt(verse) - 1;
    return psalm23Verses[verseIndex] || "Verse text not available";
  };

  // Get explanation content based on the current verse
  const getExplanationContent = () => {
    const explanations = [
      "This verse establishes the foundational truth that God is our shepherd and provider. It reassures us that with God as our guide, we lack nothing that we truly need.",
      "This verse describes God's provision of rest and refreshment. The imagery of green pastures and still waters represents God's care in providing both physical and spiritual nourishment.",
      "This verse speaks of God's restoration and guidance. He renews our inner being and leads us on the right path, all for the glory of His name.",
      "This verse addresses facing difficult times with courage. Even in the darkest valleys, God's presence provides comfort and protection, eliminating fear.",
      "This verse describes God's provision and blessing even in the presence of opposition. He prepares abundance for us and anoints us with His favor.",
      "This verse speaks of God's enduring goodness and the promise of eternal dwelling with Him. His love and mercy follow us throughout our lives."
    ];
    
    const verseIndex = parseInt(verse) - 1;
    return explanations[verseIndex] || "Explanation not available for this verse.";
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Title Section */}
      <div className="mb-8">
        {/* Back Arrow */}
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                isRead 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <KeenIcon icon={isRead ? "check" : "book"} className="w-4 h-4" />
              {isRead ? 'Mark as Unread' : 'Mark as Read'}
            </button>
            
            {/* Options Menu */}
            <div className="relative">
              <button
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                onClick={() => setShowReportModal(true)}
                title="Options"
              >
                <KeenIcon icon="dots-vertical" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <p className="font-merriweather text-xl text-gray-600 dark:text-gray-400">
          ({book.charAt(0).toUpperCase() + book.slice(1)} {chapter}:{verse} KJV)
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white/40 dark:bg-gray-200 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-400">
        {/* Pills Tabs Header */}
        <div className="p-6 pb-0">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeTab === tab.id
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

        {/* Tab Content */}
        <div className="p-6">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`${
                activeTab === tab.id ? 'block' : 'hidden'
              }`}
            >
              {/* Main Content */}
              <div className="mb-6">
                <p className="font-merriweather text-lg leading-relaxed text-primary">
                  {tab.id === 'explanation' 
                    ? getExplanationContent()
                    : tab.content
                  }
                </p>
              </div>

              {/* Nested Card */}
              <div className="bg-white/60 dark:bg-gray-300 rounded-lg p-4 border border-gray-200 dark:border-gray-400">
                <div className="flex items-center gap-3 mb-2">
                  <KeenIcon icon="calendar" className="text-gray-500 dark:text-gray-700 text-sm" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-800">
                    August 3, 2025 - {book.charAt(0).toUpperCase() + book.slice(1)} {chapter}:{verse}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-800 font-merriweather">
                  I feel like I'm learning to rest more instead of stressing...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/40 dark:bg-gray-200 backdrop-blur-sm rounded-xl shadow-xl max-w-md w-full mx-4 border border-gray-200 dark:border-gray-400">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-400">
              <h3 className="text-lg font-semibold text-primary">
                REPORT
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <KeenIcon icon="cross" className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Verse Reference Card */}
              <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-3 flex items-center gap-3 border border-primary/20">
                <KeenIcon icon="document" className="text-primary w-5 h-5" />
                <span className="text-primary font-medium">
                  {book.charAt(0).toUpperCase() + book.slice(1)} {chapter}:{verse}
                </span>
              </div>

              {/* Pre-filled Reflection */}
              <div className="bg-gray-50 dark:bg-gray-300 rounded-lg p-3 border border-gray-200 dark:border-gray-400">
                <p className="text-sm text-primary">
                  I feel like I'm learning to rest more instead of stressing...
                </p>
              </div>

              {/* Issue Description */}
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

              {/* Category Buttons */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Category
                </label>
                <div className="flex gap-2">
                  {['Content', 'Audio', 'Other'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setReportCategory(category)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        reportCategory === category
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 dark:bg-gray-300 text-primary hover:bg-primary/10 dark:hover:bg-primary/20'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
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
