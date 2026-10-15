"use client";

import { useEffect, useState } from "react";

// Version history, like a document's: each stretch of editing by one person is a version.
// The panel lists them; opening one shows the page as it was, read-only, with a bar to
// restore it or go back. Versions are kept by Galley (recordSave) beside the site.

export type VersionInfo = { id: string; at: string; author: string; note?: string; words?: number };

const when = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  if (d.toDateString() === today.toDateString()) return `Today, ${time}`;
  const yesterday = new Date(today.getTime() - 86400000);
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;
  return `${d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: d.getFullYear() === today.getFullYear() ? undefined : "numeric" })}, ${time}`;
};

export function HistoryPanel({ load, onOpen }: { load(): Promise<VersionInfo[]>; onOpen(id: string): void }) {
  const [versions, setVersions] = useState<VersionInfo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    load()
      .then(setVersions)
      .catch((e: Error) => setError(e.message));
  }, [load]);
  return (
    <div className="gx-details">
      <p className="gx-panel-help">Each stretch of editing is saved as a version. Open one to see the page as it was, and restore it if you want it back.</p>
      {error ? <p className="gx-form-error">{error}</p> : null}
      {versions === null && !error ? <div className="gx-skeleton gx-skeleton-small" /> : null}
      {versions?.length === 0 ? <p className="gx-empty">No versions yet. They start with your first change.</p> : null}
      <ol className="gx-versions">
        {versions?.map((v, i) => (
          <li key={v.id}>
            <button type="button" onClick={() => onOpen(v.id)}>
              <b>{when(v.at)}</b>
              <span>
                {v.note ?? v.author}
                {i === 0 ? " · current" : ""}
                {v.words ? ` · ${v.words.toLocaleString()} words` : ""}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Shown instead of the rail while looking at an old version. */
export function VersionBar({ version, onRestore, backHref }: { version: VersionInfo; onRestore(): Promise<string | null>; backHref: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="gx-versionbar" role="region" aria-label="An earlier version">
      <span>
        <b>{when(version.at)}</b> · {version.note ?? version.author}
      </span>
      {error ? <span className="gx-form-error">{error}</span> : null}
      <a className="gx-button" href={backHref}>
        Back to now
      </a>
      <button
        type="button"
        className="gx-button gx-primary"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const failed = await onRestore();
          setBusy(false);
          if (failed) setError(failed);
          else window.location.href = backHref;
        }}
      >
        {busy ? "Restoring…" : "Restore this version"}
      </button>
    </div>
  );
}
