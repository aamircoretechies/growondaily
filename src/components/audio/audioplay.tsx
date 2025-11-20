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
  // ------------------ SAFETY FIX -------------------
  const safeText = text || "";
  const safeReference = reference || "";
  const totalWords = safeText.split(" ").length || 1;
  // -------------------------------------------------

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Extract Book Chapter Verse
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

  // Start TTS
  const startSpeech = () => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(safeText);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    // Word progress tracking
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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]">
      <div className="w-[90%] max-w-md bg-[#f6efdf] rounded-3xl p-6 relative shadow-xl">

        <button onClick={onClose} className="absolute right-4 top-4 text-gray-700">
          <X size={22} />
        </button>

        <p className="text-xs text-[#b08d6a] font-semibold mb-2">AUDIO MODE</p>

        <h2 className="text-2xl font-merriweather text-primary">
          {book} {chapter}:{verse}
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          ({book} {chapter}:{verse} KJV)
        </p>

        <p className="text-primary text-lg leading-relaxed mb-8">
          {safeText}
        </p>

        <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mb-6">
          <div
            className="h-2 bg-[#b08d6a]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-center items-center gap-6">
          <button className="bg-[#e8dcc6] p-3 rounded-full">
            <SkipBack />
          </button>

          <button
            onClick={togglePlay}
            className="bg-[#b08d6a] p-4 rounded-full text-white"
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>

          <button className="bg-[#e8dcc6] p-3 rounded-full">
            <SkipForward />
          </button>
        </div>

      </div>
    </div>
  );
};

export default AudioPlay;
