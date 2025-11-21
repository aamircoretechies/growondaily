import { Link } from 'react-router-dom';
import { KeenIcon } from '@/components';
import { useLocation } from 'react-router-dom';
import { useBible } from '@/providers/BibleProvider';
import { useEffect, useState } from 'react';

interface BibleContentProps {
  showDeepStudyButton?: boolean;
  onDeepStudyToggle?: () => void;
  isDeepStudyActive?: boolean;
}

const BibleContent = ({ showDeepStudyButton, onDeepStudyToggle, isDeepStudyActive }: BibleContentProps) => {
  const location = useLocation();
  const {
    fetchVerses,
    verses,
    books,
    selectedBookId,
    selectedBookName,
    selectedChapter,
    selectedVerse,
    fetchSingleVerse,
  } = useBible();

  const [totalVerses, setTotalVerses] = useState<number>(0);

  const query = new URLSearchParams(location.search);
  const verseNum = query.get("verse") || "all";

  useEffect(() => {
    if (selectedBookId && selectedChapter) {
      fetchVerses(selectedBookId, selectedChapter, 'KJV');
    }
  }, [selectedBookId, selectedChapter]);

  useEffect(() => {
    if (Array.isArray(verses)) {
      setTotalVerses(verses.length);
    }
    // Fetch single verse if verse parameter is in URL
    if (verseNum !== "all" && selectedBookId && selectedChapter) {
      const num = Number(verseNum);
      if (!Number.isNaN(num)) {
        fetchSingleVerse(selectedBookId, selectedChapter, num, 'KJV');
      }
    }
  }, [verses, verseNum, selectedBookId, selectedChapter, fetchSingleVerse]);

  const version = selectedVerse?.version || "KJV";

  return (
    <div className="min-h-screen text-primary p-0 ">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <div className="flex-1">
              <h1 className="font-merriweather text-2xl">
                {/* Shepherd's Psalm */}
                
                {selectedBookName
                  ? `${selectedBookName} ${selectedChapter || ''}`
                  : 'Loading...'}
                
              </h1>
              <p className="font-merriweather text-sm text-gray-600 dark:text-gray-400 mt-1">
                (
                {selectedBookName
                  ? `${selectedBookName} ${selectedChapter || ''} ${version}`
                  : 'Loading...'}
                )
              </p>
            </div>

            {showDeepStudyButton && onDeepStudyToggle && (
              <button
                onClick={onDeepStudyToggle}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm w-full sm:w-auto ${isDeepStudyActive
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

        <div className="space-y-6">
          {selectedVerse ? (
            <div className="flex flex-col">
              <h1 className="font-merriweather text-2xl mb-2">
                {selectedVerse.book_name} {selectedVerse.chapter}:{selectedVerse.verse}
              </h1>
              <p className="font-merriweather text-lg leading-relaxed">
                {selectedVerse.text}
              </p>
              <p className="text-gray-500 text-sm">({selectedVerse.version})</p>
            </div>
          ) : (
            verses.map((v) => (
              <div
                key={v.verse}
                className="flex items-start gap-3 py-2"
              >
                <span className="font-merriweather text-lg min-w-[24px]">
                  {v.verse}
                </span>

                <div className="flex-1">
                  <Link
                    to={`/bible?bible=${v.book_name.toLowerCase()}&chapter=${v.chapter}&verse=${v.verse}`}
                    className="block font-merriweather text-lg leading-relaxed  hover:text-sand transition-colors duration-200"
                  >
                    {v.text}
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export { BibleContent };
