import { Container } from '@/components/container';
import { KeenIcon } from '@/components';
import { LucideSearch, LucideArrowUpDown, LucideCalendar, LucidePencil, LucideTrash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReflectionsPage = () => {
  const navigate = useNavigate();
  
  // Get current date in the format "Thu, Aug 07, 2025"
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const handleReflectAndJournal = () => {
    // Handle the button click - could open a journal modal or navigate to journal page
    console.log('Reflect & Journal clicked');
  };

  const handleEditReflection = (id: string) => {
    console.log('Edit reflection:', id);
  };

  const handleDeleteReflection = (id: string) => {
    console.log('Delete reflection:', id);
  };

  // Mock data for journal entries
  const journalEntries = [
    {
      id: '1',
      date: 'August 6, 2025',
      verse: 'Romans 8:28',
      content: "I've been reminded that even hard moments are being used for something good...",
      tags: ['faith', 'growth']
    },
    {
      id: '2',
      date: 'August 3, 2025',
      verse: 'Psalm 23:1',
      content: "I feel like I'm learning to rest more instead of stressing...",
      tags: ['peace', 'trust']
    }
  ];

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
              {journalEntries.map((entry) => (
                <div key={entry.id} className="bg-white/80 dark:bg-transparent rounded-xl p-4 border border-transparent dark:border-gray-400">
                  {/* Entry Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <LucideCalendar className="text-amber-600 w-4 h-4" />
                    <span className="text-gray-600 text-sm">
                      {entry.date} – {entry.verse}
                    </span>
                  </div>
                  
                  {/* Entry Content */}
                  <p className="text-primary text-sm leading-relaxed mb-4">
                    {entry.content}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEditReflection(entry.id)}
                      className="w-8 h-8 bg-sand rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                    >
                      <LucidePencil className="text-white w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteReflection(entry.id)}
                      className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-300 transition-colors"
                    >
                      <LucideTrash2 className="text-red-500 w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
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
            <div className="bg-white/40 dark:bg-gray-200 backdrop-blur-sm rounded-2xl  p-8">
              {/* Bible Verse */}
              <div className="mb-6">
                <h2 className="font-merriweather text-2xl text-primary leading-relaxed mb-2">
                  "The Lord is my shepherd; I shall not want."
                </h2>
                <p className="text-gray-600 text-sm">
                  (Psalm 23:1 KJV)
                </p>
              </div>

              {/* Explanation */}
              <div className="mb-8">
                <p className="text-gray-700 text-base leading-relaxed">
                  This verse reminds us that God provides, leads, and watches over us—just like a shepherd cares for his sheep.
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
              {/* Search Bar */}
              <div className="relative">
                <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search bookmarks.."
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-0 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sand/50"
                />
              </div>
            </div>

            <h4 className="font-merriweather text-sm text-gray-600 mb-2">
              Showing 2 Items
            </h4>

            {/* Bookmarks List */}
            <div className="space-y-4">
              {journalEntries.map((entry) => (
                <div key={`bookmark-${entry.id}`} className="bg-white/80 dark:bg-transparent rounded-xl p-4 border border-transparent dark:border-gray-400">
                  {/* Entry Header - No timestamp */}
                  <div className="flex items-center gap-2 mb-3">
                    <LucideCalendar className="text-amber-600 w-4 h-4" />
                    <span className="text-gray-600 text-sm">
                      {entry.verse}
                    </span>
                  </div>
                  
                  {/* Entry Content */}
                  <p className="text-primary text-sm leading-relaxed mb-4">
                    {entry.content}
                  </p>
                  
                  {/* Action Buttons - Only delete, no edit */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleDeleteReflection(entry.id)}
                      className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-300 transition-colors"
                    >
                      <LucideTrash2 className="text-red-500 w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export { ReflectionsPage };

