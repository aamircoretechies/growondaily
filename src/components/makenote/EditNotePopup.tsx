import { useState } from "react";
import { useReflection } from "@/providers/ReflectionProvider";
import { toast } from "sonner";

interface Props {
  note: any;
  onClose: () => void;
}

export default function EditNotePopup({ note, onClose }: Props) {
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

  const normalizeTag = (tag: string) =>
    tag.trim().toLowerCase();

  const initialTags =
    note.tags ||
    note.emotion_tags ||
    note.updated_tags ||
    note.original_tags ||
    [];

  const [selectedTags, setSelectedTags] = useState(
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
    const normalized = normalizeTag(tag);

    if (selectedTags.includes(normalized)) {
      setSelectedTags(selectedTags.filter((t: string) => t !== normalized));
    } else {
      setSelectedTags([...selectedTags, normalized]);
    }
  };

  // const handleSave = async () => {
  //   const payload = {
  //     content,
  //     tags: selectedTags,
  //   };

  //   const success = await updateNote(note.note_id, content);

  //   if (success) {
  //     onClose();
  //   }
  // };


  // const handleSave = async () => {

  //   if (!content.trim()) {
  //     toast.error("Please write something !.");
  //     return;
  //   }

  //   const payload = {
  //     content,
  //     tags: selectedTags,
  //   };

  //   const success = await updateNote(note.note_id, content, selectedTags);

  //   if (success) {
  //     toast.success("Note updated successfully");
  //     onClose();
  //   }
  // };


  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Please write something!");
      return;
    }

    // Convert back to Title Case (optional)
    const tagsForBackend = selectedTags.map(
      (t: string) => t.charAt(0).toUpperCase() + t.slice(1)
    );

    const success = await updateNote(
      note.note_id,
      content,
      tagsForBackend
    );

    if (success) {
      toast.success("Note updated successfully");
      onClose();
    }
  };



  //   return (
  //     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  //       <div className="bg-[#f5efe5] w-full max-w-md rounded-2xl p-6 shadow-xl">

  //         <h2 className="font-merriweather text-2xl text-primary mb-1">
  //           Edit Note
  //         </h2>

  //         <p className="text-gray-600 italic mb-4">
  //           {note.book} {note.chapter}{note.verse ? ":" + note.verse : ""}
  //         </p>

  //         <textarea
  //           value={content}
  //           onChange={(e) => setContent(e.target.value)}
  //           className="w-full h-40 p-4 bg-white rounded-lg border border-gray-300 text-primary focus:outline-none focus:ring-2 focus:ring-sand max-h-32 overflow-y-auto resize-none"
  //         />

  //         {/* Tags */}
  //         <div className="mt-4">
  //           <p className="text-primary font-medium mb-2">Emotion Tags</p>

  //           <div className="flex gap-3">
  //             {["Faith", "Trust", "Peace", "kingdom"].map((tag) => (
  //               <button
  //                 key={tag}
  //                 onClick={() => toggleTag(tag)}
  //                 className={`px-4 py-2 rounded-full border text-sm ${selectedTags.includes(tag)
  //                     ? "bg-primary text-white"
  //                     : "bg-gray-100 text-primary"
  //                   }`}
  //               >
  //                 {tag}
  //               </button>
  //             ))}
  //           </div>
  //         </div>

  //         {/* Buttons */}
  //         <div className="mt-6 flex justify-end gap-4">
  //           <button onClick={onClose} className="text-primary">
  //             Cancel
  //           </button>

  //           <button
  //             onClick={handleSave}
  //             className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-sand transition"
  //           >
  //             Save
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }






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
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedTags.includes(normalizeTag(tag))
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-300 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {tag}
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