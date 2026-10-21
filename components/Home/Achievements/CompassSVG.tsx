"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface CompassSVGProps {
  isHovered?: boolean;
}

export default function CompassSVG({ isHovered = false }: CompassSVGProps) {
  return (
    <div className="relative w-full h-full">
      {/* Rotating dial SVG */}
      <motion.div
        className="absolute inset-1 top-4 bottom-0 flex items-center justify-center"
        initial={false}
        animate={{ rotate: isHovered ? 22.5 : 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 24, 
          mass: 0.7 
        }}
      >
        <Image
          src="/media/home/compass-dial.svg"
          alt="Compass dial"
          width={80}
          height={80}
          className="w-full h-full object-contain"
        />
      </motion.div>
      {/* Background compass SVG */}
      <div className="absolute inset-1 top-4 bottom-0 flex items-center justify-center">
        <Image
          src="/media/home/compass-bg.svg"
          alt="Compass background"
          width={80}
          height={80}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}