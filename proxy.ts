import { NextResponse, NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define admin paths that need protection (except login page)
  const isAdminPath = path.startsWith('/admin') && path !== '/admin/login';
  const isLoginPath = path === '/admin/login';

  const sessionCookie = request.cookies.get('admin_session')?.value;

  if (isAdminPath && !sessionCookie) {
    // Redirect to login page if trying to access admin pages without session
    const url = new URL('/admin/login', request.url);
    return NextResponse.redirect(url);
  }

  if (isLoginPath && sessionCookie) {
    // Redirect to admin dashboard if already logged in and visiting login page
    const url = new URL('/admin', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
};
