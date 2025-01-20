// app/page.tsx
"use client";

// import GestureTestBox2 from "@/components/tests/GestureTestBox2";
import GestureHandler from '../features/GestureHandler';
import TikTok from '@/components/home/TikTok';
import { usePreventDefaultScroll } from "@/utils/hooks/usePreventDefaultScroll";
import NavigationButton from '@/components/home/TikTok/NavigationButton';
import SectionLogicProvider from '@/components/home/TikTok/utils/SectionLogicProvider';

export default function Home() {
  usePreventDefaultScroll();

  return (
    <main className='bg-white'> 
    <NavigationButton/>
      <GestureHandler>
        <SectionLogicProvider>
          <TikTok/>
        </SectionLogicProvider>
      </GestureHandler>
    </main>
  );
}
