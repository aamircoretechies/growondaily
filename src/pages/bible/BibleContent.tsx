import { Link } from 'react-router-dom';
import { KeenIcon } from '@/components';

interface BibleContentProps {
  showDeepStudyButton?: boolean;
  onDeepStudyToggle?: () => void;
  isDeepStudyActive?: boolean;
}

const BibleContent = ({ showDeepStudyButton, onDeepStudyToggle, isDeepStudyActive }: BibleContentProps) => {
  const psalm23Verses = [
    {
      number: 1,
      text: "The LORD is my shepherd; I shall not want.",
      path: "/bible?bible=psalm&chapter=23&verse=1"
    },
    {
      number: 2,
      text: "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
      path: "/bible?bible=psalm&chapter=23&verse=2"
    },
    {
      number: 3,
      text: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
      path: "/bible?bible=psalm&chapter=23&verse=3"
    },
    {
      number: 4,
      text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
      path: "/bible?bible=psalm&chapter=23&verse=4"
    },
    {
      number: 5,
      text: "You prepare a table before me, in the presence of my enemies. You anoint my head with oil; my cup overflows.",
      path: "/bible?bible=psalm&chapter=23&verse=5"
    },
    {
      number: 6,
      text: "Surely goodness and love will follow me all the days of my life, and I will dwell in the house of the LORD forever.",
      path: "/bible?bible=psalm&chapter=23&verse=6"
    }
  ];

  return (
    <div className="min-h-screen text-primary p-0 ">
      <div className="max-w-4xl mx-auto">
        {/* Title Section */}
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
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm w-full sm:w-auto ${
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

        {/* Verses Section */}
        <div className="space-y-6">
          {psalm23Verses.map((verse) => (
            <div key={verse.number} className="flex items-start space-x-4">
              {/* Verse Number */}
              <div className="flex-shrink-0">
                <Link
                  to={verse.path}
                  className="inline-flex font-merriweather items-center justify-center w-6 h-6 rounded-full text-lg transition-colors duration-200 hover:text-sand"
                >
                  {verse.number}
                </Link>
              </div>
              
              {/* Verse Text */}
              <div className="flex-1">
                <Link
                  to={verse.path}
                  className="block font-merriweather text-lg leading-relaxed hover:text-sand transition-colors duration-200"
                >
                  {verse.text}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { BibleContent };
