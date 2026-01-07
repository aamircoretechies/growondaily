import { createContext, useContext, useState, useRef, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "@/providers/TranslationProvider";

// Web Speech API Type Definitions
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

interface AskContextType {
  sendMessage: (text: string) => Promise<{ answer: string; reference?: string }>;
  createConversation: () => Promise<string>;
  generateAIContent: (text: string) => Promise<{ content: string; content_id: string }>;
  startListening: (onResult: (text: string) => void) => void;
  stopListening: () => void;
  isListening: boolean;
}

const AskContext = createContext<AskContextType | null>(null);


export const AskProvider = ({ children }: any) => {
  const { currentLanguage } = useLanguage();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
    const SpeechRecognitionConstructor = SpeechRecognition || webkitSpeechRecognition;

    if (SpeechRecognitionConstructor) {
      const recognition = new SpeechRecognitionConstructor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = (onResult: (text: string) => void) => {
    if (!recognitionRef.current) {
      console.warn("Speech recognition not supported");
      return;
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    setIsListening(true);

    recognitionRef.current.onresult = (event: any) => {
      // Clear existing timer on new input
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        onResult(finalTranscript);
      }

      // Set new timer to stop listening after silence
      silenceTimerRef.current = setTimeout(() => {
        stopListening();
      }, 2500);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error("Error starting speech recognition:", e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
  };

  // CREATE NEW CONVERSATION
  const createConversation = async () => {
    const res = await axios.post(`/api/ai/conversations`);
    const id = res.data.data.conversation_id;
    setConversationId(id);
    return id;
  };

  // SEND CHAT MESSAGE
  const sendMessage = async (text: string) => {
    try {
      const res = await axios.post(`/api/ai/chat`, {
        message: text,
      });

      return {
        answer: res.data.data.response,
        reference: "",
      };
    } catch (err: any) {
      console.log("GENERATE API ERROR", err.response?.data || err.message);
      throw err;
    }
  };

  // NEW: GENERATE CONTENT API
  const generateAIContent = async (text: string) => {
    try {
      const promptWithLang = `(Please detect the language of the following text and respond ONLY in that same language) ${text}`;
      const res = await axios.post(`/api/ai/generate`, {
        prompt: promptWithLang,
        content_type: "reflection",
        language: currentLanguage.code,
      });

      return {
        content: res.data.data.generated_text,
        content_id: res.data.data.content_id,
      };
    } catch (err: any) {
      console.log("GENERATE API ERROR", err.response?.data || err.message);
      throw err;
    }
  };

  return (
    <AskContext.Provider value={{ sendMessage, createConversation, generateAIContent, startListening, stopListening, isListening }}>
      {children}
    </AskContext.Provider>
  );
};

export const useAsk = () => {
  const context = useContext(AskContext);
  if (!context) {
    throw new Error("useAsk must be used inside AskProvider");
  }
  return context;
};
