// Clipboard copy with a secure-context guard, execCommand fallback, and a
// brief visual flash on the source element. Ported from the prototype.

export function flash(el: HTMLElement) {
  el.classList.add("copied");
  setTimeout(() => el.classList.remove("copied"), 700);
}

export function copyText(text: string, el?: HTMLElement | null) {
  const done = () => el && flash(el);
  const fallback = () => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      done();
    } catch {
      /* ignore */
    }
    ta.remove();
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done).catch(fallback);
  } else {
    fallback();
  }
}
