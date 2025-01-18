// app/page.tsx
"use client";

// import GestureTestBox2 from "@/components/tests/GestureTestBox2";
import GestureHandler from '../features/GestureHandler';
import TikTok from '@/components/home/TikTok';
import { usePreventDefaultScroll } from "@/utils/hooks/usePreventDefaultScroll";
import NavigationButton from '@/components/home/TikTok/NavigationButton';

export default function Home() {
  usePreventDefaultScroll();

  console.log('test yo');

  return (
    <main className='bg-white'> 
    <NavigationButton/>
      <GestureHandler>
        <TikTok/>
      </GestureHandler>
    </main>
  );
}
