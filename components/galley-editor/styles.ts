// The editor's own look, self-contained (gx- classes) so it sits on any site. The post
// itself takes the site's styles through `proseClassName`; `.gx-prose` is a neutral default.

export const EDITOR_CSS = `
.gx-root { position: fixed; inset: 0; z-index: 2147483000; display: flex; flex-direction: column; background: #f1f1ef;
  color: #1f1f1f; font: 14px/1.45 -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif; }
.gx-root *, .gx-root *::before, .gx-root *::after { box-sizing: border-box; }
.gx-root button { font: inherit; }
.gx-top { display: flex; align-items: center; gap: 12px; padding: 10px 16px; background: #fff; border-bottom: 1px solid #e6e5e2; }
.gx-back { color: #6b6b6b; text-decoration: none; white-space: nowrap; }
.gx-back:hover { color: #111; }
.gx-top-title { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 40vw; }
.gx-top-space { flex: 1; }
.gx-chip { border: 0; border-radius: 999px; padding: 3px 10px; font-size: 12px; cursor: pointer; background: #eef6ee; color: #2f6b34; }
.gx-chip-dirty, .gx-chip-saving { background: #f3f3f1; color: #6b6b6b; }
.gx-chip-error { background: #fdecea; color: #a5281b; }

.gx-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 2px; padding: 6px 12px; background: #fff;
  border-bottom: 1px solid #e6e5e2; }
.gx-tool { min-width: 30px; height: 30px; padding: 0 7px; border: 0; border-radius: 6px; background: transparent; cursor: pointer; color: #333; }
.gx-tool:hover { background: #f1f1ef; }
.gx-tool.is-on { background: #e8eefc; color: #1a49b6; }
.gx-tool:disabled { opacity: .35; cursor: default; }
.gx-tool-text { font-size: 13px; }
.gx-sep { width: 1px; height: 20px; background: #e6e5e2; margin: 0 6px; }
.gx-style-select { height: 30px; border: 0; border-radius: 6px; background: transparent; padding: 0 6px; font: inherit; cursor: pointer; }
.gx-style-select:hover { background: #f1f1ef; }
.gx-link-form { display: flex; gap: 6px; margin: 0 4px; }
.gx-link-form input { height: 30px; width: 260px; border: 1px solid #d9d8d4; border-radius: 6px; padding: 0 8px; font: inherit; }

.gx-errors { background: #fdecea; color: #7d1d12; padding: 8px 16px; border-bottom: 1px solid #f5c6c0; font-size: 13px; }

.gx-main { flex: 1; display: flex; min-height: 0; }
.gx-canvas { flex: 1; overflow: auto; padding: 32px 24px 120px; }
.gx-page { position: relative; max-width: 860px; margin: 0 auto; background: #fff; border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 8px 24px rgba(0,0,0,.04); padding: 56px 72px 96px; }
.gx-title { display: block; width: 100%; border: 0; outline: 0; resize: none; overflow: hidden; font-size: 40px; line-height: 1.15; font-weight: 600;
  letter-spacing: -1px; color: #111; padding: 0; margin: 0 0 12px; background: transparent; font-family: inherit; }
.gx-summary { display: block; width: 100%; border: 0; outline: 0; resize: none; overflow: hidden; font: inherit; font-size: 17px; line-height: 1.5;
  color: #6b6b6b; padding: 0; margin: 0 0 32px; background: transparent; }
.gx-doc { outline: none; min-height: 50vh; }
.gx-doc > * + * { margin-top: 1.1em; }
.gx-doc p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #aaa; float: left; height: 0; pointer-events: none; }
.gx-doc .gx-comment { background: #fdf0b3; border-bottom: 2px solid #f2c94c; cursor: pointer; }
.gx-doc .ProseMirror-selectednode, .gx-doc ::selection { }
.gx-doc a { cursor: text; }

/* Neutral post styles, for sites that don't pass their own. */
.gx-prose { color: #404040; font-size: 17px; line-height: 1.75; }
.gx-prose h2 { font-size: 30px; line-height: 1.2; font-weight: 500; letter-spacing: -.5px; color: #171717; margin-top: 2em; }
.gx-prose h3 { font-size: 21px; font-weight: 500; letter-spacing: -.3px; color: #171717; margin-top: 1.6em; }
.gx-prose strong { font-weight: 600; color: #171717; }
.gx-prose a { color: #171717; text-decoration: underline; text-decoration-color: #c4c4c4; text-underline-offset: 2px; }
.gx-prose ul { list-style: disc; padding-left: 1.25em; }
.gx-prose ol { list-style: decimal; padding-left: 1.25em; }
.gx-prose li + li { margin-top: .35em; }
.gx-prose li::marker { color: #a3a3a3; }
.gx-prose blockquote { border-left: 2px solid #d4d4d4; padding-left: 1.2em; font-style: italic; color: #737373; }
.gx-prose code { background: #f5f5f5; border: 1px solid #e5e5e5; border-radius: 4px; padding: 1px 5px; font-size: .88em; }
.gx-prose pre { background: #f5f5f5; border: 1px solid #e5e5e5; border-radius: 8px; padding: 14px; overflow-x: auto; font-size: 14px; }
.gx-prose pre code { background: none; border: 0; padding: 0; }
.gx-prose hr { border: 0; border-top: 1px solid #e5e5e5; margin: 2.2em 0; }

/* Components */
.gx-block { position: relative; margin: 1.6em -12px; padding: 0 12px 12px; border-radius: 8px; outline: 1px solid transparent; transition: outline-color .15s; }
.gx-block:hover, .gx-block.is-selected, .gx-block.is-editing { outline-color: #c9d6f5; }
.gx-block.is-selected { outline: 2px solid #4b7bec; }
.gx-block-bar { display: flex; align-items: center; justify-content: space-between; gap: 8px; height: 30px; font-size: 12px;
  color: #6b6b6b; cursor: grab; user-select: none; font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif; line-height: 1; }
.gx-block-name { font-weight: 600; letter-spacing: .02em; text-transform: uppercase; font-size: 11px; color: #8a8a8a; }
.gx-block-tools { display: flex; gap: 2px; opacity: 0; transition: opacity .15s; }
.gx-block:hover .gx-block-tools, .gx-block.is-selected .gx-block-tools, .gx-block.is-editing .gx-block-tools { opacity: 1; }
.gx-block-tools button { border: 0; background: #f1f1ef; border-radius: 6px; padding: 5px 9px; font-size: 12px; cursor: pointer; }
.gx-block-tools button:hover { background: #e6e5e2; }
.gx-block-tools .gx-danger:hover { background: #fdecea; color: #a5281b; }
.gx-block-preview { pointer-events: none; }
.gx-block-preview > :first-child { margin-top: 0 !important; }
.gx-block-preview > :last-child { margin-bottom: 0 !important; }
.gx-block-preview iframe, .gx-block-preview a { pointer-events: none; }
.gx-block-error { font-size: 13px; color: #a5281b; background: #fdecea; border-radius: 6px; padding: 10px 12px; font-family: -apple-system, sans-serif; }
.gx-raw-source { margin: 0; white-space: pre-wrap; font: 13px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; color: #555; background: #fafaf9; border-radius: 6px; padding: 12px; }
.gx-raw-inline { font: 12px ui-monospace, Menlo, monospace; background: #f5f5f5; border-radius: 4px; padding: 1px 4px; color: #777; }
.gx-inline { position: relative; }
.gx-inline-chip { border: 1px solid #c9d6f5; background: #eef3fd; color: #1a49b6; border-radius: 6px; padding: 0 6px; font-size: .85em; cursor: pointer; }
.gx-inline-popover { position: absolute; left: 0; top: 1.8em; z-index: 10; width: 320px; background: #fff; border-radius: 10px; box-shadow: 0 8px 30px rgba(0,0,0,.15); display: block; }
.gx-skeleton { height: 120px; border-radius: 8px; background: linear-gradient(90deg, #f3f3f1 25%, #ebebe8 50%, #f3f3f1 75%); background-size: 200% 100%; animation: gx-shimmer 1.2s infinite; }
.gx-skeleton-small { height: 60px; margin-top: 8px; }
@keyframes gx-shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }

.gx-grip { display: flex; align-items: center; justify-content: center; width: 20px; height: 24px; border-radius: 4px; color: #b0afab; cursor: grab; font-size: 14px; }
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
.gx-root .gx-primary { background: #1f1f1f; border-color: #1f1f1f; color: #fff; }
.gx-root .gx-primary:hover { background: #333; }
.gx-wide { width: 100%; }
.gx-link-button { border: 0; background: none; padding: 0; color: #1a49b6; cursor: pointer; font-size: 12px; font-weight: 500; }
.gx-row { display: flex; gap: 8px; }
.gx-row > .gx-field { flex: 1; }
.gx-row > .gx-narrow { flex: 0 0 76px; }

/* Panel */
.gx-panel { width: 340px; flex: 0 0 340px; display: flex; flex-direction: column; background: #fff; border-left: 1px solid #e6e5e2; min-height: 0; }
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

/* Post list */
.gx-list-root { overflow: auto; display: block; padding: 64px 16px; }
.gx-list { max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 10px; }
.gx-list-eyebrow { margin: 0; font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: #9a9a9a; }
.gx-list-title { margin: 0; font-size: 36px; font-weight: 600; letter-spacing: -1px; }
.gx-list-items { list-style: none; margin: 16px 0 0; padding: 0; background: #fff; border: 1px solid #e6e5e2; border-radius: 10px; overflow: hidden; }
.gx-list-items li + li { border-top: 1px solid #efeeeb; }
.gx-list-items a { display: flex; justify-content: space-between; gap: 16px; padding: 14px 18px; color: #1f1f1f; text-decoration: none; }
.gx-list-items a:hover { background: #fafaf9; }
.gx-list-items span { font-weight: 500; }
.gx-list-items small { color: #9a9a9a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 40%; }
.gx-list-items .gx-list-bad { color: #a5281b; }

@media (max-width: 900px) {
  .gx-panel { display: none; }
  .gx-page { padding: 32px 20px 80px; }
  .gx-canvas { padding: 12px 8px 80px; }
}
`;
