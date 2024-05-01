import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { SIGN_IN_ROUTE } from './utils/constants/routes';

export async function middleware(req: NextApiRequest) {
  const url = process.env.BASE_URL + SIGN_IN_ROUTE;
  try {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    if (!token) {
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/'],
};
