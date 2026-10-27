import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import authConfig from './auth.config';

const { auth } = NextAuth(authConfig);

// Lớp chặn sớm: chưa đăng nhập -> /login (kèm callbackUrl), user vào /admin -> /403
export default auth((req) => {
  const { nextUrl } = req;
  if (!req.auth) {
    const url = new URL('/login', nextUrl);
    url.searchParams.set('callbackUrl', nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(url);
  }
  if (nextUrl.pathname.startsWith('/admin') && req.auth.user.role !== 'admin') {
    return NextResponse.redirect(new URL('/403', nextUrl));
  }
});

export const config = { matcher: ['/dashboard/:path*', '/admin/:path*'] };
