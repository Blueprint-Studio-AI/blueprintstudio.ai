import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  fromClient: boolean;
  timestamp?: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Need the hero section redesigned - I trust your design instincts",
    fromClient: true,
    timestamp: "2:14 PM"
  },
  {
    id: "2",
    text: "On it! Will send designs by EOD",
    fromClient: false,
    timestamp: "2:15 PM"
  },
  {
    id: "3",
    text: "Looks great! Let's ship it",
    fromClient: true,
    timestamp: "4:30 PM"
  }
];

export default function ChatBubbles() {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [showTyping, setShowTyping] = React.useState(false);
  const [hasShownHoverMessage, setHasShownHoverMessage] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    if (!hasShownHoverMessage) {
      setShowTyping(true);

      // Show typing indicator for 800ms, then add message
      timeoutRef.current = setTimeout(() => {
        setShowTyping(false);
        const newMessage: Message = {
          id: `hover-${Date.now()}`,
          text: "Just pushed to production 🚀",
          fromClient: false,
          timestamp: "4:45 PM"
        };
        setMessages(prev => [...prev, newMessage]);
        setHasShownHoverMessage(true);
      }, 800);
    }
  };

  const handleMouseLeave = () => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Reset to allow re-hover after leaving
    setTimeout(() => {
      setMessages(initialMessages);
      setShowTyping(false);
      setHasShownHoverMessage(false);
    }, 500);
  };

  // Round coordinates to avoid hydration issues
  const round = (num: number) => Math.round(num * 1000) / 1000;

  return (
    <div
      className="absolute inset-0 flex flex-col justify-end p-3"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="space-y-2 max-h-full overflow-hidden">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94], // ease-out-quad
                layout: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }
              }}
              className={`flex ${message.fromClient ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                  message.fromClient
                    ? 'bg-neutral-200 text-neutral-800 rounded-bl-md'
                    : 'bg-neutral-800 text-white rounded-br-md'
                }`}
                style={{
                  fontSize: round(10),
                  lineHeight: round(1.4)
                }}
              >
                {message.text}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {showTyping && (
            <motion.div
              key="typing"
              layout
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.15,
                ease: [0.25, 0.46, 0.45, 0.94] // ease-out-quad
              }}
              className="flex justify-end"
            >
              <div className="bg-neutral-800 text-white px-3 py-2 rounded-2xl rounded-br-md">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 bg-white rounded-full"
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1, 0.8]
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: [0.455, 0.03, 0.515, 0.955] // ease-in-out-quad
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}