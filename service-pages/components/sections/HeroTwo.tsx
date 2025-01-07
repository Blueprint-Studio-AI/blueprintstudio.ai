import { motion, useScroll, useTransform } from 'framer-motion';

export function HeroTwo() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const y = useTransform(scrollY, [0, 300], [0, 100]);

  return (
    <>
      <section className="relative min-h-screen flex flex-col bg-[#0f0f0f] text-white">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        </div>

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f]/80 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="text-sm text-white">blueprint studio</a>
            <div className="flex gap-4">
              <a 
                href="https://calendly.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              >
                View Work
              </a>
              <a 
                href="https://calendly.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm px-4 py-2 rounded-full bg-white text-[#0f0f0f] hover:bg-white/90 transition-colors"
              >
                Schedule Call
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
        <motion.div 
            style={{ opacity }}
            className="container px-4 max-w-3xl mx-auto text-center" // Back to max-w-3xl
        >
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            >
            <h1 className="text-3xl md:text-4xl mb-4 text-white font-medium">
                Ideas made real. Problems made simple.
            </h1>

            <p className="text-xl md:text-2xl text-[#a2a2a2] mb-8">
                Your vision, amplified.
            </p>

            <p className="text-base md:text-lg text-[#a2a2a2]">
                Because the best path isn't always obvious.
            </p>
            </motion.div>
        </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-sm text-[#a2a2a2]">Scroll to explore</span>
            <motion.div 
              className="w-px h-8 bg-gradient-to-b from-[#a2a2a2] to-transparent"
              animate={{ 
                scaleY: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Gradient Overlap */}
      <div className="relative -mt-[15vh]">
        <div 
          className="h-[20vh] bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent"
          style={{
            maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)'
          }}
        />
      </div>
    </>
  );
}