"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

interface MapProps {
  isActive?: boolean;
}

export default function Map({ isActive = false }: MapProps) {
  const rock1Controls = useAnimation();
  const rock2Controls = useAnimation();
  const rock3Controls = useAnimation();
  const rock4Controls = useAnimation();

  useEffect(() => {
    const runSequence = async () => {
      if (isActive) {
        // Start first rock immediately
        rock1Controls.start({ 
          x: 0, 
          y: 0, 
          transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
        });
        
        // Wait 200ms, then start second rock
        await new Promise(resolve => setTimeout(resolve, 200));
        rock2Controls.start({ 
          x: 0, 
          y: 0, 
          transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
        });
        
        // Wait another 200ms, then start third rock
        await new Promise(resolve => setTimeout(resolve, 200));
        rock3Controls.start({ 
          x: 0, 
          y: 0, 
          transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
        });
        
        // Wait another 200ms, then start fourth rock
        await new Promise(resolve => setTimeout(resolve, 200));
        rock4Controls.start({ 
          x: 0, 
          y: 0, 
          transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
        });
      } else {
        // Reverse sequence when deactivating
        rock4Controls.start({ 
          x: 300, 
          y: 100, 
          transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
        });
        
        await new Promise(resolve => setTimeout(resolve, 200));
        rock3Controls.start({ 
          x: 300, 
          y: 100, 
          transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
        });
        
        await new Promise(resolve => setTimeout(resolve, 200));
        rock2Controls.start({ 
          x: 300, 
          y: 100, 
          transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
        });
        
        await new Promise(resolve => setTimeout(resolve, 200));
        rock1Controls.start({ 
          x: 300, 
          y: 100, 
          transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
        });
      }
    };

    runSequence();
  }, [isActive, rock1Controls, rock2Controls, rock3Controls, rock4Controls]);

  const pathData = "M-1.08008 226.59C25.4139 191.755 12.0904 154.113 81.728 129.625C151.365 105.138 207.742 185.169 254.422 159.151C301.102 133.132 311.223 42.3473 337.719 14.9492";
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      <svg
        viewBox="0 0 337 283" 
        className="w-full h-full min-w-full min-h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <g clipPath="url(#clip0_1041_11016)">
          {/* Background gradient area - animated reveal */}
          <motion.g
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ 
              clipPath: isActive ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)"
            }}
            transition={{ 
              duration: 1,
              ease: "easeInOut"
            }}
          >
            <motion.path 
              d="M81.728 129.625C12.0904 154.113 25.4139 191.755 -1.08008 226.59V286.583H337.719V14.9492C311.223 42.3473 301.102 133.132 254.422 159.151C207.742 185.169 151.365 105.138 81.728 129.625Z" 
              fill="url(#paint0_linear_1041_11016)"
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 0.22 : 0 }}
              transition={{ 
                duration: 1,
                ease: "easeInOut"
              }}
            />
          </motion.g>
          
          {/* Rock formations with animated positioning */}
          <motion.path 
            d="M211.18 32.8317C211.723 32.3673 212.472 32.2279 213.146 32.466L253.097 46.5855C253.77 46.8236 254.266 47.4031 254.396 48.1055L262.144 89.7635C262.275 90.466 262.02 91.1848 261.477 91.6492L229.274 119.188C228.731 119.652 227.982 119.791 227.308 119.553L187.357 105.434C186.684 105.196 186.188 104.616 186.058 103.914L178.31 62.2559C178.18 61.5534 178.434 60.8346 178.977 60.3702L211.18 32.8317Z" 
            fill="url(#paint1_linear_1041_11016)"
            animate={rock1Controls}
            initial={{ x: 300, y: 100 }}
          />
          <motion.path 
            d="M8.24595 78.2052C11.679 79.1942 14.3237 81.9395 15.1837 85.4071L20.2177 105.703C21.0778 109.17 20.0226 112.833 17.4496 115.312L2.38994 129.819C-0.18304 132.298 -3.88291 133.216 -7.31596 132.227L-27.4095 126.438C-30.8426 125.45 -33.4873 122.704 -34.3473 119.237L-39.3813 98.9409C-40.2414 95.4733 -39.1862 91.8103 -36.6132 89.3316L-21.5535 74.8242C-18.9806 72.3456 -15.2807 71.4279 -11.8476 72.4169L8.24595 78.2052Z" 
            fill="url(#paint2_linear_1041_11016)"
            animate={rock2Controls}
            initial={{ x: 300, y: 100 }}
          />
          <motion.path 
            d="M142.309 181.858C142.996 182.056 143.525 182.605 143.697 183.298L150.955 212.56C151.127 213.253 150.916 213.986 150.401 214.482L128.689 235.398C128.174 235.894 127.434 236.077 126.747 235.879L97.7771 227.534C97.0905 227.336 96.5616 226.787 96.3896 226.094L89.1318 196.832C88.9598 196.138 89.1708 195.406 89.6854 194.91L111.398 173.994C111.912 173.498 112.652 173.315 113.339 173.512L142.309 181.858Z" 
            fill="url(#paint3_linear_1041_11016)"
            animate={rock3Controls}
            initial={{ x: 300, y: 100 }}
          />
          <motion.path 
            d="M417.002 205.876C417.063 206.588 416.74 207.278 416.153 207.687L374.36 236.828C373.773 237.236 373.014 237.301 372.367 236.998L326.233 215.374C325.586 215.07 325.15 214.445 325.089 213.733L320.75 162.968C320.689 162.256 321.012 161.566 321.599 161.157L363.393 132.016C363.979 131.608 364.738 131.543 365.385 131.846L411.519 153.47C412.166 153.774 412.602 154.399 412.663 155.111L417.002 205.876Z" 
            fill="url(#paint4_linear_1041_11016)"
            animate={rock4Controls}
            initial={{ x: 300, y: 100 }}
          />
          
          {/* Gray baseline path - always visible */}
          <path 
            d={pathData}
            stroke="#DCDCDC" 
            strokeWidth="4" 
            strokeLinecap="round"
            strokeDasharray="16 24"
            fill="none"
          />
          
          {/* Blue animated path - reveals from right to left */}
          <motion.g
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ 
              clipPath: isActive ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)"
            }}
            transition={{ 
              duration: 1,
              ease: "easeInOut"
            }}
          >
            <path 
              d={pathData}
              stroke="#60AEEE" 
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              strokeDasharray="16 24"
            />
          </motion.g>
        </g>
        
        <defs>
          <linearGradient id="paint0_linear_1041_11016" x1="193.88" y1="72.303" x2="259.513" y2="255.921" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60AEEE"/>
            <stop offset="1" stopColor="#60AEEE" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="paint1_linear_1041_11016" x1="212.057" y1="32.0813" x2="228.397" y2="119.938" gradientUnits="userSpaceOnUse">
            <stop stopColor="#DDDDDD"/>
            <stop offset="1" stopColor="#D0D0D0"/>
          </linearGradient>
          <linearGradient id="paint2_linear_1041_11016" x1="13.7938" y1="79.8034" x2="-32.9574" y2="124.84" gradientUnits="userSpaceOnUse">
            <stop stopColor="#DDDDDD"/>
            <stop offset="1" stopColor="#D0D0D0"/>
          </linearGradient>
          <linearGradient id="paint3_linear_1041_11016" x1="143.419" y1="182.177" x2="96.6676" y2="227.214" gradientUnits="userSpaceOnUse">
            <stop stopColor="#DDDDDD"/>
            <stop offset="1" stopColor="#D0D0D0"/>
          </linearGradient>
          <linearGradient id="paint4_linear_1041_11016" x1="417.101" y1="207.026" x2="320.651" y2="161.818" gradientUnits="userSpaceOnUse">
            <stop stopColor="#DDDDDD"/>
            <stop offset="1" stopColor="#D0D0D0"/>
          </linearGradient>
          <clipPath id="clip0_1041_11016">
            <rect width="336.256" height="282.788" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}