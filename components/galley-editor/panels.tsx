"use client";

import { useEffect, useRef, useState } from "react";
import type { Comment } from "./types";

// Comments on the post, in the drawer.

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
