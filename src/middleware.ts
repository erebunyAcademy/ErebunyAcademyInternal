import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createMiddleware from 'next-intl/middleware';
import { i18n } from './i18n';

const unauthorizedPaths = ['/signup', '/signin', '/forgot-password'];

const i18nMiddleware = createMiddleware({ ...i18n, localeDetection: false });

const isAuthPage = (pathname: string) => {
  const paths: string[] = [];
  i18n.locales.forEach(lang => {
    unauthorizedPaths.forEach(path => {
      paths.push(`/${lang}${path}`);
    });
  });
  return paths.includes(pathname);
};

export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    if (isAuthPage(req.nextUrl.pathname)) {
      if (!!token) {
        return NextResponse.redirect(`${process.env.BASE_URL}/dashboard`);
      }
    } else {
      if (!token) {
        return NextResponse.redirect(`${process.env.BASE_URL}/signin`);
      }
    }

    return i18nMiddleware(req);
  } catch (error) {
    console.error('Error in authentication: ', error);
    return NextResponse.redirect(`${process.env.BASE_URL}/signin`);
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|sitemap.xml|robots.txt|favicon.ico|browserconfig.xml).*)',
  ],
};
