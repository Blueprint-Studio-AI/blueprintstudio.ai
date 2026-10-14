"use client";

import { useEffect, useRef, useState } from "react";
import type { Comment, EditorActions, LibraryAsset, LibraryStyle, ManifestComponent } from "./types";

// The side panel: comments on the post, the brand's library, the Asset Generator, and
// the components a post can use.

const when = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
};

// ---- Comments ----------------------------------------------------------------------

export function CommentsPanel({
  comments,
  draft,
  active,
  onFocus,
  onSubmitDraft,
  onCancelDraft,
  onReply,
  onResolve,
  onReopen,
}: {
  comments: Comment[];
  draft: Comment | null;
  active: string | null;
  onFocus(id: string): void;
  onSubmitDraft(body: string): void;
  onCancelDraft(): void;
  onReply(id: string, body: string): void;
  onResolve(id: string): void;
  onReopen(id: string): void;
}) {
  const open = comments.filter((c) => !c.resolved);
  const resolved = comments.filter((c) => c.resolved);
  const [showResolved, setShowResolved] = useState(false);
  return (
    <div className="gx-panel-body">
      {draft ? <DraftCard draft={draft} onSubmit={onSubmitDraft} onCancel={onCancelDraft} /> : null}
      {!draft && !open.length ? (
        <p className="gx-empty">Select text and press Comment (⌘⌥M) to leave a note on it.</p>
      ) : null}
      {open.map((c) => (
        <CommentCard key={c.id} comment={c} active={active === c.id} onFocus={() => onFocus(c.id)} onReply={(b) => onReply(c.id, b)} onResolve={() => onResolve(c.id)} />
      ))}
      {resolved.length ? (
        <button type="button" className="gx-link-button gx-resolved-toggle" onClick={() => setShowResolved((s) => !s)}>
          {showResolved ? "Hide" : "Show"} {resolved.length} resolved
        </button>
      ) : null}
      {showResolved
        ? resolved.map((c) => (
            <div key={c.id} className="gx-card gx-card-resolved">
              <p className="gx-quote">“{c.quote}”</p>
              <p className="gx-comment-body">{c.body}</p>
              <button type="button" className="gx-link-button" onClick={() => onReopen(c.id)}>
                Reopen
              </button>
            </div>
          ))
        : null}
    </div>
  );
}

function DraftCard({ draft, onSubmit, onCancel }: { draft: Comment; onSubmit(body: string): void; onCancel(): void }) {
  const [body, setBody] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div className="gx-card is-active">
      <p className="gx-quote">“{draft.quote}”</p>
      <textarea
        ref={ref}
        rows={3}
        value={body}
        placeholder="Add a comment"
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && body.trim()) onSubmit(body.trim());
          if (e.key === "Escape") onCancel();
        }}
      />
      <div className="gx-form-actions">
        <button type="button" className="gx-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="gx-button gx-primary" disabled={!body.trim()} onClick={() => onSubmit(body.trim())}>
          Comment
        </button>
      </div>
    </div>
  );
}

function CommentCard({
  comment,
  active,
  onFocus,
  onReply,
  onResolve,
}: {
  comment: Comment;
  active: boolean;
  onFocus(): void;
  onReply(body: string): void;
  onResolve(): void;
}) {
  const [reply, setReply] = useState("");
  return (
    <div className={`gx-card${active ? " is-active" : ""}`} onClick={onFocus}>
      <div className="gx-card-head">
        <span className="gx-avatar">{comment.author.slice(0, 1).toUpperCase()}</span>
        <span>
          <b>{comment.author}</b>
          <small>{when(comment.at)}</small>
        </span>
        <button
          type="button"
          className="gx-resolve"
          title="Resolve"
          onClick={(e) => {
            e.stopPropagation();
            onResolve();
          }}
        >
          ✓
        </button>
      </div>
      <p className="gx-quote">“{comment.quote}”</p>
      <p className="gx-comment-body">{comment.body}</p>
      {comment.replies.map((r, i) => (
        <div key={i} className="gx-reply">
          <b>{r.author}</b> <small>{when(r.at)}</small>
          <p className="gx-comment-body">{r.body}</p>
        </div>
      ))}
      {active ? (
        <input
          className="gx-reply-input"
          value={reply}
          placeholder="Reply"
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && reply.trim()) {
              onReply(reply.trim());
              setReply("");
            }
          }}
        />
      ) : null}
    </div>
  );
}

// ---- Library -----------------------------------------------------------------------

export const ASSET_TYPE = "application/x-galley-asset";

