import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { clearGithubCache } from '@/lib/github';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Clear GitHub memory cache
    clearGithubCache();

    return NextResponse.json({ success: true, message: 'GitHub cache cleared successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to clear cache' }, { status: 500 });
  }
}
