"use client";

import { Icon } from "./icons";
import { EDITOR_CSS } from "./styles";

// Edit mode for a page that only lists things to edit (say, an index of posts whose cards
// open each post in edit mode): the site renders the page itself, and this adds the rail.
// Pages built from sections use PageEditor instead.

export function EditPage({ viewUrl, children }: { viewUrl: string; children: React.ReactNode }) {
  return (
    <>
      <style>{EDITOR_CSS}</style>
      <div className="gx-session">{children}</div>
      <nav className="gx-rail" aria-label="Edit mode">
        <a className="gx-rail-btn gx-rail-done" href={viewUrl} aria-label="Done" data-tip="Done: see the page">
          <Icon name="check" />
        </a>
      </nav>
    </>
  );
}
