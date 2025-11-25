// import React, { useRef, useState, useEffect } from "react";
// import { X, Play, Pause, SkipBack, SkipForward } from "lucide-react";

// interface AudioPlayProps {
//   isOpen: boolean;
//   onClose: () => void;
//   reference: string | undefined;
//   text: string | undefined;
//   audioUrl?: string;
// }

// const AudioPlay: React.FC<AudioPlayProps> = ({
//   isOpen,
//   onClose,
//   reference,
//   text,
// }) => {
//   const safeText = text || "";
//   const safeReference = reference || "";
//   const totalWords = safeText.split(" ").length || 1;

//   const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const extractReference = () => {
//     if (!safeReference || typeof safeReference !== "string") {
//       return { book: "", chapter: "", verse: "" };
//     }

//     const match = safeReference.match(/(.+)\s(\d+):(\d+)/);
//     if (!match) {
//       return { book: "", chapter: "", verse: "" };
//     }

//     return {
//       book: match[1],
//       chapter: match[2],
//       verse: match[3],
//     };
//   };

//   const { book, chapter, verse } = extractReference();

//   const startSpeech = () => {
//     window.speechSynthesis.cancel();

//     const utterance = new SpeechSynthesisUtterance(safeText);
//     utterance.lang = "en-US";
//     utterance.rate = 1;
//     utterance.pitch = 1;

//     utterance.onstart = () => {
//       setIsPlaying(true);
//       setProgress(0);
//     };

//     utterance.onend = () => {
//       setIsPlaying(false);
//       setProgress(100);
//     };

//     let spokenWords = 0;

//     utterance.onboundary = (event) => {
//       if (event.name === "word") {
//         spokenWords++;
//         const percentage = (spokenWords / totalWords) * 100;
//         setProgress(percentage);
//       }
//     };

//     utteranceRef.current = utterance;
//     window.speechSynthesis.speak(utterance);
//   };

//   const togglePlay = () => {
//     if (isPlaying) {
//       window.speechSynthesis.pause();
//       setIsPlaying(false);
//     } else {
//       if (window.speechSynthesis.paused) {
//         window.speechSynthesis.resume();
//         setIsPlaying(true);
//       } else {
//         startSpeech();
//       }
//     }
//   };

//   useEffect(() => {
//     return () => {
//       window.speechSynthesis.cancel();
//     };
//   }, []);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]">
//       <div className="w-[90%] max-w-md bg-[#f6efdf] rounded-3xl p-6 relative shadow-xl">

//         <button onClick={onClose} className="absolute right-4 top-4 text-gray-700">
//           <X size={22} />
//         </button>

//         <p className="text-xs text-[#b08d6a] font-semibold mb-2">AUDIO MODE</p>

//         <h2 className="text-2xl font-merriweather text-primary">
//           {book} {chapter}:{verse}
//         </h2>

//         <p className="text-sm text-gray-600 mb-6">
//           ({book} {chapter}:{verse} KJV)
//         </p>

//         <p className="text-primary text-lg leading-relaxed mb-8">
//           {safeText}
//         </p>

//         {/* Smooth Progress Bar */}
//         <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mb-6">
//           <div
//             className="h-2 bg-[#b08d6a] transition-all duration-300 ease-linear"
//             style={{ width: `${progress}%` }}
//           ></div>
//         </div>

//         <div className="flex justify-center items-center gap-6">
//           <button className="bg-[#e8dcc6] p-3 rounded-full">
//             <SkipBack />
//           </button>

//           <button
//             onClick={togglePlay}
//             className="bg-[#b08d6a] p-4 rounded-full text-white"
//           >
//             {isPlaying ? <Pause /> : <Play />}
//           </button>

//           <button className="bg-[#e8dcc6] p-3 rounded-full">
//             <SkipForward />
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default AudioPlay;












import React, { useRef, useState, useEffect } from "react";
import { X, Play, Pause, SkipBack, SkipForward } from "lucide-react";

interface AudioPlayProps {
  isOpen: boolean;
  onClose: () => void;
  reference: string | undefined;
  text: string | undefined;
  audioUrl?: string;
}

const AudioPlay: React.FC<AudioPlayProps> = ({
  isOpen,
  onClose,
  reference,
  text,
}) => {
  const safeText = text || "";
  const safeReference = reference || "";
  const totalWords = safeText.split(" ").length || 1;

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const extractReference = () => {
    if (!safeReference || typeof safeReference !== "string") {
      return { book: "", chapter: "", verse: "" };
    }

    const match = safeReference.match(/(.+)\s(\d+):(\d+)/);
    if (!match) {
      return { book: "", chapter: "", verse: "" };
    }

    return {
      book: match[1],
      chapter: match[2],
      verse: match[3],
    };
  };

  const { book, chapter, verse } = extractReference();

  const startSpeech = () => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(safeText);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      setProgress(0);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    let spokenWords = 0;

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        spokenWords++;
        const percentage = (spokenWords / totalWords) * 100;
        setProgress(percentage);
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const togglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        startSpeech();
      }
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999] backdrop-blur-[2px]">
      <div className="w-[92%] max-w-md bg-[#F6EFDF] rounded-3xl p-6 relative shadow-xl border border-[#E5DCC7]">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-[#B08D6A] hover:text-[#8A6A4F] transition"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <p className="text-xs text-[#B08D6A] font-semibold tracking-wide mb-3">
          AUDIO MODE
        </p>

        <h2 className="text-2xl font-merriweather text-[#234137] font-bold">
          {book} {chapter}:{verse}
        </h2>

        <p className="text-sm text-[#987b6b] mb-4 italic font-medium">
          ({book} {chapter}:{verse} KJV)
        </p>

        {/* Verse Text */}
        <p className="text-[#234137] text-[17px] leading-[26px] font-serif mb-8">
          {safeText}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-[3px] bg-[#E6DCCB] rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-[#B08D6A] transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-8">
          <button className="p-3 rounded-full bg-[#EFE6D9] hover:bg-[#D6C6B1] transition">
            <SkipBack className="text-[#856747]" />
          </button>

          <button
            onClick={togglePlay}
            className="p-5 rounded-full bg-[#B08D6A] text-white hover:bg-[#8F6D4F] transition shadow-md"
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>

          <button className="p-3 rounded-full bg-[#EFE6D9] hover:bg-[#D6C6B1] transition">
            <SkipForward className="text-[#856747]" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default AudioPlay;
