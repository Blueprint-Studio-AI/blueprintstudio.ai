"use client";

// Newsletter capture matching the site's EmailCapture states/copy. Now that this
// lives inside the main app, it posts to the real same-origin /api/subscribe.
import { useRef, useState } from "react";
import { useTurnstileToken } from "@/lib/use-turnstile";
import { track } from "@/lib/analytics/track";
import { useBrand } from "@/components/brands/kit/BrandContext";

const ENDPOINT = "/api/subscribe";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Newsletter() {
  const { slug } = useBrand();
  const [email, setEmail] = useState("");
  const [nlCheck, setNlCheck] = useState(""); // honeypot: hidden, and named so browser autofill leaves it alone
  const mountedAtRef = useRef(Date.now());
  const { token: turnstileToken, containerRef: turnstileRef } = useTurnstileToken();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError("Enter a valid email");
      setStatus("error");
      track("form_submit", { form: "newsletter", ok: false, reason: "invalid_email", section: "footer" });
      return;
    }
    setStatus("loading");
    setError("");
    let code = 0; // the reply's HTTP status, for form_submit's reason when it fails
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          // Which brand page the sign-up came from (it was "jinba_footer_newsletter" on every one).
          source: `brands_${slug}_footer_newsletter`,
          nlCheck,
          elapsedMs: Date.now() - mountedAtRef.current,
          turnstileToken,
        }),
      });
      code = res.status;
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Subscription failed");
      setStatus("done");
      track("form_submit", { form: "newsletter", ok: true, section: "footer" });
    } catch (err) {
      track("form_submit", { form: "newsletter", ok: false, reason: code ? `http_${code}` : "network", section: "footer" });
      setError(err instanceof Error ? err.message : "Failed to subscribe");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="flex h-36 w-full max-w-[400px] items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800">
        <p className="text-neutral-400">Subscribed — thanks.</p>
      </div>
    );
  }

  return (
    <div className="flex h-36 w-full max-w-[400px] flex-col justify-between rounded-xl border border-neutral-700 bg-neutral-800">
      <p className="px-4 pt-4 text-neutral-300">
        Join our newsletter for insights on design, web development, and digital innovation.
      </p>
      <form onSubmit={submit} className="flex gap-2 px-4 pb-4" noValidate>
        <div
          style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
          aria-hidden="true"
        >
          <label htmlFor="nl-check">Leave this field empty</label>
          <input
            id="nl-check"
            name="nl_check"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={nlCheck}
            onChange={(e) => setNlCheck(e.target.value)}
          />
        </div>
        <div ref={turnstileRef} />
        <div className="relative w-full">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Enter your email"
            aria-label="Email address"
            aria-invalid={status === "error"}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            disabled={status === "loading"}
            className={`w-full rounded-full bg-white/5 px-4 py-2 text-[16px] text-neutral-300 placeholder:text-neutral-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-500 ${
              status === "error" ? "border border-red-800" : "border border-transparent"
            }`}
          />
          {status === "error" && (
            <p role="alert" className="absolute left-1 top-11 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-full bg-neutral-300 px-4 py-2 text-neutral-900 transition-colors hover:bg-neutral-400 disabled:cursor-not-allowed disabled:bg-neutral-600 disabled:text-neutral-400"
        >
          {status === "loading" ? "Loading…" : "Subscribe"}
        </button>
      </form>
    </div>
  );
}
