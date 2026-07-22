// Clipboard copy with a secure-context guard, execCommand fallback, and a
// brief visual flash on the source element. Ported from the prototype.

export function flash(el: HTMLElement) {
  el.classList.add("copied");
  setTimeout(() => el.classList.remove("copied"), 700);
}

/**
 * Resolves true only if the text actually reached the clipboard. Callers that
 * just want the flash can ignore the result; a caller showing a "Copied"
 * confirmation should await it, so a blocked write doesn't report success.
 */
export function copyText(text: string, el?: HTMLElement | null): Promise<boolean> {
  const done = () => {
    if (el) flash(el);
    return true;
  };
  const fallback = () => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    ta.remove();
    return ok ? done() : false;
  };
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(done).catch(fallback);
  }
  return Promise.resolve(fallback());
}
