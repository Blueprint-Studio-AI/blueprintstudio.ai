import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  description?: string;
  gradient?: boolean;
  className?: string;
  align?: 'left' | 'center';
}

const lineVariants = {
  hidden: { width: 0, opacity: 0 },
  visible: { 
    width: '3rem',
    opacity: 0.8,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

export function SectionTitle({ 
  title, 
  description, 
  gradient = true,
  className = "",
  align = 'left'
}: SectionTitleProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        'max-w-2xl mb-20 overflow-visible',
        align === 'center' && 'mx-auto text-center',
        className
      )}
    >
      {/* Decorative Elements */}
      <div className={cn(
        'relative mb-8',
        align === 'center' && 'flex justify-center'
      )}>
        <motion.div
          variants={lineVariants}
          className={cn(
            'h-[1px] bg-gradient-to-r from-primary/80 to-primary/30',
            align === 'center' && 'absolute left-1/2 -translate-x-1/2'
          )}
        />
      </div>

      {/* Content Container */}
      <motion.div
        variants={contentVariants}
        className="space-y-6 overflow-visible"
      >
        {/* Title */}
        <h2 className={cn(
          'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
          'leading-[1.3]', // Increased line height
          'py-1', // Added vertical padding
          gradient && 'bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/50',
          align === 'center' && 'mx-auto',
          'overflow-visible'
        )}>
          <span className="inline-block"> {/* Wrapped title in inline-block */}
            {title}
          </span>
        </h2>

        {/* Description */}
        {description && (
          <p className={cn(
            'text-lg sm:text-xl text-muted-foreground/90',
            'leading-relaxed',
            'max-w-prose',
            align === 'center' && 'mx-auto'
          )}>
            {description}
          </p>
        )}
      </motion.div>

      {/* Optional Decorative Background */}
      <div 
        className="absolute -z-10 top-0 left-0 w-full h-full opacity-5 overflow-visible"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
      </div>
    </motion.div>
  );
}