import { Container } from '@/components/container';
import { KeenIcon } from '@/components';
import { LucideSearch, LucideCalendar, LucideTrash2, LucideArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookmarksPage = () => {
  const navigate = useNavigate();

  const handleDeleteBookmark = (id: string) => {
    console.log('Delete bookmark:', id);
  };

  // Mock data for bookmark entries
  const bookmarkEntries = [
    {
      id: '1',
      verse: 'Romans 8:28',
      content: "I've been reminded that even hard moments are being used for something good...",
      tags: ['faith', 'growth']
    },
    {
      id: '2',
      verse: 'Psalm 23:1',
      content: "I feel like I'm learning to rest more instead of stressing...",
      tags: ['peace', 'trust']
    },
    {
      id: '3',
      verse: 'John 3:16',
      content: "God's love is so overwhelming that He gave His only Son for us...",
      tags: ['love', 'sacrifice']
    },
    {
      id: '4',
      verse: 'Philippians 4:13',
      content: "I can do all things through Christ who strengthens me...",
      tags: ['strength', 'perseverance']
    },
    {
      id: '5',
      verse: 'Matthew 6:33',
      content: "Seek first the kingdom of God and His righteousness...",
      tags: ['priority', 'kingdom']
    },
    {
      id: '6',
      verse: 'Proverbs 3:5-6',
      content: "Trust in the Lord with all your heart and lean not on your own understanding...",
      tags: ['trust', 'wisdom']
    }
  ];

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
            Bookmarks
          </h1>
          <p className="text-gray-600 text-lg">
            Your saved verses and reflections for quick access
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
                  placeholder="Search bookmarks by verse or content..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-0 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sand/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <h2 className="font-merriweather text-lg text-gray-600">
            Showing {bookmarkEntries.length} Bookmarks
          </h2>
        </div>

        {/* Bookmarks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkEntries.map((entry) => (
            <div key={entry.id} className="bg-white/80 dark:bg-transparent rounded-xl p-6 border border-transparent dark:border-gray-400 hover:shadow-lg transition-shadow">
              {/* Verse Header */}
              <div className="flex items-center gap-2 mb-4">
                <LucideCalendar className="text-amber-600 w-4 h-4" />
                <span className="text-gray-600 text-sm font-medium">
                  {entry.verse}
                </span>
              </div>
              
              {/* Entry Content */}
              <p className="text-primary text-sm leading-relaxed mb-4 line-clamp-3">
                {entry.content}
              </p>
              
               {/* Tags */}
               <div className="flex flex-wrap gap-2 mb-4">
                 {entry.tags.map((tag, index) => (
                   <span
                     key={index}
                     className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full font-medium"
                   >
                     {tag}
                   </span>
                 ))}
               </div>
              
              {/* Action Buttons - Only delete, no edit */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleDeleteBookmark(entry.id)}
                  className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-300 transition-colors"
                >
                  <LucideTrash2 className="text-red-500 w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-sand text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium">
            Load More Bookmarks
          </button>
        </div>
      </div>
    </Container>
  );
};

export { BookmarksPage };
