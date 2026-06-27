import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { signToken } from '@/lib/auth';


export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const expectedUsername = process.env.ADMIN_USERNAME || 'SagarMishra@12345';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'sagar991';

    if (username === expectedUsername && password === expectedPassword) {
      const token = signToken({ role: 'admin', username });
      
      const cookieStore = await cookies();
      cookieStore.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day in seconds
        path: '/',
      });

      return NextResponse.json({ success: true, message: 'Logged in successfully' });
    }

    return NextResponse.json({ success: false, error: 'Invalid username or password' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to authenticate' }, { status: 500 });
  }
}
