"use client";

import { useEffect, useRef, useState } from "react";
import type { EditorActions, LibraryAsset, LibraryStyle } from "./types";

// Choosing a picture, where the picture goes: the brand's library, new options from the
// Asset Generator (prompted by the passage around it), or a file from your computer.
// Generated options stay in the tray, so you can compare them before keeping one.

export type Uploaded = { path: string; width?: number; height?: number; name?: string };
type Tab = "library" | "generate" | "upload";
type Tile = { jobId: string; status: "queued" | "processing" | "completed" | "failed"; asset?: LibraryAsset; error?: string };

export function ImageChooser({
  actions,
  context,
  onPick,
  onUploaded,
  onClose,
  onGenerate,
  title = "Choose an image",
}: {
  actions: EditorActions;
  /** A prompt drawn from the post around where the image goes. */
  context: string;
  onPick(asset: LibraryAsset): Promise<void> | void;
  onUploaded(file: Uploaded): void;
  onClose?: () => void;
  /** Make new options in place instead (an image block shows them as a strip under it). */
  onGenerate?: () => void;
  title?: string;
}) {
  const [tab, setTab] = useState<Tab>("library");
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const pick = async (key: string, asset: LibraryAsset) => {
    setBusy(key);
    await Promise.resolve(onPick(asset)).finally(() => setBusy(null));
  };

  return (
    <div className="gx-chooser" contentEditable={false} onKeyDown={(e) => e.stopPropagation()}>
      <div className="gx-chooser-head">
        <b>{title}</b>
        <nav className="gx-seg">
          {(
            [
              ["library", "Library"],
              ["generate", "✦ Generate"],
              ["upload", "Upload"],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button key={key} type="button" className={tab === key ? "is-on" : ""} onClick={() => (key === "generate" && onGenerate ? onGenerate() : setTab(key))}>
              {label}
              {key === "generate" && tiles.length ? ` · ${tiles.length}` : ""}
            </button>
          ))}
        </nav>
        {onClose ? (
          <button type="button" className="gx-chooser-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        ) : null}
      </div>
      {tab === "library" ? <Library actions={actions} busy={busy} onPick={(a) => pick(a.id, a)} /> : null}
      {tab === "generate" ? (
        <Generate actions={actions} context={context} tiles={tiles} setTiles={setTiles} busy={busy} onPick={(key, a) => pick(key, a)} />
      ) : null}
      {tab === "upload" ? <Upload actions={actions} onUploaded={onUploaded} /> : null}
    </div>
  );
}

function Library({ actions, busy, onPick }: { actions: EditorActions; busy: string | null; onPick(asset: LibraryAsset): void }) {
  const [assets, setAssets] = useState<LibraryAsset[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPage = (offset: number) =>
    actions
      .library({ offset })
      .catch((e: Error) => ({ error: e.message }) as { error: string })
      .then((result) => {
        setLoading(false);
        if ("error" in result && result.error) return setError(result.error);
        if ("assets" in result && result.assets) {
          setAssets((a) => (offset ? [...a, ...result.assets!] : result.assets!));
          setTotal(result.total ?? 0);
        }
      });
  useEffect(() => {
    void fetchPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="gx-chooser-body">
      {error ? <p className="gx-form-error">{error}</p> : null}
      <div className="gx-grid">
        {assets.map((asset) => (
          <button key={asset.id} type="button" className="gx-tile" title={asset.prompt} onClick={() => onPick(asset)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset.thumbnail} alt={asset.prompt} loading="lazy" />
            <span className="gx-tile-label">{busy === asset.id ? "Adding…" : "Use"}</span>
          </button>
        ))}
        {loading ? Array.from({ length: 8 }, (_, i) => <div key={i} className="gx-tile gx-tile-pending" />) : null}
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
          More from the library
        </button>
      ) : null}
    </div>
  );
}

function Generate({
  actions,
  context,
  tiles,
  setTiles,
  busy,
  onPick,
}: {
  actions: EditorActions;
  context: string;
  tiles: Tile[];
  setTiles: React.Dispatch<React.SetStateAction<Tile[]>>;
  busy: string | null;
  onPick(key: string, asset: LibraryAsset): void;
}) {
  const [prompt, setPrompt] = useState(context);
  const [styles, setStyles] = useState<LibraryStyle[]>([]);
  const [styleId, setStyleId] = useState("");
  const [aspect, setAspect] = useState("16:9");
  const [count, setCount] = useState(3);
  const [error, setError] = useState<string | null>(null);

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
      if (job.status === "completed" || job.status === "failed") return;
    }
  };

  const generate = async () => {
    setError(null);
    const started = await Promise.all(
      Array.from({ length: count }, () => actions.generate({ prompt, styleId: styleId || undefined, aspectRatio: aspect })),
    );
    const failed = started.find((s) => s.error);
    if (failed?.error) setError(failed.error);
    const jobs = started.filter((s) => s.jobId).map((s) => ({ jobId: s.jobId!, status: "queued" as const }));
    setTiles((t) => [...jobs, ...t]);
    jobs.forEach((j) => void poll(j.jobId));
  };

  return (
    <div className="gx-chooser-body">
      <textarea className="gx-prompt" rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} aria-label="What to make" />
      <div className="gx-row">
        <select value={styleId} onChange={(e) => setStyleId(e.target.value)} aria-label="Style">
          <option value="">No style</option>
          {styles.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
              {s.category ? ` · ${s.category}` : ""}
            </option>
          ))}
        </select>
        <select value={aspect} onChange={(e) => setAspect(e.target.value)} aria-label="Shape">
          {["16:9", "3:2", "4:3", "1:1", "4:5"].map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
        <select value={count} onChange={(e) => setCount(Number(e.target.value))} aria-label="How many">
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n} option{n === 1 ? "" : "s"}
            </option>
          ))}
        </select>
        <button type="button" className="gx-button gx-primary" disabled={!prompt.trim()} onClick={generate}>
          ✦ Generate
        </button>
      </div>
      <p className="gx-hint">From the passage around this spot, in the brand&apos;s style. About 5 credits and 30 seconds each.</p>
      {error ? <p className="gx-form-error">{error}</p> : null}
      {tiles.length ? (
        <div className="gx-grid">
          {tiles.map((tile) =>
            tile.status === "completed" && tile.asset ? (
              <button key={tile.jobId} type="button" className="gx-tile" onClick={() => onPick(tile.jobId, tile.asset!)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={tile.asset.thumbnail} alt="" />
                <span className="gx-tile-label">{busy === tile.jobId ? "Adding…" : "Use this"}</span>
              </button>
            ) : (
              <div key={tile.jobId} className={`gx-tile gx-tile-pending${tile.status === "failed" ? " is-failed" : ""}`}>
                <span>{tile.status === "failed" ? (tile.error ?? "Failed") : "Making…"}</span>
              </div>
            ),
          )}
        </div>
      ) : null}
    </div>
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

function Upload({ actions, onUploaded }: { actions: EditorActions; onUploaded(file: Uploaded): void }) {
  const [state, setState] = useState<"idle" | "over" | "busy">("idle");
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const send = async (file: File | undefined) => {
    if (!file) return;
    setState("busy");
    setError(null);
    const form = new FormData();
    form.set("file", await shrink(file).catch(() => file));
    const result = await actions.upload(form).catch((e: Error) => ({ error: e.message }) as { error: string });
    setState("idle");
    if ("error" in result && result.error) return setError(result.error);
    if ("path" in result && result.path) onUploaded({ path: result.path, width: result.width, height: result.height, name: file.name });
  };

  return (
    <div className="gx-chooser-body">
      <div
        className={`gx-drop${state === "over" ? " is-over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setState((s) => (s === "busy" ? s : "over"));
        }}
        onDragLeave={() => setState((s) => (s === "busy" ? s : "idle"))}
        onDrop={(e) => {
          e.preventDefault();
          void send(e.dataTransfer.files[0]);
        }}
        onClick={() => input.current?.click()}
      >
        {state === "busy" ? "Adding…" : "Drop an image here, or click to choose one"}
        <input ref={input} type="file" accept="image/*" hidden onChange={(e) => void send(e.target.files?.[0])} />
      </div>
      <p className="gx-hint">It&apos;s saved with the site as an optimised WebP.</p>
      {error ? <p className="gx-form-error">{error}</p> : null}
    </div>
  );
}
