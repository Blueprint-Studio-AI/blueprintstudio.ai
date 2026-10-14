// Edit mode's own pieces (gx- classes), layered over the site's real post page. The post
// itself keeps the site's styles; these only add the bar, the drawer, outlines on hover,
// and the forms and panels.

export const EDITOR_CSS = `
:root { --gx-ink: #1f1f1f; --gx-muted: #6b6b6b; --gx-line: #e6e5e2; --gx-blue: #4b7bec; --gx-font: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif; }
.gx-session.has-drawer { margin-right: 400px; transition: margin .2s; }
@media (max-width: 1100px) { .gx-session.has-drawer { margin-right: 0; } }

/* The bar */
.gx-bar { position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%); z-index: 2147483000; display: flex; align-items: center; gap: 2px;
  padding: 6px; background: #161616; color: #fff; border-radius: 14px; box-shadow: 0 10px 40px rgba(0,0,0,.28), 0 0 0 1px rgba(255,255,255,.06) inset;
  font: 13px/1 var(--gx-font); max-width: calc(100vw - 24px); overflow-x: auto; }
.gx-bar a, .gx-bar button { font: inherit; color: inherit; text-decoration: none; border: 0; background: transparent; cursor: pointer; border-radius: 9px; padding: 9px 11px; white-space: nowrap; }
.gx-bar a:hover, .gx-bar button:hover { background: rgba(255,255,255,.1); }
.gx-short { display: none; }
.gx-bar-status { display: inline-flex; align-items: center; gap: 6px; color: rgba(255,255,255,.7) !important; }
.gx-bar-status i { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; }
.gx-bar-status.is-dirty i, .gx-bar-status.is-saving i { background: #fbbf24; }
.gx-bar-status.is-error i { background: #f87171; }
.gx-bar-sep { width: 1px; height: 18px; background: rgba(255,255,255,.15); margin: 0 4px; }
.gx-bar-tab.is-on { background: #fff !important; color: #161616 !important; }
.gx-bar-done { background: #fff !important; color: #161616 !important; font-weight: 600; margin-left: 2px; }
.gx-bar-done:hover { background: #e9e9e9 !important; }
.gx-toast { position: fixed; left: 50%; bottom: 80px; transform: translateX(-50%); z-index: 2147483000; max-width: min(640px, calc(100vw - 24px));
  background: #fdecea; color: #7d1d12; border: 1px solid #f5c6c0; border-radius: 10px; padding: 10px 14px; font: 13px/1.45 var(--gx-font); }

/* The drawer */
.gx-drawer { position: fixed; top: 96px; right: 16px; bottom: 84px; width: 380px; z-index: 2147482999; display: flex; flex-direction: column;
  background: #fff; color: var(--gx-ink); border-radius: 14px; box-shadow: 0 12px 48px rgba(0,0,0,.18), 0 0 0 1px rgba(0,0,0,.06);
  font: 14px/1.45 var(--gx-font); overflow: hidden; }
.gx-drawer button { font: inherit; }
.gx-drawer-head { display: flex; align-items: center; gap: 4px; padding: 8px; border-bottom: 1px solid var(--gx-line); }
.gx-drawer-head .gx-tabs { border: 0; padding: 0; flex: 1; }
.gx-drawer-close { border: 0; background: transparent; font-size: 20px !important; line-height: 1; width: 30px; height: 30px; border-radius: 8px; cursor: pointer; color: var(--gx-muted); }
.gx-drawer-close:hover { background: #f1f1ef; }
@media (max-width: 700px) { .gx-drawer { top: auto; left: 8px; right: 8px; bottom: 76px; width: auto; height: 60vh; } }

/* Things you can edit, on the site's own page */
.gx-editable { display: block; outline: 2px solid transparent; outline-offset: 6px; border-radius: 4px; cursor: text; transition: outline-color .15s; }
.gx-editable:hover { outline-color: rgba(75,123,236,.35); }
.gx-editable:focus { outline-color: #4b7bec; }
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
.gx-block.is-choosing { outline: none; }
.gx-block-dock { position: sticky; top: 92px; height: 0; z-index: 6; }
.gx-block-bar { position: absolute; top: 10px; right: 10px; z-index: 6; display: flex; align-items: center; gap: 2px; padding: 3px;
  background: rgba(22,22,22,.9); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); border-radius: 10px; color: #fff;
  font: 500 12.5px/1 var(--gx-font); opacity: 0; transform: translateY(-3px); transition: opacity .15s, transform .15s; pointer-events: none;
  box-shadow: 0 6px 20px rgba(0,0,0,.2); }
.gx-block:hover .gx-block-bar, .gx-block.is-selected .gx-block-bar, .gx-block.is-editing .gx-block-bar { opacity: 1; transform: none; pointer-events: auto; }
.gx-block.is-choosing .gx-block-dock { display: none; }
.gx-block-name { padding: 6px 8px; color: rgba(255,255,255,.55); cursor: grab; user-select: none; }
.gx-block-bar button { border: 0; background: transparent; color: #fff; border-radius: 7px; padding: 6px 9px; cursor: pointer; font: inherit; white-space: nowrap; }
.gx-block-bar button:hover { background: rgba(255,255,255,.14); }
.gx-block-bar button.is-on { background: #fff; color: #161616; }
.gx-block-bar .gx-danger:hover { background: #b42318; }
.gx-block-preview { pointer-events: none; }
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
.gx-tile { position: relative; aspect-ratio: 4 / 3; border: 0; padding: 0; border-radius: 8px; overflow: hidden; background: #f3f3f1; cursor: pointer; }
.gx-tile img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .2s; }
.gx-tile:hover img { transform: scale(1.04); }
.gx-tile-busy, .gx-tile-label { position: absolute; inset: auto 6px 6px 6px; background: rgba(0,0,0,.65); color: #fff; border-radius: 6px; font-size: 12px; padding: 4px 6px; }
.gx-tile-label { opacity: 0; transition: opacity .15s; }
.gx-tile:hover .gx-tile-label { opacity: 1; }
.gx-tile-pending { display: flex; align-items: center; justify-content: center; color: #8a8a8a; font-size: 12px; cursor: default;
  background: linear-gradient(90deg, #f3f3f1 25%, #ebebe8 50%, #f3f3f1 75%); background-size: 200% 100%; animation: gx-shimmer 1.2s infinite; }
.gx-tile-pending.is-failed { animation: none; color: #a5281b; background: #fdecea; padding: 8px; text-align: center; }
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
.gx-doc > [data-motion]:not(.gx-block)::after { content: "✦ " attr(data-motion); position: absolute; right: 100%; top: .25em; margin-right: 40px; white-space: nowrap;
  font: 600 10.5px/1.6 var(--gx-font); color: #1a49b6; background: #eef3fd; border-radius: 999px; padding: 0 7px; pointer-events: none;
  opacity: 0; transition: opacity .15s; }
.gx-doc > [data-motion]:not(.gx-block):hover::after { opacity: 1; }
.gx-inline-chip.is-motion { border: 0; border-bottom: 2px dotted #e3b341; border-radius: 0; background: none; color: inherit; font: inherit; padding: 0; }
.gx-inline-chip.is-motion::after { content: "↑"; font: 700 .6em var(--gx-font); color: #c58a00; vertical-align: super; margin-left: 2px; }
.gx-bubble-sep { width: 1px; background: rgba(255,255,255,.18); margin: 4px 2px; }
.gx-bubble input { border: 0; outline: 0; background: #2a2a2a; color: #fff; border-radius: 5px; padding: 5px 8px; width: 240px; font: 13px var(--gx-font); }
.gx-bubble button.is-on { background: #3a3a3a; }
.gx-drawer-title { flex: 1; padding: 0 8px; font-size: 14px; }

/* Choosing a picture, in place */
.gx-chooser { margin-top: 10px; border: 1px solid #e3e2df; border-radius: 12px; background: #fff; font: 13.5px/1.4 var(--gx-font); color: var(--gx-ink); overflow: hidden; }
.gx-chooser-head { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-bottom: 1px solid #efeeeb; }
.gx-chooser-head b { font-size: 13px; }
.gx-seg { display: inline-flex; gap: 2px; background: #f3f3f1; border-radius: 9px; padding: 3px; margin-left: auto; }
.gx-seg button { border: 0; background: transparent; border-radius: 7px; padding: 5px 10px; cursor: pointer; font: inherit; font-size: 12.5px; color: #555; }
.gx-seg button.is-on { background: #fff; color: var(--gx-ink); box-shadow: 0 1px 2px rgba(0,0,0,.08); }
.gx-chooser-close { border: 0; background: transparent; font-size: 20px; line-height: 1; width: 28px; height: 28px; border-radius: 7px; cursor: pointer; color: var(--gx-muted); }
.gx-chooser-close:hover { background: #f1f1ef; }
.gx-chooser-body { padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.gx-chooser .gx-grid { grid-template-columns: repeat(4, 1fr); max-height: 360px; overflow: auto; }
.gx-chooser .gx-row { flex-wrap: wrap; align-items: center; }
.gx-chooser select { border: 1px solid #d9d8d4; border-radius: 7px; padding: 6px 8px; font: inherit; background: #fff; }
.gx-prompt { width: 100%; border: 1px solid #d9d8d4; border-radius: 8px; padding: 8px 10px; font: inherit; resize: vertical; }
.gx-drop { border: 1.5px dashed #c9c8c4; border-radius: 10px; padding: 36px 16px; text-align: center; color: var(--gx-muted); cursor: pointer; background: #fafaf9; }
.gx-drop.is-over { border-color: var(--gx-blue); background: #f1f4fd; color: #1a49b6; }
.gx-dialog { position: fixed; inset: 0; z-index: 2147483002; background: rgba(20,20,20,.35); display: flex; align-items: center; justify-content: center; padding: 16px; }
.gx-dialog-card { width: min(760px, 100%); }
.gx-dialog-card .gx-chooser { margin: 0; box-shadow: 0 20px 60px rgba(0,0,0,.25); }
@media (max-width: 700px) { .gx-chooser .gx-grid { grid-template-columns: repeat(2, 1fr); } }

.gx-session { padding-bottom: 96px; }
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
  .gx-bar { gap: 0; padding: 5px; bottom: 12px; }
  .gx-bar a, .gx-bar button { padding: 9px 10px; }
  .gx-bar-status { font-size: 0 !important; }
  .gx-bar-status i { margin: 0 2px; }
  .gx-block-bar { top: 6px; right: 6px; }
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
`;
