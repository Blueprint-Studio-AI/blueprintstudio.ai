"use client";
import Link from "next/link";
import Image from "next/image";

interface BrandNavProps {
  clientName: string;
  /** Optional lockup image to show in the top-left instead of text */
  logoSrc?: string;
}

export function BrandNav({ clientName, logoSrc }: BrandNavProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3">
      {logoSrc ? (
        <div className="relative" style={{ width: 72, height: 16 }}>
          <Image
            src={logoSrc}
            alt={clientName}
            fill
            className="object-contain object-left"
            sizes="80px"
          />
        </div>
      ) : (
        <span className="text-[10px] tracking-[0.18em] uppercase text-neutral-400">
          {clientName} Brand Kit
        </span>
      )}
      <Link
        href="/"
        className="text-[10px] tracking-[0.18em] uppercase transition-colors duration-150"
        style={{ color: "rgba(0,0,0,0.35)" }}
      >
        Blueprint Studio
      </Link>
    </header>
  );
}
