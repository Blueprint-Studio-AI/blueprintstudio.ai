import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  description?: string;
  gradient?: boolean;
  className?: string;
}

export function SectionTitle({ 
  title, 
  description, 
  gradient = true,
  className = ""
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`max-w-2xl mb-16 ${className}`}
    >
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "3rem" }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="h-1 bg-primary mb-6"
      />
      <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${
        gradient ? 'bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50' : ''
      }`}>
        {title}
      </h2>
      {description && (
        <p className="text-xl text-muted-foreground">
          {description}
        </p>
      )}
    </motion.div>
  );
}