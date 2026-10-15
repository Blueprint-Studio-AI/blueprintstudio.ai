"use client";

import { useEffect, useRef, useState } from "react";
import type { EditorActions, LibraryAsset, LibraryStyle } from "./types";

// Choosing a picture, in the panel beside the post: new ones made for this spot (prompted
// by the passage around it), the brand's library, or a file from your computer, all in
// one place. Clicking a picture tries it in the post; Keep makes it the picture. Nothing
// changes until you keep one. An upload is a choice already, so it's used straight away.

export type Uploaded = { path: string; width?: number; height?: number; name?: string };
type Made = { jobId: string; status: "queued" | "processing" | "completed" | "failed"; asset?: LibraryAsset; error?: string };

// The library's first page, kept between openings so the panel fills at once.
let libraryCache: { assets: LibraryAsset[]; total: number } | null = null;

export function ImagePanel({
  actions,
  context,
  trying,
  onTry,
  onKeep,
  onUploaded,
}: {
  actions: EditorActions;
  /** A prompt for new pictures, from the post around where this one goes. */
  context: string;
  /** The picture being tried in the post, if any. */
  trying: LibraryAsset | null;
  onTry(asset: LibraryAsset | null): void;
  onKeep(asset: LibraryAsset): void;
  onUploaded(file: Uploaded): void;
}) {
  const [prompting, setPrompting] = useState(false);
  const [made, setMade] = useState<Made[]>([]);
  const [over, setOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);
  // Polls outlive a closed panel; they only report while it's open.
  const alive = useRef(true);
  const tryRef = useRef(onTry);
  useEffect(() => {
    tryRef.current = onTry;
  }, [onTry]);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const shownFirst = useRef(false);

  const poll = async (jobId: string) => {
    for (let i = 0; i < 40 && alive.current; i++) {
      const job = await actions.job(jobId).catch((e: Error) => ({ status: "failed" as const, error: e.message }));
      if (!alive.current) return;
      setMade((m) => m.map((tile) => (tile.jobId === jobId ? { ...tile, ...job } : tile)));
      if (job.status === "completed") {
        // The first new picture to arrive is tried in the post straight away.
        if ("asset" in job && job.asset && !shownFirst.current) {
          shownFirst.current = true;
          tryRef.current(job.asset);
        }
        return;
      }
      if (job.status === "failed") return;
    }
  };

  const make = async (input: { prompt: string; styleId?: string; aspectRatio: string }) => {
    setError(null);
    shownFirst.current = false;
    const started = await Promise.all(Array.from({ length: 3 }, () => actions.generate(input)));
    const failed = started.find((s) => s.error);
    if (failed?.error) setError(failed.error);
    const jobs = started.filter((s) => s.jobId).map((s) => ({ jobId: s.jobId!, status: "queued" as const }));
    setMade((m) => [...jobs, ...m]);
    setPrompting(false);
    jobs.forEach((j) => void poll(j.jobId));
  };

  const upload = async (picked: File | undefined) => {
    if (!picked) return;
    setUploading(true);
    setError(null);
    const form = new FormData();
    form.set("file", await shrink(picked).catch(() => picked));
    const result = await actions.upload(form).catch((e: Error) => ({ error: e.message }) as { error: string });
    setUploading(false);
    if ("error" in result && result.error) return setError(result.error);
    if ("path" in result && result.path) onUploaded({ path: result.path, width: result.width, height: result.height, name: picked.name });
  };

  return (
    <div
      className="gx-pick"
      onKeyDown={(e) => e.key !== "Escape" && e.stopPropagation()}
      onDragOver={(e) => {
        if (![...e.dataTransfer.types].includes("Files")) return;
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(false);
      }}
      onDrop={(e) => {
        if (!e.dataTransfer.files.length) return;
        e.preventDefault();
        setOver(false);
        void upload(e.dataTransfer.files[0]);
      }}
    >
      <div className="gx-pick-body">
        <div className="gx-pick-actions">
          <button type="button" className={`gx-pick-action${prompting ? " is-on" : ""}`} onClick={() => setPrompting((p) => !p)}>
            ✦ Make new ones
          </button>
          <button type="button" className="gx-pick-action" disabled={uploading} onClick={() => file.current?.click()}>
            {uploading ? "Adding…" : "Upload"}
          </button>
          <input ref={file} type="file" accept="image/*" hidden onChange={(e) => void upload(e.target.files?.[0])} />
        </div>

        {prompting ? <MakeForm actions={actions} context={context} onMake={make} /> : null}
        {error ? <p className="gx-form-error">{error}</p> : null}

        {made.length ? (
          <section className="gx-pick-section">
            <p className="gx-pick-label">Made for this spot</p>
            <div className="gx-grid">
              {made.map((tile, i) =>
                tile.status === "completed" && tile.asset ? (
                  <Tile key={tile.jobId} asset={tile.asset} label={`New ${made.length - i}`} on={trying?.id === tile.asset.id} onTry={onTry} onKeep={onKeep} />
                ) : (
                  <div key={tile.jobId} className={`gx-tile gx-tile-pending${tile.status === "failed" ? " is-failed" : ""}`} title={tile.error}>
                    <span>{tile.status === "failed" ? "Couldn't make this one" : "Making…"}</span>
                  </div>
                ),
              )}
            </div>
          </section>
        ) : null}

        <Library actions={actions} trying={trying} onTry={onTry} onKeep={onKeep} />
      </div>

      {trying ? (
        <footer className="gx-pick-foot">
          <span>Showing in the post</span>
          <button type="button" className="gx-button" onClick={() => onTry(null)}>
            Undo
          </button>
          <button type="button" className="gx-button gx-primary" onClick={() => onKeep(trying)}>
            Keep this one
          </button>
        </footer>
      ) : null}
      {over ? <div className="gx-pick-drop">Drop to add this picture</div> : null}
    </div>
  );
}

