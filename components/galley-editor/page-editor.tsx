"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Field } from "./fields";
import { Icon } from "./icons";
import { SectionScope, type SectionScopeValue } from "./section-text";
import { EDITOR_CSS } from "./styles";
import type { JsonSchema, Vocabulary } from "./types";

// Edit mode for a page built from sections (Galley pages), on the site's own page. Each
// section is rendered by the site (a server action runs its real component) and can be
// selected: the toolbar over it moves, hides, duplicates or deletes it, and its settings
// open in the panel beside the page. "+" between sections, or on the rail, adds one from
// the site's section library. Words inside a section are edited where they show
// (SectionText). The page saves as you go, checked by Galley on the server.

export type LibrarySection = {
  name: string;
  label: string;
  description: string;
  category?: string;
  single?: boolean;
  props: JsonSchema;
  defaults: Record<string, unknown>;
};
export type PageSection = { id: string; type: string; props: Record<string, unknown>; hidden?: boolean };
export type PageSaveResult = { ok: true; revision: string } | { ok: false; error: string };
export interface PageActions {
  save(page: { sections: PageSection[] }, revision: string): Promise<PageSaveResult>;
  /** The section at `index`, rendered by the site; `page` holds it and the sections above it. */
  render(page: { sections: PageSection[] }, index: number): Promise<{ node?: React.ReactNode; error?: string }>;
}

type Rendered = { node?: React.ReactNode; error?: string };
const rendered = new Map<string, Rendered>();

