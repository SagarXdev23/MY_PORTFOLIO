/**
 * instrumentation.ts
 * Runs once on server startup (Node.js runtime only).
 * Sends a self-ping to /api/ping every 14 minutes to prevent
 * Render free tier from spinning down due to inactivity.
 */
export async function register() {
  // Only run in Node.js runtime (not Edge), and only in production
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.NODE_ENV === 'production'
  ) {
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

    if (!SITE_URL) {
      console.warn('[keep-alive] NEXT_PUBLIC_SITE_URL is not set. Self-ping disabled.');
      return;
    }

    const PING_URL = `${SITE_URL}/api/ping`;
    const INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

    const ping = async () => {
      try {
        const res = await fetch(PING_URL, { cache: 'no-store' });
        console.log(`[keep-alive] Pinged ${PING_URL} → ${res.status}`);
      } catch (err) {
        console.error(`[keep-alive] Ping failed:`, err);
      }
    };

    // Wait 1 minute after startup, then ping every 14 minutes
    setTimeout(() => {
      ping();
      setInterval(ping, INTERVAL_MS);
    }, 60_000);

    console.log(`[keep-alive] Self-ping scheduled every 14 min → ${PING_URL}`);
  }
}
