// Edit mode's own pieces (gx- classes), layered over the site's real post page. The post
// itself keeps the site's styles; these only add the bar, the drawer, outlines on hover,
// and the forms and panels.

export const EDITOR_CSS = `
:root { --gx-ink: #1f1f1f; --gx-muted: #6b6b6b; --gx-line: #e6e5e2; --gx-blue: #4b7bec; --gx-font: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif; }
.gx-session.has-drawer { margin-right: 480px; transition: margin .2s; }
@media (max-width: 1200px) { .gx-session.has-drawer { margin-right: 0; } }

/* The drawer */
.gx-drawer { position: fixed; top: 92px; right: 84px; bottom: 24px; width: 380px; z-index: 2147482999; display: flex; flex-direction: column;
  background: #fff; color: var(--gx-ink); border-radius: 14px; box-shadow: 0 12px 48px rgba(0,0,0,.18), 0 0 0 1px rgba(0,0,0,.06);
  font: 14px/1.45 var(--gx-font); overflow: hidden; }
.gx-drawer button { font: inherit; }
.gx-drawer-head { display: flex; align-items: center; gap: 4px; padding: 8px; border-bottom: 1px solid var(--gx-line); }
.gx-drawer-head .gx-tabs { border: 0; padding: 0; flex: 1; }
.gx-drawer-close { border: 0; background: transparent; font-size: 20px !important; line-height: 1; width: 30px; height: 30px; border-radius: 8px; cursor: pointer; color: var(--gx-muted); }
.gx-drawer-close:hover { background: #f1f1ef; }
@media (max-width: 700px) { .gx-drawer { top: auto; left: 8px; right: 8px; bottom: 76px; width: auto; height: 60vh; } }

/* Things you can edit, on the site's own page */
/* Text edited in place hugs its words (inline-block), so its outline is the size of the text, not the column. */
.gx-editable { display: inline-block; max-width: 100%; min-width: 1ch; outline: 1.5px solid transparent; outline-offset: 4px; border-radius: 3px; cursor: text; transition: outline-color .15s; }
.gx-editable:hover { outline-color: rgba(75,123,236,.4); }
.gx-editable:focus { outline: 2px solid #4b7bec; }
.gx-editable:empty::before { content: attr(data-placeholder); color: #aaa; }
.gx-body { position: relative; }
.gx-doc { outline: none; min-height: 40vh; }
.gx-doc p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #aaa; float: left; height: 0; pointer-events: none; }
.gx-doc .gx-comment { background: #fdf0b3; box-shadow: 0 2px 0 #f2c94c; cursor: pointer; }
.gx-image { position: absolute; inset: 0; outline: 2px solid transparent; outline-offset: 6px; border-radius: inherit; transition: outline-color .15s; }
.gx-image:hover { outline-color: rgba(75,123,236,.35); }
.gx-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
.gx-image-tools, .gx-image-empty { font: 13px/1 var(--gx-font); }
.gx-image-tools { position: absolute; top: 12px; right: 12px; display: flex; gap: 2px; padding: 3px; border-radius: 10px; background: rgba(22,22,22,.9); opacity: 0; transition: opacity .15s; }
.gx-image:hover .gx-image-tools { opacity: 1; }
.gx-image-tools button { border: 0; background: transparent; color: #fff; border-radius: 7px; padding: 7px 10px; cursor: pointer; font: inherit; }
.gx-image-empty button { border: 0; background: #161616; color: #fff; border-radius: 9px; padding: 9px 13px; cursor: pointer; font: inherit; }
.gx-image-tools button:hover { background: rgba(255,255,255,.14); }
.gx-image-empty button:hover { background: #333; }
.gx-image-empty { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap;
  border: 1.5px dashed #c9c8c4; border-radius: inherit; background: #fafaf9; }

/* Components */
.gx-block { position: relative; border-radius: 6px; outline: 2px solid transparent; outline-offset: 6px; transition: outline-color .15s; }
.gx-block:hover { outline-color: rgba(75,123,236,.35); }
.gx-block.is-selected, .gx-block.is-editing { outline-color: #4b7bec; }
.gx-block-preview iframe, .gx-block-preview a { pointer-events: none; }
.gx-doc > .gx-block[data-motion] { box-shadow: -16px 0 0 -14px #4b7bec; }
.gx-block-error { font-size: 13px; color: #a5281b; background: #fdecea; border-radius: 6px; padding: 10px 12px; font-family: -apple-system, sans-serif; }
.gx-raw-source { margin: 0; white-space: pre-wrap; font: 13px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; color: #555; background: #fafaf9; border-radius: 6px; padding: 12px; }
.gx-raw-inline { font: 12px ui-monospace, Menlo, monospace; background: #f5f5f5; border-radius: 4px; padding: 1px 4px; color: #777; }
.gx-inline { position: relative; }
.gx-inline-chip { border: 1px solid #c9d6f5; background: #eef3fd; color: #1a49b6; border-radius: 6px; padding: 0 6px; font-size: .85em; cursor: pointer; }
.gx-inline-popover { position: absolute; left: 0; top: 1.8em; z-index: 10; width: 320px; background: #fff; border-radius: 10px; box-shadow: 0 8px 30px rgba(0,0,0,.15); display: block; }
.gx-skeleton { height: 120px; border-radius: 8px; background: linear-gradient(90deg, #f3f3f1 25%, #ebebe8 50%, #f3f3f1 75%); background-size: 200% 100%; animation: gx-shimmer 1.2s infinite; }
.gx-skeleton-small { height: 60px; margin-top: 8px; }
@keyframes gx-shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }

.gx-gutter { transform: translateX(-14px); }
.gx-grip { display: flex; align-items: center; justify-content: center; width: 22px; height: 26px; border-radius: 6px; color: #a3a3a3; cursor: grab; font-size: 15px; }
.gx-grip:hover { background: #f1f1ef; color: #555; }
.gx-bubble { display: flex; gap: 2px; background: #1f1f1f; border-radius: 8px; padding: 4px; box-shadow: 0 6px 20px rgba(0,0,0,.2); }
.gx-bubble button { border: 0; background: transparent; color: #fff; padding: 5px 9px; border-radius: 5px; cursor: pointer; font-size: 13px; font-family: -apple-system, sans-serif; }
.gx-bubble button:hover { background: #3a3a3a; }

/* Forms */
.gx-form { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; padding: 14px; border-radius: 8px; background: #fafaf9;
  border: 1px solid #ecebe8; font: 13px/1.4 -apple-system, BlinkMacSystemFont, "Inter", sans-serif; color: #1f1f1f; }
.gx-form-help { margin: 0; color: #6b6b6b; }
.gx-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.gx-field label { font-weight: 600; font-size: 12px; display: flex; gap: 6px; align-items: baseline; }
.gx-optional { font-weight: 400; color: #9a9a9a; }
.gx-field input[type=text], .gx-field input[type=number], .gx-field select, .gx-field textarea, .gx-reply-input {
  width: 100%; border: 1px solid #d9d8d4; border-radius: 6px; padding: 7px 9px; font: inherit; background: #fff; color: #1f1f1f; }
.gx-field textarea { resize: vertical; }
.gx-hint { color: #8a8a8a; font-size: 12px; }
.gx-form-error { color: #a5281b; margin: 0; font-size: 12px; }
.gx-form-actions { display: flex; justify-content: flex-end; gap: 6px; }
.gx-button { display: inline-flex; align-items: center; justify-content: center; gap: 6px; border: 1px solid #d9d8d4; background: #fff; border-radius: 8px;
  padding: 6px 12px; cursor: pointer; text-decoration: none; color: #1f1f1f; font-size: 13px; white-space: nowrap; }
.gx-button:hover { background: #f6f6f4; }
.gx-button:disabled { opacity: .5; cursor: default; }
.gx-drawer .gx-primary, .gx-block .gx-primary { background: #1f1f1f; border-color: #1f1f1f; color: #fff; }
.gx-drawer .gx-primary:hover, .gx-block .gx-primary:hover { background: #333; }
.gx-wide { width: 100%; }
.gx-link-button { border: 0; background: none; padding: 0; color: #1a49b6; cursor: pointer; font-size: 12px; font-weight: 500; }
.gx-row { display: flex; gap: 8px; }
.gx-row > .gx-field { flex: 1; }
.gx-row > .gx-narrow { flex: 0 0 76px; }

/* Panel */
.gx-tabs { display: flex; gap: 2px; padding: 8px; border-bottom: 1px solid #e6e5e2; }
.gx-tabs button { flex: 1; border: 0; background: transparent; border-radius: 6px; padding: 6px 4px; cursor: pointer; font-size: 12.5px; color: #555; white-space: nowrap; }
.gx-tabs button:hover { background: #f1f1ef; }
.gx-tabs button.is-on { background: #1f1f1f; color: #fff; }
.gx-panel-body { flex: 1; overflow: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.gx-panel-help, .gx-empty { margin: 0; color: #6b6b6b; font-size: 13px; }
.gx-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
/* Tiles keep their shape with padding, not aspect-ratio: Safari collapses aspect-ratio buttons in a grid. */
.gx-tile { position: relative; display: block; width: 100%; height: 0; padding: 0 0 66.6667%; border: 0; border-radius: 10px; overflow: hidden; background: #f3f3f1; cursor: pointer; }
.gx-tile img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .2s; }
.gx-tile:hover img { transform: scale(1.04); }
.gx-tile.is-on { box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--gx-blue); }
.gx-tile.is-on::after { content: "✓"; position: absolute; top: 6px; right: 6px; width: 22px; height: 22px; border-radius: 50%; background: var(--gx-blue); color: #fff;
  font: 700 12px/22px var(--gx-font); text-align: center; }
.gx-tile-tag { position: absolute; left: 6px; bottom: 6px; background: rgba(0,0,0,.6); color: #fff; font: 500 11px/1 var(--gx-font); border-radius: 5px; padding: 4px 6px; }
.gx-tile-pending { cursor: default; background: linear-gradient(90deg, #f3f3f1 25%, #ebebe8 50%, #f3f3f1 75%); background-size: 200% 100%; animation: gx-shimmer 1.2s infinite; }
.gx-tile-pending > span { position: absolute; inset: 0; display: grid; place-items: center; color: #8a8a8a; font-size: 12px; padding: 8px; text-align: center; }
.gx-tile-pending.is-failed { animation: none; background: #fdecea; }
.gx-tile-pending.is-failed > span { color: #a5281b; }
.gx-component { display: flex; flex-direction: column; gap: 2px; text-align: left; border: 1px solid #ecebe8; background: #fff; border-radius: 8px; padding: 10px 12px; cursor: pointer; }
.gx-component:hover { border-color: #c9d6f5; background: #f7f9fe; }
.gx-component span { color: #6b6b6b; font-size: 12.5px; }

/* Comments */
.gx-card { border: 1px solid #ecebe8; border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 8px; cursor: pointer; background: #fff; }
.gx-card.is-active { border-color: #f2c94c; box-shadow: 0 2px 12px rgba(242,201,76,.25); }
.gx-card textarea { width: 100%; border: 1px solid #d9d8d4; border-radius: 6px; padding: 8px; font: inherit; resize: vertical; }
.gx-card-head { display: flex; align-items: center; gap: 8px; }
.gx-card-head > span { display: flex; flex-direction: column; flex: 1; line-height: 1.2; }
.gx-card-head small, .gx-reply small { color: #8a8a8a; font-size: 11.5px; }
.gx-avatar { width: 26px; height: 26px; flex: 0 0 26px; border-radius: 50%; background: #4b7bec; color: #fff; display: grid; place-items: center; font-weight: 600; font-size: 12px; }
.gx-resolve { border: 1px solid #d9d8d4; background: #fff; border-radius: 50%; width: 26px; height: 26px; cursor: pointer; color: #2f6b34; }
.gx-resolve:hover { background: #eef6ee; }
.gx-quote { margin: 0; color: #8a8a8a; font-size: 12.5px; border-left: 2px solid #f2c94c; padding-left: 8px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.gx-comment-body { margin: 0; white-space: pre-wrap; }
.gx-reply { border-top: 1px solid #f1f1ef; padding-top: 8px; }
.gx-card-resolved { opacity: .7; cursor: default; }
.gx-resolved-toggle { align-self: flex-start; }


/* Adding and arranging blocks */
.gx-gutter { display: flex; align-items: center; gap: 1px; }
.gx-gutter-add { border: 0; background: transparent; width: 24px; height: 26px; border-radius: 6px; cursor: pointer; color: #a3a3a3; font: 20px/1 var(--gx-font); padding: 0; }
.gx-gutter-add:hover { background: #f1f1ef; color: #333; }
.gx-insert, .gx-menu { position: fixed; z-index: 2147483001; width: 300px; background: #fff; color: var(--gx-ink); border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0,0,0,.18), 0 0 0 1px rgba(0,0,0,.06); font: 13.5px/1.35 var(--gx-font); overflow: hidden; }
.gx-insert-search { width: 100%; border: 0; border-bottom: 1px solid var(--gx-line); padding: 12px 14px; font: inherit; outline: none; }
.gx-insert-list { max-height: 340px; overflow: auto; padding: 6px; }
.gx-insert-group { margin: 8px 8px 4px; font-size: 11px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: #9a9a9a; }
.gx-insert-item { display: flex; flex-direction: column; gap: 1px; width: 100%; text-align: left; border: 0; background: transparent; border-radius: 8px; padding: 7px 9px; cursor: pointer; font: inherit; color: inherit; }
.gx-insert-item span { color: var(--gx-muted); font-size: 12.5px; }
.gx-insert-item:hover, .gx-insert-item.is-on { background: #f1f4fd; }
.gx-menu { padding: 6px 8px 10px; width: 280px; }
.gx-menu-row { display: flex; flex-wrap: wrap; gap: 4px; padding: 0 4px; }
.gx-menu-row button { border: 0; background: #f3f3f1; border-radius: 7px; padding: 6px 9px; cursor: pointer; font: inherit; color: inherit; }
.gx-menu-row button:hover { background: #e9e9e6; }
.gx-menu-row .gx-danger:hover { background: #fdecea; color: #a5281b; }
.gx-menu .gx-motion-select { margin: 0 4px; width: calc(100% - 8px); }
.gx-motion-select { border: 1px solid #e3e2df; background: #fff; border-radius: 6px; padding: 4px 6px; font: 12px var(--gx-font); color: var(--gx-ink); cursor: pointer; }
.gx-motion-chip { margin-left: 8px; padding: 2px 7px; border-radius: 999px; background: #eef3fd; color: #1a49b6; font-size: 10.5px; letter-spacing: 0; text-transform: none; font-weight: 600; }
.gx-doc > [data-motion]:not(.gx-block) { position: relative; box-shadow: -16px 0 0 -14px #4b7bec; }
.gx-doc > [data-motion]:not(.gx-block)::after { content: "✦ Animates in"; position: absolute; right: 100%; top: .25em; margin-right: 40px; white-space: nowrap;
  font: 600 10.5px/1.6 var(--gx-font); color: #1a49b6; background: #eef3fd; border-radius: 999px; padding: 0 7px; pointer-events: none;
  opacity: 0; transition: opacity .15s; }
.gx-doc > [data-motion]:not(.gx-block):hover::after { opacity: 1; }
.gx-inline-chip.is-motion { border: 0; border-bottom: 2px dotted #e3b341; border-radius: 0; background: none; color: inherit; font: inherit; padding: 0; }
.gx-inline-chip.is-motion::after { content: "↑"; font: 700 .6em var(--gx-font); color: #c58a00; vertical-align: super; margin-left: 2px; }
.gx-bubble-sep { width: 1px; background: rgba(255,255,255,.18); margin: 4px 2px; }
.gx-bubble input { border: 0; outline: 0; background: #2a2a2a; color: #fff; border-radius: 5px; padding: 5px 8px; width: 240px; font: 13px var(--gx-font); }
.gx-bubble button.is-on { background: #3a3a3a; }
.gx-drawer-title { flex: 1; padding: 0 8px; font-size: 14px; }

@media (max-width: 700px) { .gx-session { padding-bottom: 96px; } }
.gx-insert-foot { border-top: 1px solid var(--gx-line); padding: 7px 12px; font-size: 11.5px; color: #9a9a9a; }
.gx-menu-list { display: flex; flex-direction: column; padding: 0 2px; }
.gx-menu-list button { display: flex; align-items: center; justify-content: space-between; gap: 8px; border: 0; background: transparent; border-radius: 7px; padding: 7px 8px; cursor: pointer; font: inherit; color: inherit; text-align: left; }
.gx-menu-list button:hover { background: #f1f1ef; }
.gx-menu-list button.is-on::after { content: "✓"; color: #1a49b6; font-weight: 700; }
.gx-menu-list .gx-danger { color: #b42318; }
.gx-menu-list .gx-danger:hover { background: #fdecea; }
.gx-motion-pop { position: absolute; top: calc(100% + 6px); right: 0; z-index: 7; min-width: 180px; padding: 4px; background: #fff; color: var(--gx-ink); border-radius: 10px; box-shadow: 0 12px 32px rgba(0,0,0,.18), 0 0 0 1px rgba(0,0,0,.06); }
.gx-motion-pop button { color: inherit !important; width: 100%; text-align: left; }
.gx-motion-pop button:hover { background: #f1f1ef !important; }
.gx-details { padding: 14px; display: flex; flex-direction: column; gap: 12px; overflow: auto; }
.gx-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.gx-chips button { border: 1px solid #d9d8d4; background: #fff; border-radius: 999px; padding: 4px 10px; cursor: pointer; font: inherit; font-size: 12.5px; color: #444; }
.gx-chips button.is-on { background: #161616; border-color: #161616; color: #fff; }
@media (max-width: 640px) {
  .gx-long { display: none; }
  .gx-short { display: inline; }
    .gx-doc > [data-motion]:not(.gx-block)::after { display: none; }
}
.gx-code { font: 12px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace !important; }
.gx-details .gx-field input[type=text], .gx-details .gx-field input[type=number], .gx-details .gx-field input[type=date], .gx-details .gx-field select, .gx-details .gx-field textarea {
  width: 100%; border: 1px solid #d9d8d4; border-radius: 7px; padding: 7px 9px; font: inherit; background: #fff; color: var(--gx-ink); }
.gx-details .gx-field label { font-weight: 600; font-size: 12px; }
.gx-advanced { border-top: 1px solid var(--gx-line); padding-top: 10px; }
.gx-advanced summary { cursor: pointer; font-size: 12.5px; font-weight: 600; color: var(--gx-muted); padding: 4px 0; }
.gx-advanced[open] summary { margin-bottom: 10px; }
.gx-advanced > .gx-field + .gx-field { margin-top: 12px; }

/* Picking terms: in Details and on the page */
.gx-picker { display: flex; flex-direction: column; min-width: 260px; font: 13.5px/1.35 var(--gx-font); color: var(--gx-ink); }
.gx-picker input { border: 0; border-bottom: 1px solid var(--gx-line); padding: 10px 12px; font: inherit; outline: none; background: transparent; }
.gx-picker-list { max-height: 260px; overflow: auto; padding: 4px; display: flex; flex-direction: column; }
.gx-picker-list button { display: flex; flex-direction: column; gap: 1px; text-align: left; border: 0; background: transparent; border-radius: 7px; padding: 7px 9px; cursor: pointer; font: inherit; color: inherit; }
.gx-picker-list button span { color: var(--gx-muted); font-size: 12px; }
.gx-picker-list button:hover, .gx-picker-list button.is-hover { background: #f1f4fd; }
.gx-picker-list button.is-on b::after { content: "  ✓"; color: #1a49b6; }
.gx-picker-add { color: #1a49b6 !important; font-weight: 600; }
.gx-picker .gx-form-error { padding: 0 12px 10px; }
.gx-termselect { position: relative; display: inline-block; }
.gx-termselect-value { display: inline-flex; align-items: center; justify-content: space-between; gap: 10px; min-width: 200px; border: 1px solid #d9d8d4; background: #fff; border-radius: 7px; padding: 7px 10px; font: inherit; cursor: pointer; color: var(--gx-ink); }
.gx-termselect-value span { color: var(--gx-muted); font-size: 11px; }
.gx-termselect-pop, .gx-term-pop { position: absolute; z-index: 30; top: calc(100% + 6px); left: 0; background: #fff; border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0,0,0,.18), 0 0 0 1px rgba(0,0,0,.06); overflow: hidden; display: block; }
.gx-termselect-pop > .gx-link-button { margin: 0 12px 10px; }
.gx-term { position: relative; display: inline-flex; }
.gx-term-chip { cursor: pointer; outline: 2px solid transparent; outline-offset: 3px; transition: outline-color .15s; }
.gx-term-chip:hover { outline-color: rgba(75,123,236,.45); }
.gx-term-x { border: 0; background: none; padding: 0 0 0 6px; margin-right: -4px; cursor: pointer; font: inherit; color: inherit; opacity: .45; }
.gx-term-x:hover { opacity: 1; }
.gx-term-add { opacity: .6; border-style: dashed !important; }
.gx-term-add:hover { opacity: 1; }
.gx-date { display: flex; align-items: center; gap: 10px; }
.gx-switch { display: inline-flex; align-items: center; gap: 8px; font-weight: 400 !important; cursor: pointer; }
.gx-fieldset { display: flex; flex-direction: column; gap: 10px; padding: 12px; border: 1px solid #ecebe8; border-radius: 10px; background: #fafaf9; }
.gx-rows { display: flex; flex-direction: column; gap: 8px; }
.gx-field-group > label { margin-bottom: 2px; }

/* The rail: the edit controls, down the right edge. Panels open out of it. */
.gx-rail { position: fixed; right: 16px; top: 50%; transform: translateY(-50%); z-index: 2147483000; display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 6px; background: #161616; border-radius: 16px; box-shadow: 0 12px 40px rgba(0,0,0,.28), 0 0 0 1px rgba(255,255,255,.06) inset; }
.gx-rail-btn { position: relative; display: grid; place-items: center; width: 40px; height: 40px; border: 0; background: transparent; color: #fff; border-radius: 11px; cursor: pointer; text-decoration: none; }
.gx-rail-btn:hover { background: rgba(255,255,255,.12); }
.gx-rail-btn.is-on { background: #fff; color: #161616; }
.gx-rail-done { background: #fff; color: #161616; }
.gx-rail-done:hover { background: #e7e7e4; }
.gx-rail-sep { width: 22px; height: 1px; background: rgba(255,255,255,.15); margin: 2px 0; }
.gx-rail-status i { width: 9px; height: 9px; border-radius: 50%; background: #4ade80; transition: background .2s; }
.gx-rail-status.is-dirty i, .gx-rail-status.is-saving i { background: #fbbf24; }
.gx-rail-status.is-error i { background: #f87171; }
.gx-rail-count { position: absolute; top: 3px; right: 3px; min-width: 16px; height: 16px; padding: 0 4px; border-radius: 8px; background: #f2c94c; color: #161616;
  font: 700 10px/16px var(--gx-font); font-style: normal; text-align: center; }
.gx-rail-btn[data-tip]:hover::after { content: attr(data-tip); position: absolute; right: calc(100% + 12px); top: 50%; transform: translateY(-50%); white-space: nowrap;
  background: #161616; color: #fff; font: 500 12px/1 var(--gx-font); padding: 8px 10px; border-radius: 8px; pointer-events: none; box-shadow: 0 6px 18px rgba(0,0,0,.2); }
.gx-drawer { border-radius: 16px; }
.gx-insert { z-index: 2147483002; }
@media (max-width: 700px) {
  .gx-rail { top: auto; bottom: 12px; right: 50%; transform: translateX(50%); flex-direction: row; }
  .gx-rail-sep { width: 1px; height: 22px; margin: 0 2px; }
  .gx-rail-btn[data-tip]:hover::after { display: none; }
  .gx-drawer { top: auto; left: 8px; right: 8px; bottom: 76px; width: auto; height: 62vh; }
}

/* One toolbar for what's selected */
.gx-ctx { position: fixed; z-index: 2147483001; display: flex; align-items: center; gap: 2px; padding: 3px; background: rgba(22,22,22,.95);
  -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); border-radius: 11px; color: #fff; font: 500 12.5px/1 var(--gx-font);
  box-shadow: 0 8px 26px rgba(0,0,0,.24); white-space: nowrap; }
.gx-ctx button { border: 0; background: transparent; color: #fff; border-radius: 7px; padding: 7px 9px; cursor: pointer; font: inherit; }
.gx-ctx button:hover { background: rgba(255,255,255,.14); }
.gx-ctx button.is-on { background: #fff; color: #161616; }
.gx-ctx .gx-danger:hover { background: #b42318; }
.gx-ctx-name { padding: 7px 8px; color: rgba(255,255,255,.55); }
.gx-ctx-sep { width: 1px; height: 18px; background: rgba(255,255,255,.18); margin: 0 3px; }
.gx-ctx-turn { position: relative; }
.gx-ctx-turn .gx-motion-pop { left: 0; right: auto; }
.gx-ctx .gx-motion-pop button { color: var(--gx-ink); }
.gx-ctx .gx-motion-pop button:hover { background: #f1f1ef; }
.gx-ctx-link input { width: 300px; border: 0; background: #2a2a2a; color: #fff; border-radius: 7px; padding: 8px 10px; font: inherit; outline: none; }

/* Choosing a picture, in the panel beside the post */
.gx-pick { position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; }
.gx-pick-body { flex: 1; overflow: auto; padding: 14px; display: flex; flex-direction: column; gap: 16px; }
.gx-pick-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.gx-pick-action { height: 40px; border: 1px solid #e3e2df; background: #fff; border-radius: 10px; cursor: pointer; font: 500 13px var(--gx-font); color: var(--gx-ink); }
.gx-pick-action:hover { background: #f6f6f4; }
.gx-pick-action.is-on { background: #161616; border-color: #161616; color: #fff; }
.gx-pick-action:disabled { opacity: .6; cursor: default; }
.gx-pick-make { display: flex; flex-direction: column; gap: 8px; padding: 12px; border-radius: 12px; background: #f6f6f4; }
.gx-pick-make textarea { width: 100%; border: 1px solid #d9d8d4; border-radius: 8px; padding: 8px 10px; font: 13px/1.45 var(--gx-font); resize: vertical; background: #fff; color: var(--gx-ink); }
.gx-pick-make select { flex: 1; min-width: 0; border: 1px solid #d9d8d4; border-radius: 8px; padding: 7px 8px; font: inherit; background: #fff; color: var(--gx-ink); }
.gx-pick-make .gx-hint { margin: 0; }
.gx-pick-section { display: flex; flex-direction: column; gap: 8px; }
.gx-pick-label { margin: 0; font: 600 11px/1 var(--gx-font); letter-spacing: .06em; text-transform: uppercase; color: #9a9a9a; }
.gx-pick-foot { display: flex; align-items: center; gap: 8px; padding: 10px 12px 10px 14px; border-top: 1px solid var(--gx-line); background: #fff; }
.gx-pick-foot span { flex: 1; color: var(--gx-muted); font-size: 12.5px; }
.gx-pick-foot .gx-primary { background: #1f1f1f; border-color: #1f1f1f; color: #fff; }
.gx-pick-drop { position: absolute; inset: 8px; display: grid; place-items: center; border: 2px dashed var(--gx-blue); border-radius: 12px; background: rgba(241,244,253,.94);
  color: #1a49b6; font-weight: 600; pointer-events: none; }
.gx-block-empty { display: grid; place-items: center; width: 100%; aspect-ratio: 16 / 9; border: 1.5px dashed #c9c8c4; border-radius: 10px; background: #fafaf9;
  color: var(--gx-muted); font: 500 14px var(--gx-font); cursor: pointer; }
.gx-block.is-picking .gx-block-empty { border-color: var(--gx-blue); color: #1a49b6; background: #f5f8fe; }
.gx-image.is-trying { outline-color: var(--gx-blue); }

/* Components move by grabbing them. Their insides never take the text selection (Safari paints it blue). */
.gx-block { -webkit-user-select: none; user-select: none; }
.gx-block input, .gx-block textarea, .gx-block select { -webkit-user-select: text; user-select: text; }
.gx-block-preview[draggable="true"] { cursor: grab; }
.gx-block-preview[draggable="true"]:active { cursor: grabbing; }
.gx-block-preview img { -webkit-user-drag: none; }
.gx-dropcursor { border-radius: 2px; }

/* Turning an animation on plays it once */
.gx-motion-play { animation: gx-motion-play .9s cubic-bezier(.2,.7,.2,1) both; }
@keyframes gx-motion-play { from { opacity: 0; transform: translateY(14px); } }

/* Saving went wrong */
.gx-toast { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); z-index: 2147483003; max-width: min(560px, calc(100vw - 32px));
  padding: 12px 16px; border-radius: 12px; background: #fff; color: #a5281b; font: 13.5px/1.45 var(--gx-font); box-shadow: 0 12px 40px rgba(0,0,0,.18), 0 0 0 1px #f3c4bd; }

.gx-multiline { white-space: pre-line; }

/* Fields: switches, steppers, a few choices side by side, posts with their covers */
.gx-field-switch { display: grid; grid-template-columns: 1fr auto; align-items: center; column-gap: 12px; }
.gx-field-switch .gx-hint { grid-column: 1 / -1; }
.gx-toggle { position: relative; width: 38px; height: 22px; border: 0; border-radius: 999px; background: #d4d3cf; cursor: pointer; padding: 0; transition: background .15s; }
.gx-toggle i { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.25); transition: transform .15s; }
.gx-toggle.is-on { background: #1f1f1f; }
.gx-toggle.is-on i { transform: translateX(16px); }
.gx-stepper { display: inline-flex; align-items: center; align-self: flex-start; border: 1px solid #d9d8d4; border-radius: 8px; background: #fff; overflow: hidden; }
.gx-stepper button { width: 34px; height: 32px; border: 0; background: transparent; cursor: pointer; font: 16px/1 var(--gx-font); color: var(--gx-ink); }
.gx-stepper button:hover:not(:disabled) { background: #f3f3f1; }
.gx-stepper button:disabled { color: #c4c3bf; cursor: default; }
.gx-stepper b { min-width: 32px; text-align: center; font: 600 13.5px var(--gx-font); }
.gx-segmented { display: inline-flex; align-self: flex-start; gap: 2px; padding: 3px; border-radius: 9px; background: #f1f1ef; }
.gx-segmented button { border: 0; background: transparent; border-radius: 7px; padding: 6px 11px; cursor: pointer; font: 500 12.5px var(--gx-font); color: #555; }
.gx-segmented button.is-on { background: #fff; color: var(--gx-ink); box-shadow: 0 1px 2px rgba(0,0,0,.1); }
.gx-picker-list button:has(.gx-picker-thumb) { display: grid; grid-template-columns: 56px 1fr; column-gap: 10px; align-items: center; }
.gx-picker-thumb { grid-row: span 2; width: 56px; height: 36px; border-radius: 5px; object-fit: cover; background: #eee; }
.gx-term-rows { display: flex; flex-direction: column; gap: 6px; }
.gx-term-row { display: grid; grid-template-columns: 56px 1fr auto; align-items: center; gap: 10px; padding: 6px; border: 1px solid #ecebe8; border-radius: 9px; background: #fff; }
.gx-term-row img, .gx-term-row i { width: 56px; height: 36px; border-radius: 5px; object-fit: cover; background: #eee; }
.gx-term-row b { font-weight: 500; font-size: 13px; line-height: 1.3; }
.gx-term-row button { border: 0; background: none; color: #999; cursor: pointer; font-size: 16px; padding: 4px 6px; }
.gx-term-row button:hover { color: var(--gx-ink); }
.gx-term-rows > .gx-termselect { align-self: flex-start; }

/* Pages built from sections */
/* A section is a band of the page (flow-root keeps its margins inside it); its outline is drawn over it. */
.gx-sec { position: relative; display: flow-root; }
.gx-sec-box { position: fixed; z-index: 2147482996; border: 1.5px solid rgba(75,123,236,.45); border-radius: 10px; pointer-events: none; }
.gx-sec-box.is-selected { border: 2px solid var(--gx-blue); }
.gx-sec-loading { height: 240px; margin: 24px auto; max-width: 1200px; border-radius: 12px; background: linear-gradient(90deg, #f3f3f1 25%, #ebebe8 50%, #f3f3f1 75%);
  background-size: 200% 100%; animation: gx-shimmer 1.2s infinite; }
.gx-sec-error { max-width: 720px; margin: 24px auto; }
.gx-sec-hidden { display: flex; align-items: center; justify-content: center; gap: 12px; max-width: 720px; margin: 24px auto; padding: 10px 14px;
  border: 1.5px dashed #d4d3cf; border-radius: 10px; color: var(--gx-muted); font: 13px var(--gx-font); background: #fafaf9; cursor: pointer; }
.gx-sec-hidden.is-selected { border-color: var(--gx-blue); }
.gx-sec-tag { position: absolute; top: 8px; left: 8px; padding: 5px 9px; border-radius: 6px; background: var(--gx-blue); color: #fff; font: 600 11.5px/1 var(--gx-font); }
.gx-gap { position: relative; height: 0; z-index: 3; }
.gx-gap-hit { position: absolute; left: 0; right: 0; top: -14px; height: 28px; display: flex; align-items: center; justify-content: center; }
.gx-gap-hit::before { content: ""; position: absolute; left: 50%; width: min(560px, 80%); transform: translateX(-50%); height: 2px; border-radius: 2px; background: var(--gx-blue);
  opacity: 0; transition: opacity .15s; }
.gx-gap-hit button { position: relative; border: 0; border-radius: 999px; padding: 6px 12px; background: var(--gx-blue); color: #fff; cursor: pointer; font: 600 12px/1 var(--gx-font);
  opacity: 0; transition: opacity .15s; box-shadow: 0 4px 14px rgba(75,123,236,.35); }
.gx-gap-hit:hover::before, .gx-gap-hit:hover button { opacity: 1; }
.gx-gap.is-last { height: 56px; }
.gx-gap.is-last .gx-gap-hit { top: 0; height: 56px; }
.gx-page-empty { text-align: center; color: var(--gx-muted); font: 14px var(--gx-font); padding: 64px 0; }
.gx-postlink { position: fixed; z-index: 2147482998; padding: 7px 11px; border-radius: 8px; background: rgba(22,22,22,.92); color: #fff !important; font: 500 12.5px/1 var(--gx-font);
  text-decoration: none !important; box-shadow: 0 6px 18px rgba(0,0,0,.2); }
.gx-postlink:hover { background: #000; }
.gx-library { width: 800px; display: grid; grid-template-columns: 320px 1fr; }
.gx-library .gx-insert-list { max-height: 460px; border-right: 1px solid var(--gx-line); }
.gx-library .gx-insert-item.is-on { background: #f1f4fd; }
.gx-library-preview { display: flex; flex-direction: column; gap: 10px; padding: 14px; background: #f6f6f4; min-width: 0; }
.gx-library-frame { position: relative; height: 300px; overflow: hidden; border-radius: 10px; background: #fff; box-shadow: 0 0 0 1px rgba(0,0,0,.06); }
.gx-library-frame .gx-skeleton { height: 100%; border-radius: 0; }
.gx-library-page { width: 1280px; padding-top: 32px !important; padding-bottom: 32px !important; transform: scale(.35); transform-origin: top left; pointer-events: none; }
.gx-library-about { margin: 0; font-size: 13px; line-height: 1.4; color: var(--gx-muted); }
.gx-library-about b { color: var(--gx-ink); margin-right: 4px; }
.gx-library-more { margin: 0; font-size: 12px; line-height: 1.4; color: #9a9a9a; }
@media (max-width: 860px) { .gx-library { width: calc(100vw - 24px); grid-template-columns: 1fr; } .gx-library-preview { display: none; } }
.gx-insert-item:disabled { opacity: .45; cursor: default; background: transparent !important; }
.gx-ctx button:disabled { opacity: .35; cursor: default; background: transparent; }
.gx-sec-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.gx-sec-list li { display: grid; grid-template-columns: 20px 1fr auto; align-items: center; gap: 6px; padding: 4px 4px 4px 8px; border: 1px solid #ecebe8; border-radius: 9px;
  background: #fff; }
.gx-sec-list li.is-on { border-color: var(--gx-blue); box-shadow: 0 0 0 1px var(--gx-blue); }
.gx-sec-list li.is-over { box-shadow: 0 -2px 0 var(--gx-blue); }
.gx-sec-list li.is-hidden .gx-sec-name { color: #a3a3a3; }
.gx-sec-grip { color: #b3b3b3; cursor: grab; font-size: 14px; }
.gx-sec-name { border: 0; background: none; text-align: left; padding: 8px 4px; cursor: pointer; font: 500 13.5px var(--gx-font); color: var(--gx-ink); }
.gx-sec-eye { display: grid; place-items: center; width: 32px; height: 32px; border: 0; border-radius: 7px; background: none; color: #8a8a8a; cursor: pointer; }
.gx-sec-eye:hover { background: #f1f1ef; color: var(--gx-ink); }
.gx-sec-eye svg { width: 16px; height: 16px; }
.gx-drawer-head .gx-drawer-close:first-child { font-size: 22px !important; }
.gx-toast-quiet { color: var(--gx-ink); box-shadow: 0 12px 40px rgba(0,0,0,.18), 0 0 0 1px rgba(0,0,0,.06); }

/* A block's own Edit button, on hover, like the cover's */
.gx-block-edit { position: absolute; top: 12px; right: 12px; z-index: 2; border: 0; border-radius: 9px; padding: 8px 12px; background: rgba(22,22,22,.9); color: #fff;
  font: 500 12.5px/1 var(--gx-font); cursor: pointer; opacity: 0; transition: opacity .15s; }
.gx-block:hover > .gx-block-edit, .gx-block.is-selected > .gx-block-edit { opacity: 1; }
.gx-block-edit:hover { background: #000; }
.gx-block.is-editing { outline-color: var(--gx-blue); }

/* The block panel */
.gx-pic { display: flex; align-items: center; gap: 12px; }
.gx-pic img, .gx-pic-empty { width: 112px; height: 72px; flex: 0 0 112px; border-radius: 8px; object-fit: cover; background: #f1f1ef; }
.gx-pic-empty { display: grid; place-items: center; color: var(--gx-muted); font-size: 12px; }
.gx-pic-actions { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
.gx-pic-actions small { color: var(--gx-muted); font-size: 12px; }
.gx-panel-foot { display: flex; gap: 8px; padding: 10px 14px; border-top: 1px solid var(--gx-line); }
.gx-danger-button { color: #b42318 !important; }
.gx-danger-button:hover { background: #fdecea !important; border-color: #f3c4bd !important; }
.gx-rail-btn:disabled { opacity: .35; cursor: default; background: transparent !important; }

/* Version history */
.gx-versions { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.gx-versions button { display: flex; flex-direction: column; gap: 2px; width: 100%; text-align: left; border: 0; background: transparent; border-radius: 8px; padding: 9px 10px;
  cursor: pointer; font: inherit; color: inherit; }
.gx-versions button:hover { background: #f1f4fd; }
.gx-versions span { color: var(--gx-muted); font-size: 12.5px; }
.gx-versionbar { position: fixed; z-index: 2147483000; top: 96px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 10px; padding: 8px 8px 8px 16px;
  border-radius: 14px; background: #161616; color: #fff; font: 13px/1.3 var(--gx-font); box-shadow: 0 12px 40px rgba(0,0,0,.28); white-space: nowrap; }
.gx-versionbar .gx-button { background: rgba(255,255,255,.12); border-color: transparent; color: #fff; }
.gx-versionbar .gx-button:hover { background: rgba(255,255,255,.2); }
.gx-versionbar .gx-primary { background: #fff; color: #161616; }
.gx-versionbar .gx-primary:hover { background: #e7e7e4; }
.gx-session.is-version .gx-gutter, .gx-session.is-version .gx-block-edit, .gx-session.is-version .gx-image-tools, .gx-session.is-version .gx-gap { display: none; }

/* How a post shows up when shared */
.gx-share { display: flex; flex-direction: column; gap: 8px; padding: 12px; border-radius: 12px; background: #f6f6f4; }
.gx-share-label { margin: 0; font: 600 11px/1 var(--gx-font); letter-spacing: .06em; text-transform: uppercase; color: #9a9a9a; }
.gx-serp { display: flex; flex-direction: column; gap: 3px; padding: 10px 12px; border-radius: 10px; background: #fff; font-family: Arial, sans-serif; }
.gx-serp span { color: #4d5156; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.gx-serp b { color: #1a0dab; font-size: 17px; font-weight: 400; line-height: 1.3; }
.gx-serp p { margin: 0; color: #4d5156; font-size: 13px; line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.gx-linkcard { border: 1px solid #e3e2df; border-radius: 12px; overflow: hidden; background: #fff; }
.gx-linkcard img, .gx-linkcard-empty { display: block; width: 100%; aspect-ratio: 1.91 / 1; object-fit: cover; background: #ececea; }
.gx-linkcard-empty { display: grid; place-items: center; color: var(--gx-muted); font-size: 12px; }
.gx-linkcard div { display: flex; flex-direction: column; gap: 2px; padding: 9px 12px 11px; }
.gx-linkcard small { color: #8a8a8a; font-size: 11.5px; }
.gx-linkcard b { font-size: 13.5px; line-height: 1.3; }
.gx-linkcard p { margin: 0; color: #6b6b6b; font-size: 12.5px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* The byline's people */
.gx-byline { display: inline; }
.gx-person { border: 0; background: none; padding: 0; font: inherit; color: inherit; border-radius: 4px; }
.gx-person.gx-term-add { margin-left: 8px; padding: 0 6px; border: 1px dashed currentColor !important; opacity: .55; }
`;
