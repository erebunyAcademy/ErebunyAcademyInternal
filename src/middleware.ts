import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createMiddleware from 'next-intl/middleware';
import { i18n } from './i18n';
import { SIGN_IN_ROUTE } from './utils/constants/routes';

export async function middleware(req: NextRequest) {
  const url = process.env.BASE_URL + SIGN_IN_ROUTE;
  try {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    if (!token) {
      return NextResponse.redirect(url);
    }

    const { pathname } = new URL(req.nextUrl);

    if (pathname.includes('locales/')) {
      return NextResponse.next();
    }

    if (pathname.match('^/[a-zA-Z]{2}/faq$')) {
      return NextResponse.redirect(new URL('faq/vendor', req.url));
    }

    const handleI18nRouting = createMiddleware({ ...i18n, localeDetection: false });

    return handleI18nRouting(req);
  } catch {
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/'],
};
