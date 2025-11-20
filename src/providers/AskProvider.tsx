import { createContext, useContext, useState } from "react";
import axios from "axios";

interface AskContextType {
  sendMessage: (text: string) => Promise<{ answer: string; reference?: string }>;
  createConversation: () => Promise<string>;
  generateAIContent: (text: string) => Promise<{ content: string; content_id: string }>;
}

const AskContext = createContext<AskContextType | null>(null);

const API_BASE = "https://api.growondaily.com";

export const AskProvider = ({ children }: any) => {
  const [conversationId, setConversationId] = useState<string | null>(null);

  // CREATE NEW CONVERSATION
  const createConversation = async () => {
    const res = await axios.post(`/api/ai/conversations`);
    const id = res.data.data.conversation_id;
    setConversationId(id);
    return id;
  };

  // SEND CHAT MESSAGE
  const sendMessage = async (text: string) => {
    let convId = conversationId;
    if (!convId) {
      convId = await createConversation();
    }

    try {
      const res = await axios.post(`/api/ai/chat`, {
        conversation_id: convId,
        message: text,
      });

      return {
        answer: res.data.data.response,
        reference: "",
      };
    } catch (err: any) {
      console.log("CHAT API ERROR", err.response?.data || err.message);
      throw err;
    }
  };

  // NEW: GENERATE CONTENT API
  const generateAIContent = async (text: string) => {
    try {
      const res = await axios.post(`/api/ai/generate`, {
        prompt: text,
        content_type: "reflection",
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
    <AskContext.Provider value={{ sendMessage, createConversation, generateAIContent }}>
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
