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

//


const BibleContent = ({ showDeepStudyButton, onDeepStudyToggle, isDeepStudyActive }: BibleContentProps) => {
  // const psalm23Verses = [
  //   {
  //     number: 1,
  //     text: "The LORD is my shepherd; I shall not want.",
  //     path: "/bible?bible=psalm&chapter=23&verse=1"
  //   },
  //   {
  //     number: 2,
  //     text: "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
  //     path: "/bible?bible=psalm&chapter=23&verse=2"
  //   },
  //   {
  //     number: 3,
  //     text: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
  //     path: "/bible?bible=psalm&chapter=23&verse=3"
  //   },
  //   {
  //     number: 4,
  //     text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
  //     path: "/bible?bible=psalm&chapter=23&verse=4"
  //   },
  //   {
  //     number: 5,
  //     text: "You prepare a table before me, in the presence of my enemies. You anoint my head with oil; my cup overflows.",
  //     path: "/bible?bible=psalm&chapter=23&verse=5"
  //   },
  //   {
  //     number: 6,
  //     text: "Surely goodness and love will follow me all the days of my life, and I will dwell in the house of the LORD forever.",
  //     path: "/bible?bible=psalm&chapter=23&verse=6"
  //   }
  // ];

  const location = useLocation();
  const { fetchVerses, verses, books } = useBible();

  const [selectedVerse, setSelectedVerse] = useState<any>(null);

  const query = new URLSearchParams(location.search);
  const book = query.get("bible") || "genesis";
  const chapter = Number(query.get("chapter")) || 1;
  const verseNum = query.get("verse") || "all";


  useEffect(() => {
    const bookInfo = books.find(
      (b: any) => b.name.toLowerCase() === book.toLowerCase()
    );
    console.log(" Found bookInfo:", bookInfo);
    if (bookInfo) {
      console.log("Fetching verses for", bookInfo.book_id, "chapter:", chapter);
      fetchVerses(bookInfo.book_id, chapter, "KJV");
    } else {
      console.warn("No matching book found for:", book);
    }
  }, [book, chapter, books]);


  useEffect(() => {
    if (verses && verses.length > 0) {
      if (verseNum === "all") {
        setSelectedVerse(null);
      } else {
        const v = verses.find((v: any) => v.verse == verseNum);
        console.log("Selected verse:", v);
        setSelectedVerse(v);
      }
    }
  }, [verses, verseNum]);


  return (
    <div className="min-h-screen text-primary p-0 ">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <div className="flex-1">
              <h1 className="font-merriweather text-2xl">
                Shepherd's Psalm
              </h1>
              <p className="font-merriweather text-sm text-gray-600 dark:text-gray-400 mt-1">
                (Psalm 23 KJV)
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

        {/* Verses Section */}
        {/* <div className="space-y-6">
          {selectedVerse ? (
            <div className="flex flex-col">
              <h1 className="font-merriweather text-2xl mb-2">
                {selectedVerse.book_name} {selectedVerse.chapter}:{selectedVerse.verse}
              </h1>
              <p className="font-merriweather text-lg leading-relaxed">
                {selectedVerse.text}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">Loading verse...</p>
          )}
        </div> */}

        <div className="space-y-6">
          {selectedVerse ? (
            <div className="flex flex-col">
              <h1 className="font-merriweather text-2xl mb-2">
                {selectedVerse.book_name} {selectedVerse.chapter}:{selectedVerse.verse}
              </h1>
              <p className="font-merriweather text-lg leading-relaxed">
                {selectedVerse.text}
              </p>
            </div>
          ) : (
            verses.map((v) => (
              // <div key={v.verse} className="border-b pb-2 mb-2">
              //   <h3 className="font-semibold">{v.book_name} {v.chapter}:{v.verse}</h3>
              //   <p>{`${v.verse}. ${v.text}`}</p>
              // </div>

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






