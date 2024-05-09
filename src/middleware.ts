import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { i18n } from './i18n';
import { SIGN_IN_ROUTE } from './utils/constants/routes';

export async function middleware(req: NextRequest) {
  const url = process.env.BASE_URL + SIGN_IN_ROUTE;
  try {
    // const token = await getToken({ req, secret: process.env.JWT_SECRET });

    // if (!token) {
    //   return NextResponse.redirect(url);
    // }
    const handleI18nRouting = createMiddleware({ ...i18n, localeDetection: false });

    return handleI18nRouting(req);
  } catch {
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|sitemap.xml|robots.txt|favicon.ico|browserconfig.xml).*)',
  ],
};
