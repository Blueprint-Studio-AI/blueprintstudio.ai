"use client";

import { useEffect, useRef, useState } from "react";
import type { EditorActions, LibraryAsset, LibraryStyle } from "./types";

// New options for a picture, shown where the picture is. The strip under it holds the
// current picture and each new option; clicking one previews it in the post itself, and
// Keep makes it the picture. Nothing changes until you keep one.

type Tile = { jobId: string; status: "queued" | "processing" | "completed" | "failed"; asset?: LibraryAsset; error?: string };

export function OptionsStrip({
  actions,
  context,
  current,
  previewing,
  onPreview,
  onKeep,
  onClose,
}: {
  actions: EditorActions;
  /** A prompt from the passage around the picture. */
  context: string;
  /** The picture there now, if any (shown first, to compare against). */
  current?: { thumbnail: string } | null;
  previewing: LibraryAsset | null;
  onPreview(asset: LibraryAsset | null): void;
  onKeep(asset: LibraryAsset): void;
  onClose(): void;
}) {
  const [prompt, setPrompt] = useState(context);
  const [editingPrompt, setEditingPrompt] = useState(false);
  const [styles, setStyles] = useState<LibraryStyle[]>([]);
  const [styleId, setStyleId] = useState("");
  const [aspect, setAspect] = useState("16:9");
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const shownFirst = useRef(false);

  useEffect(() => {
    actions.styles().then((r) => {
      if (r.error) return setError(r.error);
      const list = r.styles ?? [];
      setStyles(list);
      setStyleId((list.find((s) => s.isDefault) ?? list[0])?.id ?? "");
    });
  }, [actions]);

  const poll = async (jobId: string) => {
    for (let i = 0; i < 30; i++) {
      const job = await actions.job(jobId).catch((e: Error) => ({ status: "failed" as const, error: e.message }));
      setTiles((t) => t.map((tile) => (tile.jobId === jobId ? { ...tile, ...job } : tile)));
      if (job.status === "completed") {
        // The first option to arrive shows in place straight away.
        if ("asset" in job && job.asset && !shownFirst.current) {
          shownFirst.current = true;
          onPreview(job.asset);
        }
        return;
      }
      if (job.status === "failed") return;
    }
  };

  const generate = async (count = 3) => {
    setError(null);
    const started = await Promise.all(
      Array.from({ length: count }, () => actions.generate({ prompt, styleId: styleId || undefined, aspectRatio: aspect })),
    );
    const failed = started.find((s) => s.error);
    if (failed?.error) setError(failed.error);
    const jobs = started.filter((s) => s.jobId).map((s) => ({ jobId: s.jobId!, status: "queued" as const }));
    setTiles((t) => [...t, ...jobs]);
    jobs.forEach((j) => void poll(j.jobId));
  };

  const making = tiles.some((t) => t.status === "queued" || t.status === "processing");
  const started = tiles.length > 0;

  return (
    <div className="gx-options" contentEditable={false} onKeyDown={(e) => e.stopPropagation()}>
      <div className="gx-options-head">
        <b>{started ? (making ? "Making options…" : "Pick one to try it here") : "New options for this picture"}</b>
        <span className="gx-options-actions">
          {previewing ? (
            <button type="button" className="gx-button gx-primary" onClick={() => onKeep(previewing)}>
              Keep this one
            </button>
          ) : null}
          <button type="button" className="gx-button" onClick={onClose}>
            {previewing ? "Cancel" : "Close"}
          </button>
        </span>
      </div>

      {!started || editingPrompt ? (
        <div className="gx-options-prompt">
          <textarea rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} aria-label="What to make" />
          <div className="gx-row">
            <select value={styleId} onChange={(e) => setStyleId(e.target.value)} aria-label="Style">
              <option value="">No style</option>
              {styles.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select value={aspect} onChange={(e) => setAspect(e.target.value)} aria-label="Shape">
              {["16:9", "3:2", "4:3", "1:1", "4:5"].map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
            <button
              type="button"
              className="gx-button gx-primary"
              disabled={!prompt.trim()}
              onClick={() => {
                setEditingPrompt(false);
                void generate(3);
              }}
            >
              ✦ Make 3 options
            </button>
          </div>
          <p className="gx-hint">From the passage around it, in the brand&apos;s style. About 5 credits and 30 seconds each.</p>
        </div>
      ) : null}

      {started ? (
        <div className="gx-strip">
          {current ? (
            <button type="button" className={`gx-strip-tile${!previewing ? " is-on" : ""}`} onClick={() => onPreview(null)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={current.thumbnail} alt="" />
              <span>Current</span>
            </button>
          ) : null}
          {tiles.map((tile, i) =>
            tile.status === "completed" && tile.asset ? (
              <button
                key={tile.jobId}
                type="button"
                className={`gx-strip-tile${previewing?.id === tile.asset.id ? " is-on" : ""}`}
                onClick={() => onPreview(tile.asset!)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={tile.asset.thumbnail} alt="" />
                <span>Option {i + 1}</span>
              </button>
            ) : (
              <div key={tile.jobId} className={`gx-strip-tile is-pending${tile.status === "failed" ? " is-failed" : ""}`}>
                <span>{tile.status === "failed" ? "Failed" : "Making…"}</span>
              </div>
            ),
          )}
          <span className="gx-strip-more">
            <button type="button" className="gx-button" disabled={making} onClick={() => void generate(3)}>
              ✦ 3 more
            </button>
            <button type="button" className="gx-link-button" onClick={() => setEditingPrompt((e) => !e)}>
              {editingPrompt ? "Hide prompt" : "Change prompt"}
            </button>
          </span>
        </div>
      ) : null}
      {error ? <p className="gx-form-error">{error}</p> : null}
    </div>
  );
}
