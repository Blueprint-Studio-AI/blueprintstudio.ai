import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  fromClient: boolean;
  timestamp?: string;
}

interface ChatBubblesProps {
  isHovered?: boolean;
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

// Spring configs
const springConfig = {
  stiffness: 260,
  damping: 24,
  mass: 0.7
};

const gentleSpring = {
  stiffness: 180,
  damping: 20,
  mass: 0.8
};

export default function ChatBubbles({ isHovered = false }: ChatBubblesProps) {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [showTyping, setShowTyping] = React.useState(false);
  const [hasShownHoverMessage, setHasShownHoverMessage] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const resetTimeoutRef = React.useRef<NodeJS.Timeout>();

  // Handle hover state changes from parent
  React.useEffect(() => {
    if (isHovered && !hasShownHoverMessage) {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }

      setShowTyping(true);

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
      }, 900);
    } else if (!isHovered) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setShowTyping(false);

      resetTimeoutRef.current = setTimeout(() => {
        setMessages(initialMessages);
        setHasShownHoverMessage(false);
      }, 350);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [isHovered, hasShownHoverMessage]);

  // Get staggered delay based on message position and whether it's ours
  const getDelay = (index: number, fromClient: boolean) => {
    if (!fromClient) {
      // Our messages animate with staggered delay
      const ourMessageIndex = messages.filter((m, i) => i <= index && !m.fromClient).length - 1;
      return ourMessageIndex * 0.08;
    }
    return 0;
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-end p-3 cursor-default select-none">
      <div className="space-y-2 max-h-full overflow-hidden">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.92 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.88,
                y: -8,
                transition: { duration: 0.2, ease: "easeIn" }
              }}
              transition={{
                type: "spring",
                ...springConfig,
                delay: index * 0.02
              }}
              className={`flex ${message.fromClient ? 'justify-start' : 'justify-end'}`}
            >
              <motion.div
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                  message.fromClient
                    ? 'rounded-bl-md'
                    : 'rounded-br-md'
                }`}
                animate={{
                  backgroundColor: message.fromClient
                    ? 'rgb(229, 229, 229)'
                    : (isHovered ? '#60AEEE' : 'rgb(163, 163, 163)'),
                  scale: !message.fromClient && isHovered ? 1.02 : 1,
                  x: !message.fromClient && isHovered ? -2 : 0,
                  y: !message.fromClient && isHovered ? -1 : 0,
                }}
                transition={{
                  type: "spring",
                  ...gentleSpring,
                  delay: getDelay(index, message.fromClient)
                }}
                style={{
                  color: message.fromClient ? 'rgb(38, 38, 38)' : 'rgb(255, 255, 255)',
                  fontSize: 10,
                  lineHeight: 1.4
                }}
              >
                {message.text}
              </motion.div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {showTyping && (
            <motion.div
              key="typing"
              layout
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, y: -4, transition: { duration: 0.15 } }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 22,
                mass: 0.6
              }}
              className="flex justify-end"
            >
              <motion.div
                className="px-3 py-2.5 rounded-2xl rounded-br-md"
                initial={{ backgroundColor: 'rgb(163, 163, 163)' }}
                animate={{
                  backgroundColor: '#60AEEE',
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.1
                }}
              >
                <div className="flex space-x-1.5 items-center h-3">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-white rounded-full"
                      animate={{
                        scale: [0.85, 1.15, 0.85],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 0.7,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: [0.45, 0.05, 0.55, 0.95]
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}