function Tile({
  asset,
  label,
  on,
  onTry,
  onKeep,
}: {
  asset: LibraryAsset;
  label?: string;
  on: boolean;
  onTry(asset: LibraryAsset | null): void;
  onKeep(asset: LibraryAsset): void;
}) {
  return (
    <button
      type="button"
      className={`gx-tile${on ? " is-on" : ""}`}
      title={asset.prompt ? `${asset.prompt}\n\nClick to try it in the post, double-click to keep it.` : "Click to try it in the post"}
      onClick={() => onTry(on ? null : asset)}
      onDoubleClick={() => onKeep(asset)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset.thumbnail} alt="" loading="lazy" />
      {label ? <span className="gx-tile-tag">{label}</span> : null}
    </button>
  );
}

function MakeForm({
  actions,
  context,
  onMake,
}: {
  actions: EditorActions;
  context: string;
  onMake(input: { prompt: string; styleId?: string; aspectRatio: string }): Promise<void>;
}) {
  const [prompt, setPrompt] = useState(context);
  const [styles, setStyles] = useState<LibraryStyle[]>([]);
  const [styleId, setStyleId] = useState("");
  const [aspect, setAspect] = useState("16:9");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void actions.styles().then((r) => {
      const list = r.styles ?? [];
      setStyles(list);
      setStyleId((list.find((s) => s.isDefault) ?? list[0])?.id ?? "");
    });
  }, [actions]);

  return (
    <div className="gx-pick-make">
      <textarea rows={5} value={prompt} onChange={(e) => setPrompt(e.target.value)} aria-label="What to make" />
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
      </div>
      <button
        type="button"
        className="gx-button gx-primary"
        disabled={!prompt.trim() || busy}
        onClick={() => {
          setBusy(true);
          void onMake({ prompt, styleId: styleId || undefined, aspectRatio: aspect }).finally(() => setBusy(false));
        }}
      >
        {busy ? "Starting…" : "✦ Make 3"}
      </button>
      <p className="gx-hint">Written from the passage around this spot, in the brand&apos;s style. About 5 credits and 30 seconds each.</p>
    </div>
  );
}

function Library({
  actions,
  trying,
  onTry,
  onKeep,
}: {
  actions: EditorActions;
  trying: LibraryAsset | null;
  onTry(asset: LibraryAsset | null): void;
  onKeep(asset: LibraryAsset): void;
}) {
  const [assets, setAssets] = useState<LibraryAsset[]>(libraryCache?.assets ?? []);
  const [total, setTotal] = useState(libraryCache?.total ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!libraryCache);

  const fetchPage = (offset: number) =>
    actions
      .library({ offset })
      .catch((e: Error) => ({ error: e.message }) as { error: string })
      .then((result) => {
        setLoading(false);
        if ("error" in result && result.error) return setError(result.error);
        if ("assets" in result && result.assets) {
          const page = result.assets;
          if (!offset) libraryCache = { assets: page, total: result.total ?? 0 };
          setAssets((a) => (offset ? [...a, ...page] : page));
          setTotal(result.total ?? 0);
        }
      });
  useEffect(() => {
    void fetchPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="gx-pick-section">
      <p className="gx-pick-label">Library</p>
      {error ? <p className="gx-form-error">{error}</p> : null}
      <div className="gx-grid">
        {assets.map((asset) => (
          <Tile key={asset.id} asset={asset} on={trying?.id === asset.id} onTry={onTry} onKeep={onKeep} />
        ))}
        {loading ? Array.from({ length: 6 }, (_, i) => <div key={i} className="gx-tile gx-tile-pending" />) : null}
      </div>
      {!loading && assets.length < total ? (
        <button
          type="button"
          className="gx-button gx-wide"
          onClick={() => {
            setLoading(true);
            void fetchPage(assets.length);
          }}
        >
          Show more
        </button>
      ) : null}
    </section>
  );
}

/**
 * Large photos are scaled down in the browser before they're sent (server actions take a
 * megabyte or two); the site still makes its own optimised WebP from what arrives.
 */
async function shrink(file: File, limit = 900 * 1024): Promise<File> {
  if (file.size <= limit || !/^image\/(jpeg|png|webp|heic|heif|avif)$/.test(file.type)) return file;
  const bitmap = await createImageBitmap(file);
  for (const [edge, quality] of [
    [2400, 0.86],
    [1800, 0.8],
    [1400, 0.75],
  ] as const) {
    const scale = Math.min(1, edge / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((done) => canvas.toBlob(done, "image/webp", quality));
    if (blob && blob.size <= limit) return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
  }
  return file;
}
