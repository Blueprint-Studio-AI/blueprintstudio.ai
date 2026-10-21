"use client";

import { useState } from "react";

// The interactive half of the YouTube component: a thumbnail and play button that swaps in
// the real player on click. Without JavaScript it's a link to the video on YouTube.

export function YouTubePlayer({ id, title, start }: { id: string; title?: string; start?: number }) {
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);
  const label = title ? `Play: ${title}` : "Play video";

  if (playing) {
    const query = new URLSearchParams({ autoplay: "1", rel: "0", ...(start ? { start: String(start) } : {}) });
    return (
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?${query}`}
        title={title ?? "YouTube video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <a
      className="group absolute inset-0 block"
      href={`https://www.youtube.com/watch?v=${id}${start ? `&t=${start}s` : ""}`}
      aria-label={label}
      onClick={(event) => {
        event.preventDefault();
        setPlaying(true);
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumb}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
        // Not every video has a full-resolution thumbnail; YouTube serves a 120px grey
        // placeholder instead of an error, so fall back on that too.
        onLoad={(e) => {
          if (e.currentTarget.naturalWidth <= 120) setThumb(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
        }}
        onError={() => setThumb(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
      />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90 transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true">
        <svg viewBox="0 0 68 48" width="68" height="48">
          <path d="M66.5 7.7c-.8-2.9-3-5.2-5.9-6C55.3 0 34 0 34 0S12.7 0 7.4 1.6c-2.9.8-5.2 3-5.9 6C0 13 0 24 0 24s0 11 1.5 16.3c.8 2.9 3 5.2 5.9 6C12.7 48 34 48 34 48s21.3 0 26.6-1.6c2.9-.8 5.2-3 5.9-6C68 35 68 24 68 24s0-11-1.5-16.3z" fill="#f00" />
          <path d="M45 24 27 14v20" fill="#fff" />
        </svg>
      </span>
      {title ? <span className="absolute inset-x-0 top-0 truncate bg-gradient-to-b from-black/60 to-transparent px-4 pb-6 pt-3 text-sm text-white">{title}</span> : null}
    </a>
  );
}
