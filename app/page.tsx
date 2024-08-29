// app/page.tsx
"use client";

import GestureTestBox2 from "@/components/home/GestureTestBox2";
import GestureHandler from '@/features/GestureHandler';

export default function HomePage() {
  return (
    <main>
      <GestureHandler>
        <GestureTestBox2/>
      </GestureHandler>
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