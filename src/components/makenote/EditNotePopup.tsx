import { useState } from "react";
import { useReflection } from "@/providers/ReflectionProvider";

interface Props {
  note: any;
  onClose: () => void;
}

export default function EditNotePopup({ note, onClose }: Props) {
  const [content, setContent] = useState(note.content || "");
  const [selectedTags, setSelectedTags] = useState(
    note.emotion_tags || note.tags || []
  );

  const { updateNote } = useReflection();

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t: string) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = async () => {
    const payload = {
      content,
      tags: selectedTags,
    };

    const success = await updateNote(note.note_id, content);

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#f5efe5] w-full max-w-md rounded-2xl p-6 shadow-xl">
        
        <h2 className="font-merriweather text-2xl text-primary mb-1">
          Edit Note
        </h2>

        <p className="text-gray-600 italic mb-4">
          {note.book} {note.chapter}{note.verse ? ":" + note.verse : ""}
        </p>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-40 p-4 bg-white rounded-xl border border-gray-300 text-primary focus:outline-none focus:ring-2 focus:ring-sand"
        />

        {/* Tags */}
        <div className="mt-4">
          <p className="text-primary font-medium mb-2">Emotion Tags</p>

          <div className="flex gap-3">
            {["Faith", "Trust", "Peace"].map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full border text-sm ${
                  selectedTags.includes(tag)
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-primary"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onClose} className="text-primary">
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-sand transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
