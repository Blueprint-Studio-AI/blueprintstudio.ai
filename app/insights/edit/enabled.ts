/** The editor writes files, so it runs only in development unless GALLEY_EDITOR=1. */
export function editorEnabled() {
  return process.env.NODE_ENV !== "production" || process.env.GALLEY_EDITOR === "1";
}
