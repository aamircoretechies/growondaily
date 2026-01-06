import { useState } from "react";
import { useReflection } from "@/providers/ReflectionProvider";
import { toast } from "sonner";
import { FormattedMessage, useIntl } from 'react-intl';

interface Props {
  note: any;
  onClose: () => void;
}

export default function EditNotePopup({ note, onClose }: Props) {
  const { formatMessage } = useIntl();
  const [content, setContent] = useState(note.content || "");
  // const [selectedTags, setSelectedTags] = useState(
  //   note.emotion_tags || note.tags || note.original_tags || []
  // );

  //     const initialTags =
  //   note.tags ||
  //   note.emotion_tags ||
  //   note.updated_tags || 
  //   note.original_tags ||
  //   [];

  // const [selectedTags, setSelectedTags] = useState([...initialTags]);

  const TAG_MAPPING: Record<string, string> = {
    'faith': 'Faith',
    'geloof': 'Faith',
    'trust': 'Trust',
    'vertrouwen': 'Trust',
    'peace': 'Peace',
    'vrede': 'Peace',
    'kingdom': 'Kingdom',
    'koninkrijk': 'Kingdom'
  };

  const normalizeTag = (tag: string) => {
    const lower = tag.trim().toLowerCase();
    return TAG_MAPPING[lower] || tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
  };

  const initialTags =
    note.tags ||
    note.emotion_tags ||
    note.updated_tags ||
    note.original_tags ||
    [];

  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialTags.map((t: string) => normalizeTag(t))
  );



  const { updateNote } = useReflection();

  // const toggleTag = (tag: string) => {
  //   if (selectedTags.includes(tag)) {
  //     setSelectedTags(selectedTags.filter((t: string) => t !== tag));
  //   } else {
  //     setSelectedTags([...selectedTags, tag]);
  //   }
  // };

  const toggleTag = (tag: string) => {
    // tag passed here is already "Faith", "Trust" etc from the loop
    const normalized = normalizeTag(tag); // acts as identity for "Faith" -> "Faith"

    if (selectedTags.includes(normalized)) {
      setSelectedTags(selectedTags.filter((t: string) => t !== normalized));
    } else {
      setSelectedTags([...selectedTags, normalized]);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error(formatMessage({ id: 'TOAST.WRITE_SOMETHING' }));
      return;
    }

    // items in selectedTags are already Title Case (Faith, Trust..)
    const tagsForBackend = selectedTags;

    const success = await updateNote(
      note.note_id,
      content,
      tagsForBackend
    );

    if (success) {
      toast.success(formatMessage({ id: 'TOAST.NOTE_UPDATED' }));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 dark:bg-[--tw-page-bg-dark] backdrop-blur-sm rounded-xl shadow-lg max-w-md w-full mx-4 p-6">

        {/* Header */}
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-primary">
            Edit Note
          </h2>

          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Verse Reference */}
        <p className="px-1 pb-3 text-sm text-gray-600 dark:text-gray-300 italic">
          {note.book} {note.chapter}{note.verse ? ":" + note.verse : ""}
        </p>

        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note..."
          className="w-full h-32 p-4 bg-white/60 dark:bg-gray-200 rounded-lg border border-gray-200 dark:border-gray-400 resize-none 
                   focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
        />

        {/* Tags */}
        <div className="mt-5">
          <p className="text-primary font-medium mb-3">Emotion Tags</p>

          <div className="flex flex-wrap gap-2">
            {["Faith", "Trust", "Peace", "Kingdom"].map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedTags.includes(tag)
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-300 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {formatMessage({ id: `EMOTION.${tag.toUpperCase()}` })}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="text-primary hover:underline transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-sand hover:bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-primary/90 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}