import { useState, useEffect } from 'react';
import { KeenIcon, LinkVerse } from '@/components';
import { useBible } from '@/providers/BibleProvider';
import { toast } from 'sonner';
import { useIntl } from 'react-intl';

interface MakeNoteProps {
  isOpen: boolean;
  onClose: () => void;
}

const MakeNote = ({ isOpen, onClose }: MakeNoteProps) => {
  const { formatMessage } = useIntl();
  const [noteText, setNoteText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showLinkVerse, setShowLinkVerse] = useState(false);

  const { selectedBookName, selectedChapter, selectedVerse } = useBible();
  const { saveNote, selectedBookId } = useBible();

  const tags = ['Faith', 'Trust', 'Peace', 'Kingdom'];

  useEffect(() => {
    if (isOpen) {
      setNoteText('');
      setSelectedTags([]);
    }
  }, [isOpen]);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSave = async () => {
    if (!noteText.trim()) {
      toast.error(formatMessage({ id: 'TOAST.WRITE_SOMETHING' }));
      return;
    }

    if (noteText.length > 250) {
      toast.error(formatMessage({ id: 'TOAST.CHAR_LIMIT' }));
      return;
    }

    if (!selectedBookId) {
      alert(formatMessage({ id: 'MAKE_NOTE.ALERT.SELECT_BOOK' }));
      return;
    }

    const chapterToSave = selectedChapter || 1;
    const verseToSave = Number(selectedVerse?.verse || 0);

    try {
      await saveNote(selectedBookId, chapterToSave, verseToSave, noteText, selectedTags);

      toast.success(formatMessage({ id: 'TOAST.NOTE_CREATED' }));
      onClose();
    } catch (err) {
      console.error("Failed to save note:", err);
      toast.error(formatMessage({ id: 'MAKE_NOTE.ERROR.SAVE_FAILED' }));
    }
  };


  // const handleLinkVerse = () => {
  //   setShowLinkVerse(true);
  //   console.log(" User's Note:", noteText);
  // };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white/90 dark:bg-[--tw-page-bg-dark] backdrop-blur-sm rounded-xl shadow-lg max-w-md w-full mx-4">

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-primary uppercase">
            {formatMessage({ id: 'MAKE_NOTE.TITLE' })}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <KeenIcon icon="cross" className="text-xl" />
          </button>
        </div>

        {/* ALWAYS SHOW THIS */}
        <div className="px-6 pb-2 text-sm text-gray-600 dark:text-gray-300">
          {selectedBookName && selectedVerse ? (
            <p>
              {selectedBookName} {selectedChapter}:{selectedVerse?.verse} —{' '}
              <span className="italic">
                "{selectedVerse?.text?.slice(0, 60)}..."
              </span>
            </p>
          ) : (
            <p className="italic text-gray-500">
              {formatMessage({ id: 'MAKE_NOTE.PLACEHOLDER' })}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">

          {/* Text Input */}
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder={formatMessage({ id: 'MAKE_NOTE.PLACEHOLDER' })}
            className="w-full h-32 p-4 bg-white/60 dark:bg-gray-200 rounded-lg border border-gray-200 dark:border-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary text-gray-700 font-merriweather"
          />

          {/* Tag Buttons */}
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedTags.includes(tag)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {formatMessage({ id: `EMOTION.${tag.toUpperCase()}` })}
              </button>
            ))}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition"
          >
            {formatMessage({ id: 'MAKE_NOTE.SAVE_NOTE' })}
          </button>

          {/* hide link verse for now */}
          {/* <button
            onClick={handleLinkVerse}
            className="w-full bg-white/60 dark:bg-gray-300 text-gray-700 dark:text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-white/80 dark:hover:bg-gray-400 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <KeenIcon icon="link" className="text-base" />
            Link Another Verse
          </button> */}

        </div>
      </div>


      {/* hide link verse for now */}
      {/* <LinkVerse
        isOpen={showLinkVerse}
        onClose={() => setShowLinkVerse(false)}
      /> */}

    </div>
  );
};

export { MakeNote };