/** The section's preview, rendered again when it or a section above it changes. */
function usePreview(page: PageSection[], index: number, actions: PageActions) {
  const upTo = page.slice(0, index + 1);
  const key = JSON.stringify(upTo.map(({ type, props, hidden }) => [type, props, hidden ?? false]));
  const [fetched, setFetched] = useState<{ key: string; result: Rendered } | null>(null);
  useEffect(() => {
    if (rendered.has(key)) return;
    let live = true;
    actions
      .render(JSON.parse(JSON.stringify({ sections: upTo })), index)
      .catch((e: Error) => ({ error: e.message }))
      .then((result) => {
        rendered.set(key, result);
        if (live) setFetched({ key, result });
      });
    return () => {
      live = false;
    };
    // `upTo` is what `key` says it is.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, index, actions]);
  const fresh = rendered.get(key) ?? (fetched?.key === key ? fetched.result : undefined);
  // While a new version renders, the last one stays, so the page doesn't jump.
  const [last, setLast] = useState(fresh);
  if (fresh !== undefined && fresh !== last) setLast(fresh);
  return fresh ?? last;
}

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24) || "section";

function SectionView({
  entry,
  index,
  snapshot,
  actions,
  label,
  selected,
  onSelect,
  onShow,
  onText,
}: {
  entry: PageSection;
  index: number;
  /** The page as of the last change that needs a new render (words typed in place don't). */
  snapshot: PageSection[];
  actions: PageActions;
  label: string;
  selected: boolean;
  onSelect(): void;
  onShow(): void;
  onText(prop: string, value: string): void;
}) {
  const preview = usePreview(snapshot, index, actions);
  const textRef = useRef(onText);
  useEffect(() => {
    textRef.current = onText;
  }, [onText]);
  const scope = useMemo<SectionScopeValue>(() => ({ set: (prop, value) => textRef.current(prop, value) }), []);
  if (entry.hidden) {
    return (
      <div className={`gx-sec-hidden${selected ? " is-selected" : ""}`} data-sec={entry.id} onMouseDown={onSelect}>
        <span>{label} is hidden on the page</span>
        <button type="button" className="gx-button" onClick={onShow}>
          Show
        </button>
      </div>
    );
  }
  return (
    <div className={`gx-sec${selected ? " is-selected" : ""}`} data-sec={entry.id} onMouseDown={onSelect}>
      {preview === undefined ? (
        <div className="gx-sec-loading" />
      ) : preview.error ? (
        <p className="gx-block-error gx-sec-error">
          {label} can&apos;t show yet: {preview.error}
        </p>
      ) : (
        <SectionScope.Provider value={scope}>{preview.node}</SectionScope.Provider>
      )}
    </div>
  );
}

/** Where a picker or toolbar goes: a box on screen. */
type Box = { top: number; bottom: number; left: number; right: number };
const boxOf = (el: Element | null | undefined): Box | null => {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
};
/** A section's own box: its first element (the site's container), else the whole band. */
const sectionBox = (id: string) => {
  const el = document.querySelector(`[data-sec="${id}"]`);
  return boxOf(el?.firstElementChild ?? el);
};

export function PageEditor({
  page,
  revision,
  library,
  vocabulary = {},
  actions,
  viewUrl,
  editLinks,
  mainClassName = "",
  children,
}: {
  page: { sections: PageSection[] };
  revision: string;
  /** The site's sections (Galley's sectionsManifest). */
  library: LibrarySection[];
  /** Choices for settings that name a vocabulary ("posts", "topics"…). */
  vocabulary?: Vocabulary;
  actions: PageActions;
  viewUrl: string;
  /** Links to posts on the page get an "Edit post" button: a pattern for their href, and the editor's address ($1). */
  editLinks?: { from: string; to: string };
  /** The class of the site's <main> on this page. */
  mainClassName?: string;
  /** What comes after the page's main (its footer). */
  children?: React.ReactNode;
}) {
  const [sections, setSections] = useState(page.sections);
  const [snapshot, setSnapshot] = useState(page.sections);
  const [selected, setSelected] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<"list" | "settings" | null>(null);
  const [adding, setAdding] = useState<{ index: number; left: number; top: number } | null>(null);
  const [state, setState] = useState<"saved" | "dirty" | "saving" | "error">("saved");
  const [error, setError] = useState<string | null>(null);
  const [deleted, setDeleted] = useState<{ entry: PageSection; index: number } | null>(null);
  const latest = useRef(sections);
  const rev = useRef(revision);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const byName = useMemo(() => new Map(library.map((s) => [s.name, s])), [library]);
  const labelOf = (entry: PageSection) => byName.get(entry.type)?.label ?? entry.type;

  const flush = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    setState("saving");
    const result = await actions
      .save(JSON.parse(JSON.stringify({ sections: latest.current })), rev.current)
      .catch((e: Error): PageSaveResult => ({ ok: false, error: e.message }));
    if (result.ok) {
      rev.current = result.revision;
      setError(null);
      setState("saved");
    } else {
      setError(result.error);
      setState("error");
    }
  }, [actions]);

  /** Change the page. Words typed in place pass `quiet`: no new render, the page already shows them. */
  const change = useCallback(
    (next: PageSection[], quiet = false) => {
      latest.current = next;
      setSections(next);
      if (!quiet) setSnapshot(next);
      setState("dirty");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void flush(), 900);
    },
    [flush],
  );

  const update = (id: string, patch: Partial<PageSection>, quiet = false) =>
    change(
      latest.current.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      quiet,
    );
  const setProp = (id: string, prop: string, value: unknown, quiet = false) => {
    const entry = latest.current.find((s) => s.id === id);
    if (entry) update(id, { props: { ...entry.props, [prop]: value } }, quiet);
  };

  const unsaved = state !== "saved";
  useEffect(() => {
    if (!unsaved) return;
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [unsaved]);

  // ---- Arranging ----

  const move = (id: string, to: number) => {
    const list = [...latest.current];
    const from = list.findIndex((s) => s.id === id);
    if (from < 0 || to < 0 || to >= list.length) return;
    const [entry] = list.splice(from, 1);
    list.splice(to, 0, entry);
    change(list);
    requestAnimationFrame(() => document.querySelector(`[data-sec="${id}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
  };

  const add = (type: string, index: number) => {
    const section = byName.get(type);
    if (!section) return;
    const taken = new Set(latest.current.map((s) => s.id));
    let id = slug(section.label);
    while (taken.has(id)) id = `${slug(section.label)}-${Math.random().toString(36).slice(2, 6)}`;
    const entry: PageSection = { id, type, props: JSON.parse(JSON.stringify(section.defaults)) };
    const list = [...latest.current];
    list.splice(index, 0, entry);
    change(list);
    setAdding(null);
    setSelected(id);
    setDrawer("settings");
    setTimeout(() => document.querySelector(`[data-sec="${id}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" }), 250);
  };

  const remove = (id: string) => {
    const index = latest.current.findIndex((s) => s.id === id);
    if (index < 0) return;
    setDeleted({ entry: latest.current[index], index });
    change(latest.current.filter((s) => s.id !== id));
    setSelected(null);
    if (drawer === "settings") setDrawer(null);
  };

  const duplicate = (id: string) => {
    const index = latest.current.findIndex((s) => s.id === id);
    const entry = latest.current[index];
    if (!entry) return;
    const taken = new Set(latest.current.map((s) => s.id));
    let copy = `${entry.id}-copy`;
    while (taken.has(copy)) copy = `${entry.id}-${Math.random().toString(36).slice(2, 6)}`;
    const list = [...latest.current];
    list.splice(index + 1, 0, { ...JSON.parse(JSON.stringify(entry)), id: copy });
    change(list);
    setSelected(copy);
  };

  useEffect(() => {
    if (!deleted) return;
    const t = setTimeout(() => setDeleted(null), 8000);
    return () => clearTimeout(t);
  }, [deleted]);

  // ---- What's on screen: the toolbar over the selected section, a tag on the hovered one,
  // and "Edit post" on links to posts ----

  const [toolbar, setToolbar] = useState<{ top: number; left: number } | null>(null);
  const [hover, setHover] = useState<{ id: string; box: Box } | null>(null);
  const [postLink, setPostLink] = useState<{ href: string; box: Box } | null>(null);
  const bar = useRef<HTMLDivElement>(null);
  const linkPattern = useMemo(() => (editLinks ? new RegExp(editLinks.from) : null), [editLinks]);

  useEffect(() => {
    const place = () => {
      const box = selected ? sectionBox(selected) : null;
      if (!box || box.bottom < 100 || box.top > window.innerHeight - 40) return setToolbar(null);
      const width = bar.current?.offsetWidth ?? 420;
      const top = Math.min(Math.max(box.top - 22, 92), box.bottom - 50);
      setToolbar({ top, left: Math.min(Math.max(8, (box.left + box.right) / 2 - width / 2), window.innerWidth - width - 8) });
    };
    const onScroll = () => {
      place();
      setHover(null);
      setPostLink(null);
    };
    place();
    const frame = requestAnimationFrame(place);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", place);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", place);
    };
  }, [selected, sections, drawer]);

  const onOver = (e: React.MouseEvent) => {
    const target = e.target as Element;
    const sec = target.closest("[data-sec]");
    const id = sec?.getAttribute("data-sec") ?? null;
    if (!id) setHover(null);
    else if (hover?.id !== id) {
      const box = sectionBox(id);
      if (box) setHover({ id, box });
    }
    const a = target.closest("a[href]");
    const href = a?.getAttribute("href") ?? "";
    if (a && linkPattern?.test(href)) setPostLink({ href: href.replace(linkPattern, editLinks!.to), box: boxOf(a)! });
    else if (!target.closest(".gx-postlink")) setPostLink(null);
  };

  const selectedEntry = sections.find((s) => s.id === selected) ?? null;
  const selectedIndex = selectedEntry ? sections.indexOf(selectedEntry) : -1;
  const selectedSection = selectedEntry ? byName.get(selectedEntry.type) : undefined;
  const status = { saved: "Saved", dirty: "Saving…", saving: "Saving…", error: "Not saved" }[state];

  const openLibrary = (index: number, at: { left: number; top: number }) =>
    setAdding({ index, left: Math.min(Math.max(12, at.left), window.innerWidth - 372), top: Math.min(at.top, window.innerHeight - 440) });

  return (
    <>
      <style>{EDITOR_CSS}</style>
      <div className={`gx-session gx-pageedit${drawer ? " has-drawer" : ""}`} onMouseOver={onOver} onMouseLeave={() => setHover(null)}>
        <main
          className={mainClassName}
          // Links and forms on the page are the site's; in edit mode clicking selects instead.
          onClickCapture={(e) => {
            if ((e.target as Element).closest("a")) e.preventDefault();
          }}
          onSubmitCapture={(e) => e.preventDefault()}
        >
          {sections.map((entry, index) => (
            <Fragment key={entry.id}>
              <Gap onAdd={(at) => openLibrary(index, at)} />
              <SectionView
                entry={entry}
                index={snapshot.findIndex((s) => s.id === entry.id)}
                snapshot={snapshot}
                actions={actions}
                label={labelOf(entry)}
                selected={selected === entry.id}
                onSelect={() => setSelected(entry.id)}
                onShow={() => update(entry.id, { hidden: false })}
                onText={(prop, value) => setProp(entry.id, prop, value, true)}
              />
            </Fragment>
          ))}
          <Gap onAdd={(at) => openLibrary(sections.length, at)} last />
          {!sections.length ? <p className="gx-page-empty">This page has no sections yet. Add one with + .</p> : null}
        </main>
        {children}
      </div>

      {hover && hover.id !== selected ? (
        <span className="gx-sec-tag" style={{ top: Math.max(84, hover.box.top - 30), left: hover.box.left }}>
          {labelOf(sections.find((s) => s.id === hover.id) ?? { id: "", type: "", props: {} })}
        </span>
      ) : null}

      {postLink ? (
        <a className="gx-postlink" href={postLink.href} style={{ top: Math.max(84, postLink.box.top + 10), left: postLink.box.left + 10 }}>
          Edit post ↗
        </a>
      ) : null}

      {selectedEntry && toolbar ? (
        <div className="gx-ctx" ref={bar} style={{ top: toolbar.top, left: toolbar.left }} onMouseDown={(e) => e.preventDefault()}>
          <span className="gx-ctx-name">{labelOf(selectedEntry)}</span>
          <button type="button" className={drawer === "settings" ? "is-on" : ""} onClick={() => setDrawer((d) => (d === "settings" ? null : "settings"))}>
            Settings
          </button>
          <span className="gx-ctx-sep" />
          <button type="button" title="Move up" disabled={selectedIndex === 0} onClick={() => move(selectedEntry.id, selectedIndex - 1)}>
            ↑
          </button>
          <button type="button" title="Move down" disabled={selectedIndex === sections.length - 1} onClick={() => move(selectedEntry.id, selectedIndex + 1)}>
            ↓
          </button>
          <span className="gx-ctx-sep" />
          <button type="button" onClick={() => update(selectedEntry.id, { hidden: !selectedEntry.hidden })}>
            {selectedEntry.hidden ? "Show" : "Hide"}
          </button>
          {!selectedSection?.single ? (
            <button type="button" onClick={() => duplicate(selectedEntry.id)}>
              Duplicate
            </button>
          ) : null}
          <button type="button" className="gx-danger" onClick={() => remove(selectedEntry.id)}>
            Delete
          </button>
        </div>
      ) : null}

      {adding ? (
        <SectionLibrary
          library={library}
          present={new Set(sections.map((s) => s.type))}
          at={adding}
          onPick={(type) => add(type, adding.index)}
          onClose={() => setAdding(null)}
        />
      ) : null}

      <nav className="gx-rail" aria-label="Edit mode">
        <button type="button" className={`gx-rail-btn gx-rail-status is-${state}`} aria-label={status} data-tip={state === "saved" ? "Saved. Changes save as you go." : status} onClick={() => void flush()}>
          <i />
        </button>
        <span className="gx-rail-sep" />
        <button
          type="button"
          className="gx-rail-btn"
          aria-label="Add a section"
          data-tip="Add a section"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            openLibrary(selectedIndex >= 0 ? selectedIndex + 1 : sections.length, { left: r.left - 372, top: r.top });
          }}
        >
          <Icon name="plus" />
        </button>
        <button
          type="button"
          className={`gx-rail-btn${drawer === "list" ? " is-on" : ""}`}
          aria-label="Sections"
          data-tip="Sections: order, hide, settings"
          onClick={() => setDrawer((d) => (d === "list" ? null : "list"))}
        >
          <Icon name="layers" />
        </button>
        <span className="gx-rail-sep" />
        <a className="gx-rail-btn gx-rail-done" href={viewUrl} aria-label="Done" data-tip="Done: see the page">
          <Icon name="check" />
        </a>
      </nav>

      {error ? (
        <div className="gx-toast" role="alert">
          <b>Not saved.</b> {error}
        </div>
      ) : deleted ? (
        <div className="gx-toast gx-toast-quiet" role="status">
          Deleted {labelOf(deleted.entry)}.{" "}
          <button
            type="button"
            className="gx-link-button"
            onClick={() => {
              const list = [...latest.current];
              list.splice(deleted.index, 0, deleted.entry);
              change(list);
              setSelected(deleted.entry.id);
              setDeleted(null);
            }}
          >
            Undo
          </button>
        </div>
      ) : null}

      {drawer === "list" ? (
        <aside className="gx-drawer" data-lenis-prevent>
          <header className="gx-drawer-head">
            <b className="gx-drawer-title">Sections</b>
            <button type="button" className="gx-drawer-close" onClick={() => setDrawer(null)} aria-label="Close">
              ×
            </button>
          </header>
          <SectionList
            sections={sections}
            labelOf={labelOf}
            selected={selected}
            onSelect={(id) => {
              setSelected(id);
              setDrawer("settings");
              document.querySelector(`[data-sec="${id}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" });
            }}
            onToggle={(id, hidden) => update(id, { hidden })}
            onMove={move}
            onAdd={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              openLibrary(sections.length, { left: r.left, top: r.top - 400 });
            }}
          />
        </aside>
      ) : null}

      {drawer === "settings" && selectedEntry ? (
        <aside className="gx-drawer" data-lenis-prevent>
          <header className="gx-drawer-head">
            <button type="button" className="gx-drawer-close" onClick={() => setDrawer("list")} aria-label="All sections" title="All sections">
              ‹
            </button>
            <b className="gx-drawer-title">{labelOf(selectedEntry)}</b>
            <button type="button" className="gx-drawer-close" onClick={() => setDrawer(null)} aria-label="Close">
              ×
            </button>
          </header>
          <div className="gx-details" onKeyDown={(e) => e.stopPropagation()}>
            {selectedSection ? <p className="gx-panel-help">{selectedSection.description}</p> : null}
            {Object.entries(selectedSection?.props.properties ?? {}).map(([name, schema]) => (
              <Field
                key={`${selectedEntry.id}-${name}`}
                name={name}
                path={name}
                schema={schema}
                value={selectedEntry.props[name] ?? schema.default}
                required={(selectedSection?.props.required ?? []).includes(name)}
                context={{ vocabulary }}
                onChange={(value) => setProp(selectedEntry.id, name, value)}
              />
            ))}
            {selectedEntry.hidden ? <p className="gx-hint">Hidden: it isn&apos;t on the page until you show it again.</p> : null}
          </div>
        </aside>
      ) : null}
    </>
  );
}

/** Between two sections: a line with "+" when the pointer is near. */
function Gap({ onAdd, last = false }: { onAdd(at: { left: number; top: number }): void; last?: boolean }) {
  return (
    <div className={`gx-gap${last ? " is-last" : ""}`}>
      <div className="gx-gap-hit">
        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            onAdd({ left: r.left + r.width / 2 - 180, top: r.bottom + 8 });
          }}
        >
          + Add section
        </button>
      </div>
    </div>
  );
}

/** The site's sections, to add one. */
function SectionLibrary({
  library,
  present,
  at,
  onPick,
  onClose,
}: {
  library: LibrarySection[];
  present: Set<string>;
  at: { left: number; top: number };
  onPick(type: string): void;
  onClose(): void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  const groups = new Map<string, LibrarySection[]>();
  for (const s of library) groups.set(s.category ?? "Sections", [...(groups.get(s.category ?? "Sections") ?? []), s]);
  return (
    <div className="gx-insert gx-library" ref={ref} style={{ left: at.left, top: Math.max(12, at.top) }} data-lenis-prevent>
      <div className="gx-insert-list">
        {[...groups].map(([group, items]) => (
          <Fragment key={group}>
            <p className="gx-insert-group">{group}</p>
            {items.map((s) => {
              const taken = Boolean(s.single && present.has(s.name));
              return (
                <button key={s.name} type="button" className="gx-insert-item" disabled={taken} onClick={() => onPick(s.name)}>
                  <b>{s.label}</b>
                  <span>{taken ? "Already on this page (one per page)" : s.description}</span>
                </button>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

/** The page's sections in order: drag to reorder, the eye hides one, click for its settings. */
function SectionList({
  sections,
  labelOf,
  selected,
  onSelect,
  onToggle,
  onMove,
  onAdd,
}: {
  sections: PageSection[];
  labelOf(entry: PageSection): string;
  selected: string | null;
  onSelect(id: string): void;
  onToggle(id: string, hidden: boolean): void;
  onMove(id: string, to: number): void;
  onAdd(e: React.MouseEvent<HTMLButtonElement>): void;
}) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<number | null>(null);
  return (
    <div className="gx-details">
      <p className="gx-panel-help">The page, top to bottom. Drag to reorder, click one for its settings.</p>
      <ol className="gx-sec-list">
        {sections.map((entry, index) => (
          <li
            key={entry.id}
            className={`${selected === entry.id ? "is-on " : ""}${entry.hidden ? "is-hidden " : ""}${over === index ? "is-over" : ""}`}
            draggable
            onDragStart={(e) => {
              setDragging(entry.id);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => {
              if (!dragging) return;
              e.preventDefault();
              setOver(index);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragging) onMove(dragging, index);
              setDragging(null);
              setOver(null);
            }}
            onDragEnd={() => {
              setDragging(null);
              setOver(null);
            }}
          >
            <span className="gx-sec-grip" aria-hidden>
              ⠿
            </span>
            <button type="button" className="gx-sec-name" onClick={() => onSelect(entry.id)}>
              {labelOf(entry)}
            </button>
            <button type="button" className="gx-sec-eye" title={entry.hidden ? "Show" : "Hide"} aria-label={entry.hidden ? "Show" : "Hide"} onClick={() => onToggle(entry.id, !entry.hidden)}>
              {entry.hidden ? <Icon name="eye-off" /> : <Icon name="eye" />}
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="gx-button gx-wide" onClick={onAdd}>
        + Add section
      </button>
    </div>
  );
}
