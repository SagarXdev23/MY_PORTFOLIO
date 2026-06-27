import { NextResponse } from 'next/server';

/**
 * GET /api/ping
 * Keep-alive endpoint — pinged every 10 minutes by an external cron service
 * (e.g. cron-job.org) to prevent Render free tier from spinning down.
 */
export async function GET() {
  return NextResponse.json(
    { status: 'ok', timestamp: new Date().toISOString() },
    { status: 200 }
  );
}
