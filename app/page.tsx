// app/page.tsx
import SnapScroller from "@/components/home/layout/SnapScroller";
// import { GestureProvider } from '@/contexts/GestureContext';
import { GestureProvider } from "@/contexts/GestureClassifier/GestureContext";
import GestureTestBox from "@/components/home/GestureTestBox";
import GestureTestBox2 from "@/components/home/GestureTestBox";
import SnapSection from "@/components/home/layout/SnapSection";

export default function Home() {
  return (
    <main>
      <GestureProvider>
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
        <GestureTestBox2/>
      </GestureProvider>
    </main>
  );
}