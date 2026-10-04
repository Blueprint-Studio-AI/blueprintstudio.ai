// Shared glyphs. Both are drawn on the same 20-unit grid at 1.3 stroke so they
// sit identically inside a button.
//
// Pick by meaning, not by looks: DownloadIcon means a file lands on your disk;
// LinkIcon means something is copied or points elsewhere.

export const DownloadIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0">
    <path
      d="M10 3.5v8.2M6.6 8.4L10 11.8l3.4-3.4M4.6 15.6h10.8"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LinkIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0">
    <path
      d="M8.6 11.4a3 3 0 004.24 0l2.5-2.5a3 3 0 00-4.24-4.24l-1.1 1.1M11.4 8.6a3 3 0 00-4.24 0l-2.5 2.5a3 3 0 004.24 4.24l1.1-1.1"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
