"use client";

import { useEffect, useState } from "react";

export function Typewriter({
  words,
  typeSpeed = 20,
  deleteSpeed = 20,
  pause = 2000,
}: {
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
}) {
  const [text, setText] = useState(words[0] ?? "");

  useEffect(() => {
    let wordIndex = 0;
    let charIndex = words[0]?.length ?? 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      const word = words[wordIndex];
      if (deleting) {
        charIndex -= 1;
        setText(word.substring(0, Math.max(charIndex, 0)));
        if (charIndex <= 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          timer = setTimeout(step, 500);
        } else {
          timer = setTimeout(step, deleteSpeed);
        }
      } else {
        charIndex += 1;
        setText(word.substring(0, charIndex));
        if (charIndex >= word.length) {
          deleting = true;
          timer = setTimeout(step, pause);
        } else {
          timer = setTimeout(step, typeSpeed);
        }
      }
    };

    timer = setTimeout(step, pause);
    return () => clearTimeout(timer);
  }, [words, typeSpeed, deleteSpeed, pause]);

  return (
    <span
      className="inline-block border-r-0 pr-[5px]"
      style={{ animation: "blink 0.7s infinite", borderRight: "0 solid #fff" }}
    >
      {text}
    </span>
  );
}
