import { EDITOR_CSS } from "./styles";

// The editor's home: every post, newest first, with whether it passes Galley's check.

export function PostList({
  title,
  posts,
  editUrl,
}: {
  title: string;
  posts: { slug: string; title: string | null; valid: boolean }[];
  editUrl(slug: string): string;
}) {
  return (
    <>
      <style>{EDITOR_CSS}</style>
      <div className="gx-root gx-list-root">
        <div className="gx-list">
          <p className="gx-list-eyebrow">Galley</p>
          <h1 className="gx-list-title">{title}</h1>
          <p className="gx-panel-help">Open a post to edit it. Changes save to its file as you type.</p>
          <ul className="gx-list-items">
            {posts.map((p) => (
              <li key={p.slug}>
                <a href={editUrl(p.slug)}>
                  <span>{p.title ?? p.slug}</span>
                  <small className={p.valid ? "" : "gx-list-bad"}>{p.valid ? p.slug : "has problems"}</small>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
