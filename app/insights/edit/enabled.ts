/**
 * Whether this is a laptop, where edit mode works on the files on disk: development only.
 * GALLEY_EDITOR=1 no longer turns it on in a production build, since it has no sign-in. Edit
 * pages and actions also check the request is addressed to this machine (localEditingAllowed).
 */
export function editorEnabled() {
  return process.env.NODE_ENV !== "production";
}
