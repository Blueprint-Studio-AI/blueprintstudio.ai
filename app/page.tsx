// app/page.tsx
"use client";

// import { GestureContext, gestureContextValue } from '@/features/gestureHandler/GestureContext';
import GestureTestBox2 from "@/components/home/GestureTestBox2";
import { createContext } from "react";

export interface GestureContextValue {
  goUp: () => void;
  goLeft: () => void;
  goRight: () => void;
  goDown: () => void;
}

export const GestureContext = createContext<GestureContextValue>({goUp: ()=>{}, goLeft: ()=>{}, goRight: ()=>{}, goDown: ()=>{}, });

export default function HomePage() {

  const gestureContextValue: GestureContextValue = {
    goUp: () => console.log('Go Up'),
    goLeft: () => console.log('Go Left'),
    goRight: () => console.log('Go Right'),
    goDown: () => console.log('Go Down'),
  }

  return (
    <main>
      <GestureContext.Provider value={gestureContextValue}>
        <GestureTestBox2/>
      </GestureContext.Provider>
    </main>
  );
}

// import SnapScroller from "@/components/home/layout/SnapScroller";
// import { GestureProvider } from '@/contexts/GestureContext';
// import GestureTestBox from "@/components/home/GestureTestBox";
// import SnapSection from "@/components/home/layout/SnapSection";

{/* <SnapScroller>
          <SnapSection>
            <div className="w-screen h-screen bg-red-300"/>
          </SnapSection>
          <SnapSection>
            <div className="w-screen h-screen bg-blue-300"/>
          </SnapSection>
          <SnapSection>
            <div className="w-screen h-screen bg-yellow-300"/>
          </SnapSection>
        </SnapScroller> */}