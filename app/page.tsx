// app/page.tsx
"use client";

import GestureTestBox2 from "@/components/tests/GestureTestBox2";
import GestureHandler from '@/features/GestureHandler';
import TikTok from '@/components/home/TikTok'
import { usePreventDefaultScroll } from "@/utils/hooks/usePreventDefaultScroll";

export default function Home() {
  usePreventDefaultScroll();

  return (
    <main>
      {/* <div className="h-[200vh] w-screen bg-blue-200"/> */}
      <GestureHandler>
        <TikTok/>
      </GestureHandler>
    </main>
  );
}