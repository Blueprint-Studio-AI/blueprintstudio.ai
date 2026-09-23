import type { Metadata } from "next";

import { ArchButton } from "@/components/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-light px-6 text-center text-black">
      <p className="text-xs tracking-[0.2em] text-grey">404</p>
      <h1 className="mt-4 font-serif text-[clamp(42px,6vw,62px)] font-light leading-[1.08]">
        This page doesn&rsquo;t exist.
      </h1>
      <p className="mt-4 max-w-md text-[16px] leading-[150%] text-grey">
        The link may be outdated or mistyped. Head back to the homepage to find
        what you&rsquo;re looking for.
      </p>
      <ArchButton href="/" className="mt-8">
        Back to Arch
      </ArchButton>
    </main>
  );
}
