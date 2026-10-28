"use client";

import Image from "next/image";

/**
 * A film's image filling its box: one of our kit files through next/image, or
 * (remote) the film's YouTube thumbnail as a plain <img>.
 */
export function FilmImg({ src, remote, sizes, quality = 75, className = "object-cover" }: { src: string; remote?: boolean; sizes: string; quality?: number; className?: string }) {
  if (remote) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" decoding="async" draggable={false} className={`absolute inset-0 h-full w-full ${className}`} />;
  }
  return <Image src={src} alt="" fill quality={quality} sizes={sizes} className={className} draggable={false} />;
}
