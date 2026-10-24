import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// The home hero's two buttons (feat/hero-selector), for every other page:
// "Book a call with Tyler" with his photo, going to the home page's calendar
// (/#contact, where the floating nav's Book Call goes too), and a quiet
// outlined link beside it. Server-rendered; the press is CSS, not a spring.

const press = "whitespace-nowrap transition-[transform,filter,border-color] duration-200 ease-out active:scale-[0.97]";

export function BookCallButton({ className = "" }: { className?: string }) {
  return (
    <a
      href="/#contact"
      className={`flex h-12 items-center justify-center gap-2.5 rounded-full pl-1.5 pr-6 text-[15px] font-medium text-white hover:brightness-110 ${press} ${className}`}
      style={{
        background: "linear-gradient(135deg, #60AEEE 0%, #3B82F6 25%, #2563EB 50%, #1D4ED8 75%, #4F46E5 100%)",
        boxShadow:
          "0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(96, 174, 238, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 1px 0 rgba(255, 255, 255, 0.2) inset",
        textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Image
        src="/images/tyler-circle.png"
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 rounded-full object-cover ring-2 ring-white/35"
      />
      Book a call with Tyler
    </a>
  );
}

export function SecondaryButton({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`group flex h-12 items-center justify-center rounded-full border border-neutral-300 bg-white px-6 text-[15px] font-medium text-neutral-800 hover:border-neutral-400 ${press} ${className}`}
    >
      {children}
      <ArrowRight
        aria-hidden
        className="ml-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </Link>
  );
}

/** The pair, side by side from sm up, stacked full-width on phones. */
export function CallToActions({ secondary }: { secondary?: { href: string; label: string } }) {
  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
      <BookCallButton />
      {secondary && <SecondaryButton href={secondary.href}>{secondary.label}</SecondaryButton>}
    </div>
  );
}
