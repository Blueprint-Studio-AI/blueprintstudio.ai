import { motion, useScroll, useTransform } from 'framer-motion';
import { Fingerprint } from 'lucide-react';

export function Hero() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const y = useTransform(scrollY, [0, 300], [0, 100]);

  return (
    <>
      <section className="relative min-h-screen flex flex-col">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square rounded-full"
            style={{
              background: "radial-gradient(circle at center, rgba(var(--primary-rgb), 0.03) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Top Content */}
        <div className="container flex-1 relative z-10 pt-16 flex justify-center items-end">
        <motion.div
            style={{ opacity, y }}
            className="relative w-full pb-20 sm:pb-0" // Added padding-bottom for mobile devices
            >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center gap-8"
          >
            <Fingerprint className="w-8 h-8 text-muted-foreground" />
            <p className="text-xl text-muted-foreground ">
              scroll to see the goods
            </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Content */}
        <div className="flex-1 flex items-end">
          <motion.div
            style={{ opacity, y }}
            className="relative w-full pb-20 sm:pb-0" // Added padding-bottom for mobile devices
            >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 
                className="font-serif font-medium leading-[0.85] tracking-tight text-center mx-auto"
                style={{ fontSize: 'clamp(4rem, 28vw, 30rem)',
                letterSpacing: '0.02em' // Normal letter-spacing relative to the font size
                }}
              >
                Services
              </h1>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Gradient Overlap Section */}
      <div className="relative -mt-[0vw]">
        <div 
          className="h-[10vw] bg-gradient-to-t from-background via-background/80 to-transparent"
          style={{
            maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)'
          }}
        />
      </div>
    </>
  );
}