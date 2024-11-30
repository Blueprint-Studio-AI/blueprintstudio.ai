import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface ServiceLineProps {
  name: string;
  description: string;
  href: string;
}

export function ServiceLine({ name, description, href }: ServiceLineProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      href={href}
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <div className="p-4 rounded-lg border border-primary/10 hover:border-primary/20 hover:bg-primary/5 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-medium group-hover:text-primary transition-colors duration-300">
              {name}
            </h4>
            <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
              {description}
            </p>
          </div>
          <div className="relative w-10 h-10 shrink-0 ml-4">
            <motion.div 
              className="absolute inset-0 rounded-full bg-gray-100"
              animate={{
                backgroundColor: isHovered ? '#000000' : '#F3F4F6'
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
            <AnimatePresence>
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{ 
                  rotate: isHovered ? 45 : 0,
                  scale: isHovered ? 1.1 : 1
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <ArrowUpRight 
                  className={`w-5 h-5 transition-colors duration-300 ${
                    isHovered ? 'text-white' : 'text-gray-500'
                  }`}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Link>
  );
}