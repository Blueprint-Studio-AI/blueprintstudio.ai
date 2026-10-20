// lib/spam-guard.ts
// Basic, server-side spam checks for the newsletter forms.

/** Below this, a submission is treated as a bot. */
const MIN_SUBMIT_MS = 1500;

/** True if the honeypot field was filled in -- only bots do this. */
export function honeypotTripped(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

/** True if the form was submitted faster than a person could. Missing value lets it through. */
export function submittedTooFast(elapsedMs: unknown): boolean {
  if (typeof elapsedMs !== 'number' || !Number.isFinite(elapsedMs)) return false;
  return elapsedMs < MIN_SUBMIT_MS;
}

/** Verifies a Turnstile token server-side. Passes automatically when Turnstile isn't configured. */
export async function verifyTurnstile(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== 'string' || !token) return false;

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = await res.json();
    return data?.success === true;
  } catch (err) {
    console.error('Turnstile verify error:', err);
    return false;
  }
}
