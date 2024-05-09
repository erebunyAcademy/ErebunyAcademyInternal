import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { i18n } from './i18n';

const i18nMiddleware = createMiddleware({ ...i18n, localeDetection: false });

export async function middleware(req: NextRequest) {
  try {
    return i18nMiddleware(req);
  } catch (error) {
    console.error('Error in authentication: ', error);
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|sitemap.xml|robots.txt|favicon.ico|browserconfig.xml).*)',
  ],
};
