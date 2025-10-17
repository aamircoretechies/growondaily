import { useState } from 'react';
import { KeenIcon } from '@/components';

interface LinkVerseProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Verse {
  number: number;
  text: string;
  selected: boolean;
}

const LinkVerse = ({ isOpen, onClose }: LinkVerseProps) => {
  const [selectedBook, setSelectedBook] = useState('Psalm');
  const [selectedChapter, setSelectedChapter] = useState('23');
  const [selectedVerse, setSelectedVerse] = useState('verse');
  const [showBookDropdown, setShowBookDropdown] = useState(false);
  const [showChapterDropdown, setShowChapterDropdown] = useState(false);
  const [showVerseDropdown, setShowVerseDropdown] = useState(false);
  const [bookSearchTerm, setBookSearchTerm] = useState('');
  const [chapterSearchTerm, setChapterSearchTerm] = useState('');
  const [verseSearchTerm, setVerseSearchTerm] = useState('');

  // Sample data
  const books = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'];

  const chapters = Array.from({ length: 150 }, (_, i) => (i + 1).toString());
  const verses = Array.from({ length: 176 }, (_, i) => (i + 1).toString());

  const [psalm23Verses, setPsalm23Verses] = useState<Verse[]>([
    { number: 1, text: "The LORD is my shepherd; I shall not want.", selected: false },
    { number: 2, text: "He maketh me to lie down in green pastures: he leadeth me beside the still waters.", selected: false },
    { number: 3, text: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.", selected: true },
    { number: 4, text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.", selected: false },
    { number: 5, text: "You prepare a table before me, in the presence of my enemies. You anoint my head with oil; my cup overflows.", selected: false },
    { number: 6, text: "Surely goodness and love will follow me all the days of my life, and I will dwell in the house of the LORD forever.", selected: false }
  ]);

  const filteredBooks = books.filter(book => 
    book.toLowerCase().includes(bookSearchTerm.toLowerCase())
  );

  const filteredChapters = chapters.filter(chapter => 
    chapter.includes(chapterSearchTerm)
  );

  const filteredVerses = verses.filter(verse => 
    verse.includes(verseSearchTerm)
  );

  const handleVerseToggle = (verseNumber: number) => {
    // For single selection, unselect all others and select this one
    setPsalm23Verses(prevVerses => 
      prevVerses.map(verse => ({
        ...verse,
        selected: verse.number === verseNumber
      }))
    );
  };

  const handleLinkSelected = () => {
    const selectedVerse = psalm23Verses.find(v => v.selected);
    console.log('Linking verse:', selectedVerse);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white/90 dark:bg-[--tw-page-bg-dark] backdrop-blur-sm rounded-xl shadow-lg max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-primary">LINK OTHER VERSE</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <KeenIcon icon="cross" className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          {/* Navigation Controls */}
          <div className="flex gap-2">
            {/* Book Dropdown */}
            <div className="relative flex-1">
              <button
                onClick={() => setShowBookDropdown(!showBookDropdown)}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg flex items-center justify-between"
              >
                <span>{selectedBook}</span>
                <KeenIcon icon="down" className="text-sm" />
              </button>
              
              {showBookDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-200 border border-gray-200 dark:border-gray-400 rounded-lg shadow-lg z-10 max-h-48 overflow-hidden">
                  <div className="p-2 border-b border-gray-200 dark:border-gray-400">
                    <input
                      type="text"
                      placeholder="Search books..."
                      value={bookSearchTerm}
                      onChange={(e) => setBookSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-300 text-gray-700 dark:text-gray-800 placeholder-gray-500 dark:placeholder-gray-600"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    {filteredBooks.map((book) => (
                      <button
                        key={book}
                        onClick={() => {
                          setSelectedBook(book);
                          setShowBookDropdown(false);
                          setBookSearchTerm('');
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-400 text-gray-700 dark:text-gray-800"
                      >
                        {book}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Chapter Dropdown */}
            <div className="relative flex-1">
              <button
                onClick={() => setShowChapterDropdown(!showChapterDropdown)}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg flex items-center justify-between"
              >
                <span>{selectedChapter}</span>
                <KeenIcon icon="down" className="text-sm" />
              </button>
              
              {showChapterDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-200 border border-gray-200 dark:border-gray-400 rounded-lg shadow-lg z-10 max-h-48 overflow-hidden">
                  <div className="p-2 border-b border-gray-200 dark:border-gray-400">
                    <input
                      type="text"
                      placeholder="Search chapters..."
                      value={chapterSearchTerm}
                      onChange={(e) => setChapterSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-300 text-gray-700 dark:text-gray-800 placeholder-gray-500 dark:placeholder-gray-600"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    {filteredChapters.map((chapter) => (
                      <button
                        key={chapter}
                        onClick={() => {
                          setSelectedChapter(chapter);
                          setShowChapterDropdown(false);
                          setChapterSearchTerm('');
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-400 text-gray-700 dark:text-gray-800"
                      >
                        {chapter}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Verse Dropdown */}
            <div className="relative flex-1">
              <button
                onClick={() => setShowVerseDropdown(!showVerseDropdown)}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg flex items-center justify-between"
              >
                <span>{selectedVerse}</span>
                <KeenIcon icon="down" className="text-sm" />
              </button>
              
              {showVerseDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-200 border border-gray-200 dark:border-gray-400 rounded-lg shadow-lg z-10 max-h-48 overflow-hidden">
                  <div className="p-2 border-b border-gray-200 dark:border-gray-400">
                    <input
                      type="text"
                      placeholder="Search verses..."
                      value={verseSearchTerm}
                      onChange={(e) => setVerseSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-300 text-gray-700 dark:text-gray-800 placeholder-gray-500 dark:placeholder-gray-600"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    {filteredVerses.map((verse) => (
                      <button
                        key={verse}
                        onClick={() => {
                          setSelectedVerse(verse);
                          setShowVerseDropdown(false);
                          setVerseSearchTerm('');
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-400 text-gray-700 dark:text-gray-800"
                      >
                        {verse}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Verse List */}
          <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-400 rounded-lg bg-white dark:bg-gray-200">
            {psalm23Verses.map((verse) => (
              <div
                key={verse.number}
                className={`flex items-start gap-3 p-4 border-b border-gray-100 dark:border-gray-300 last:border-b-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-300 ${
                  verse.selected ? 'bg-primary/5 dark:bg-primary/10' : ''
                }`}
                onClick={() => handleVerseToggle(verse.number)}
              >
                <div className="flex-shrink-0 w-6 text-sm font-medium text-gray-600 dark:text-gray-700">
                  {verse.number}
                </div>
                <div className="flex-1">
                  <p className={`text-sm leading-relaxed ${
                    verse.selected ? 'font-semibold text-primary' : 'text-gray-700 dark:text-gray-800'
                  }`}>
                    {verse.text}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                    verse.selected 
                      ? 'bg-primary border-primary' 
                      : 'border-gray-300 dark:border-gray-500'
                  }`}>
                    {verse.selected && (
                      <KeenIcon icon="check" className="text-white text-xs" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              onClick={handleLinkSelected}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
            >
              Link The Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { LinkVerse };
