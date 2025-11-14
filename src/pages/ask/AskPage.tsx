// import { useState } from 'react';
// import { Container } from '@/components/container';
// import { KeenIcon } from '@/components';
// import { LucideMic } from 'lucide-react';

// interface Message {
//   id: string;
//   type: 'user' | 'ai';
//   content: string;
//   timestamp?: string;
//   reference?: string;
// }

// const AskPage = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       type: 'user',
//       content: 'Why did Jesus speak in parables?'
//     },
//     {
//       id: '2',
//       type: 'ai',
//       content: '"Jesus spoke all these things to the crowd in parables; he did not say anything to them without using a parable." Jesus used parables to reveal spiritual truths. These stories used everyday events to teach deeper lessons. Parables engaged listeners\' hearts and minds. They also caused reflection- helping to better understand His message.',
//       timestamp: 'Answered just now',
//       reference: 'Matthew 13:34'
//     }
//   ]);
//   const [inputText, setInputText] = useState('');
//   const [isTyping, setIsTyping] = useState(true);

//   const handleSendMessage = () => {
//     if (!inputText.trim()) return;

//     const newMessage: Message = {
//       id: Date.now().toString(),
//       type: 'user',
//       content: inputText
//     };

//     setMessages(prev => [...prev, newMessage]);
//     setInputText('');
//     setIsTyping(true);

//     // Simulate AI response after a delay
//     setTimeout(() => {
//       setIsTyping(false);
//       const aiResponse: Message = {
//         id: (Date.now() + 1).toString(),
//         type: 'ai',
//         content: 'This is a sample AI response to your question. In a real implementation, this would be connected to an AI service that provides biblical insights and explanations.',
//         timestamp: 'Answered just now',
//         reference: 'Sample Reference'
//       };
//       setMessages(prev => [...prev, aiResponse]);
//     }, 2000);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <Container>
//       <div className="max-w-4xl mx-auto min-h-screen flex flex-col">
//         {/* Header Section */}
//         <div className="text-left mb-8 ">
//           <h1 className="font-merriweather text-2xl  text-primary mb-3">
//             Ask Anything
//           </h1>
//           <p className="text-gray-700 text-sm mb-2">
//             Get explanations, ask about verses, or explore deeper meaning.
//           </p>
//           <p className="text-gray-600 text-sm italic">
//             e.g., 'What does Romans 8:28 mean?'
//           </p>
//         </div>

//         {/* Chat Area */}
//         <div className="flex-1 flex flex-col pb-24">
//           {/* Messages */}
//           <div className="flex-1 space-y-4 mb-6 overflow-y-auto">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
//               >
//                 <div
//                   className={`max-w-[80%] rounded-2xl px-4 py-3 ${
//                     message.type === 'user'
//                       ? 'bg-sand text-white'
//                       : 'bg-white/80 text-gray-800 dark:bg-gray-200'
//                   }`}
//                 >
//                   {message.type === 'ai' && message.reference && (
//                     <div className="text-xs text-gray-600 mb-1">
//                       {message.reference} - {message.timestamp}
//                     </div>
//                   )}
//                   <p className="text-sm leading-relaxed">{message.content}</p>
//                 </div>
//               </div>
//             ))}

//             {/* Typing Indicator */}
//             {isTyping && (
//               <div className="flex justify-start">
//                 <div className="bg-white/80 dark:bg-gray-200 rounded-2xl px-4 py-3">
//                   <p className="text-sm text-gray-600">typing..</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Fixed Input Section at Bottom */}
//         <div className="fixed bottom-10 left-0 right-0 bg-transparent  backdrop-blur-sm border-t border-gray-100 dark:border-gray-100 p-4 z-30">
//           <div className="max-w-4xl mx-auto">
//             <div className="flex items-end gap-3 p-4 bg-white/80 dark:bg-gray-200 rounded-xl border border-gray-200 dark:border-gray-300 shadow-lg">
//               <div className="flex-1">
//                 <textarea
//                   value={inputText}
//                   onChange={(e) => setInputText(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   placeholder="Type your question here..."
//                   className="w-full resize-none border-0 bg-transparent focus:outline-none focus:ring-0 text-gray-700 dark:text-gray-800 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
//                   rows={1}
//                   style={{ minHeight: '40px', maxHeight: '120px' }}
//                 />
//               </div>
//               <button
//                 onClick={handleSendMessage}
//                 className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors duration-200 flex-shrink-0"
//               >
//                 <LucideMic />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Container>
//   );
// };

// export { AskPage };































import { useState } from "react";
import axios from "axios";
import { Container } from "@/components/container";
import { LucideMic } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp?: string;
  reference?: string;
}

const AskPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "user",
      content: "Why did Jesus speak in parables?",
    },
    {
      id: "2",
      type: "ai",
      content:
        '"Jesus spoke all these things to the crowd in parables; he did not say anything to them without using a parable." Jesus used parables to reveal spiritual truths. These stories used everyday events to teach deeper lessons. Parables engaged listeners\' hearts and minds. They also caused reflection—helping to better understand His message.',
      timestamp: "Answered just now",
      reference: "Matthew 13:34",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputText,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await axios.post("https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini", 
          messages: [
            {
              role: "system",
              content: `You are a knowledgeable and spiritually insightful Bible assistant. 
When a user asks a question, respond clearly and faithfully based on the Bible. 
Include the relevant Bible verse reference if possible.

Your output should follow this format:
{
  "answer": "Full, clear answer with spiritual meaning and short reflection.",
  "reference": "Book Chapter:Verse (if applicable)"
}`,
            },
            {
              role: "user",
              content: inputText,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );

      const messageContent = response.data.choices[0].message.content;

      let aiData: { answer: string; reference: string } = {
        answer: messageContent,
        reference: "",
      };

      try {
        aiData = JSON.parse(messageContent);
      } catch {
        // If AI doesn't return JSON, fallback to plain text
        aiData = { answer: messageContent, reference: "" };
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiData.answer,
        timestamp: "Answered just now",
        reference: aiData.reference || "—",
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("AI Error:", error);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "Sorry, I couldn’t fetch a response right now. Please try again later.",
        timestamp: "Error",
        reference: "",
      };
      setMessages((prev) => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
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
            Ask Anything
          </h1>
          <p className="text-gray-700 text-sm mb-2">
            Get explanations, ask about verses, or explore deeper meaning.
          </p>
          <p className="text-gray-600 text-sm italic">
            e.g., "What does Romans 8:28 mean?"
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
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/80 dark:bg-gray-200 rounded-2xl px-4 py-3">
                  <p className="text-sm text-gray-600">typing...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Section */}
        <div className="fixed bottom-10 left-0 right-0 bg-transparent backdrop-blur-sm border-t border-gray-100 dark:border-gray-100 p-4 z-30">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3 p-4 bg-white/80 dark:bg-gray-200 rounded-xl border border-gray-200 dark:border-gray-300 shadow-lg">
              <div className="flex-1">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your question here..."
                  className="w-full resize-none border-0 bg-transparent focus:outline-none focus:ring-0 text-gray-700 dark:text-gray-800 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                  rows={1}
                  style={{ minHeight: "40px", maxHeight: "120px" }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors duration-200 flex-shrink-0"
              >
                <LucideMic />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export { AskPage };

