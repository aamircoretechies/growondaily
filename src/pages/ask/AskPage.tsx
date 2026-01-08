import { useState, useEffect } from "react";
import axios from "axios";
import { Container } from "@/components/container";
import { LucideMic, LucideMicOff, LucideSend } from "lucide-react";
import { useAsk } from "@/providers";
import { FormattedMessage, useIntl } from 'react-intl';


interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp?: string;
  reference?: string;
}

const AskPage = () => {
  const { formatMessage } = useIntl();
  const [messages, setMessages] = useState<Message[]>([]);

  // Update initial messages when language changes
  useEffect(() => {
    setMessages([
      {
        id: "1",
        type: "user",
        content: formatMessage({ id: "ASK.DEFAULT_QUESTION" }),
      },
      {
        id: "2",
        type: "ai",
        content: formatMessage({ id: "ASK.DEFAULT_ANSWER" }),
        timestamp: formatMessage({ id: "ASK.ANSWERED" }),
        reference: formatMessage({ id: "ASK.DEFAULT_REFERENCE" }),
      },
    ]);
  }, [formatMessage]);

  const [inputText, setInputText] = useState("");
  // const [inputText, setInputText] = useState("");
  // const [isTyping, setIsTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // const { sendMessage } = useAsk();
  // const { generateAIContent } = useAsk();
  const { sendMessage, generateAIContent, startListening, stopListening, isListening } = useAsk();


  const run = async () => {
    const data = await generateAIContent("Explain Psalm 23:1 in detail.");

    console.log(data.content);
    console.log(data.content_id);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputText,
    };

    setMessages((prev) => [...prev, newMessage]);
    const userText = inputText;
    setInputText("");
    setIsTyping(true);

    try {
      const ai = await sendMessage(userText);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: ai.answer,
        // timestamp: "just now",
        timestamp: formatMessage({ id: "ASK.ANSWERED" }),
        reference: ai.reference || "—",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error:", err);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: "AI service failed. Please try later.",
          timestamp: "error",
          reference: "",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else if (inputText.trim()) {
      handleSendMessage();
    } else {
      startListening((text) => {
        setInputText(text);
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container>
      <div className="max-w-4xl mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-left mb-8">
          <h1 className="font-merriweather text-2xl text-primary mb-3">
            <FormattedMessage id="ASK.ASK_ANYTHING" />
          </h1>
          <p className="text-gray-700 text-sm mb-2">
            <FormattedMessage id="ASK.GET_EXPLANATIONS" />
          </p>
          <p className="text-gray-600 text-sm italic">
            <FormattedMessage id="ASK.EXAMPLE" />
          </p>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col pb-24">
          <div className="flex-1 space-y-4 mb-6 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user"
                  ? "justify-end"
                  : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.type === "user"
                    ? "bg-sand text-white"
                    : "bg-white/80 text-gray-800 dark:bg-gray-200"
                    }`}
                >
                  {message.type === "ai" && message.reference && (
                    <div className="text-xs text-gray-600 mb-1">
                      {message.reference} - {message.timestamp}
                    </div>
                  )}
                  <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/80 dark:bg-gray-200 rounded-2xl px-4 py-3">
                  <p className="text-sm text-gray-600"><FormattedMessage id="ASK.TYPING" /></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Section */}
        <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-gradient-to-t from-white/50 via-white/50 to-transparent border-t border-gray-200 dark:border-gray-100 p-6 z-40">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3 p-4 bg-white/80 dark:bg-gray-200 rounded-xl border border-gray-200 dark:border-gray-300 shadow-lg">
              <div className="flex-1">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isListening ? formatMessage({ id: "ASK.LISTENING" }) : formatMessage({ id: "ASK.PLACEHOLDER" })}
                  className="w-full resize-none border-0 bg-transparent focus:outline-none focus:ring-0 text-gray-700 dark:text-gray-800 placeholder-gray-400 dark:placeholder-gray-500 text-sm overflow-y-auto"
                  rows={1}
                  style={{ minHeight: "40px", maxHeight: "120px" }}
                />
              </div>
              <button
                onClick={handleMicClick}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 ${isListening
                  ? "bg-red-500 text-white"
                  : "bg-primary text-white hover:bg-primary/90"
                  }`}
              >
                {isListening ? (
                  <LucideMicOff size={20} />
                ) : inputText.trim() ? (
                  <LucideSend size={20} className="rotate-45" />
                ) : (
                  <LucideMic size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export { AskPage };