export function LibraryPanel({
  actions,
  picking,
  onUse,
}: {
  actions: EditorActions;
  picking: boolean;
  onUse(asset: LibraryAsset): Promise<void>;
}) {
  const [assets, setAssets] = useState<LibraryAsset[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

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
  const load = (offset: number) => {
    setLoading(true);
    void fetchPage(offset);
  };
  useEffect(() => {
    void fetchPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="gx-panel-body">
      <p className="gx-panel-help">
        {picking ? "Choose the image for this block." : "Your brand's Blueprint Studio library. Click to add at the cursor, or drag into the post."}
      </p>
      {error ? <p className="gx-form-error">{error}</p> : null}
      <div className="gx-grid">
        {assets.map((asset) => (
          <button
            key={asset.id}
            type="button"
            className="gx-tile"
            draggable
            title={asset.prompt}
            onDragStart={(e) => {
              e.dataTransfer.setData(ASSET_TYPE, JSON.stringify(asset));
              e.dataTransfer.effectAllowed = "copy";
            }}
            onClick={async () => {
              setBusy(asset.id);
              await onUse(asset).finally(() => setBusy(null));
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset.thumbnail} alt={asset.prompt} loading="lazy" />
            {busy === asset.id ? <span className="gx-tile-busy">Adding…</span> : null}
          </button>
        ))}
      </div>
      {loading ? <div className="gx-skeleton gx-skeleton-small" /> : null}
      {!loading && assets.length < total ? (
        <button
          type="button"
          className="gx-button gx-wide"
          onClick={() => load(assets.length)}
        >
          More ({total - assets.length})
        </button>
      ) : null}
    </div>
  );
}

// ---- Generate ----------------------------------------------------------------------

type Tile = { jobId: string; status: "queued" | "processing" | "completed" | "failed"; asset?: LibraryAsset; error?: string };

export function GeneratePanel({
  actions,
  context,
  replacing,
  onUse,
}: {
  actions: EditorActions;
  /** A prompt drawn from the post around where the image will go. */
  context: string;
  replacing: boolean;
  onUse(asset: LibraryAsset): Promise<void>;
}) {
  const [prompt, setPrompt] = useState(context);
  const [styles, setStyles] = useState<LibraryStyle[]>([]);
  const [styleId, setStyleId] = useState<string>("");
  const [aspect, setAspect] = useState("16:9");
  const [count, setCount] = useState(2);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

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
    <div className="gx-panel-body">
      <p className="gx-panel-help">
        {replacing ? "New options for this image, made from the passage around it." : "Images made for this spot in the post, in your brand's style."}
      </p>
      <div className="gx-field">
        <label htmlFor="gx-prompt">Prompt</label>
        <textarea id="gx-prompt" rows={5} value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.stopPropagation()} />
      </div>
      <div className="gx-row">
        <div className="gx-field">
          <label htmlFor="gx-style">Style</label>
          <select id="gx-style" value={styleId} onChange={(e) => setStyleId(e.target.value)}>
            <option value="">No style</option>
            {styles.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
                {s.category ? ` · ${s.category}` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="gx-field gx-narrow">
          <label htmlFor="gx-aspect">Shape</label>
          <select id="gx-aspect" value={aspect} onChange={(e) => setAspect(e.target.value)}>
            {["16:9", "3:2", "4:3", "1:1", "4:5"].map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>
        <div className="gx-field gx-narrow">
          <label htmlFor="gx-count">Options</label>
          <select id="gx-count" value={count} onChange={(e) => setCount(Number(e.target.value))}>
            {[1, 2, 3, 4].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>
      <button type="button" className="gx-button gx-primary gx-wide" disabled={!prompt.trim()} onClick={generate}>
        ✦ Generate {count} option{count === 1 ? "" : "s"}
      </button>
      <p className="gx-hint">About 5 credits each, a minute or so per image.</p>
      {error ? <p className="gx-form-error">{error}</p> : null}
      <div className="gx-grid">
        {tiles.map((tile) =>
          tile.status === "completed" && tile.asset ? (
            <button
              key={tile.jobId}
              type="button"
              className="gx-tile"
              draggable
              title="Click to use, or drag into the post"
              onDragStart={(e) => e.dataTransfer.setData(ASSET_TYPE, JSON.stringify(tile.asset))}
              onClick={async () => {
                setBusy(tile.jobId);
                await onUse(tile.asset!).finally(() => setBusy(null));
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tile.asset.thumbnail} alt="" />
              <span className="gx-tile-label">{busy === tile.jobId ? "Adding…" : replacing ? "Use this" : "Add"}</span>
            </button>
          ) : (
            <div key={tile.jobId} className={`gx-tile gx-tile-pending${tile.status === "failed" ? " is-failed" : ""}`}>
              <span>{tile.status === "failed" ? (tile.error ?? "Failed") : "Making…"}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

// ---- Blocks ------------------------------------------------------------------------

export function BlocksPanel({ components, onInsert }: { components: ManifestComponent[]; onInsert(component: ManifestComponent): void }) {
  return (
    <div className="gx-panel-body">
      <p className="gx-panel-help">This site&apos;s components. Click to add one at the cursor, then fill it in.</p>
      {components.map((c) => (
        <button key={c.name} type="button" className="gx-component" onClick={() => onInsert(c)}>
          <b>{c.name}</b>
          <span>{c.description}</span>
        </button>
      ))}
    </div>
  );
}
