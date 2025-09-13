import { NextRequest, NextResponse } from 'next/server';
import {  signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from './lib/auth';


export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('access_token')?.value;
  const refreshToken = req.cookies.get('refresh_token')?.value;

  const url = req.nextUrl.clone();

  // Helper to redirect to login
  const redirectToLogin = () => {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  };

  try {
    if (accessToken) {
     (await verifyAccessToken(accessToken));
      return NextResponse.next(); // valid access token
    }
  } catch {
    console.log('Access token invalid or expired');
  }
  // If access token invalid, try refresh token
  if (refreshToken) {
    try {
      const payload  = await verifyRefreshToken(refreshToken);
      const userId = payload.userId;

      if (typeof userId !== 'string') throw new Error('Invalid payload');

      //  Issue new tokens
      const newAccessToken = await signAccessToken(payload);
      const newRefreshToken = await signRefreshToken(payload);

      const response = NextResponse.next();

      response.cookies.set('access_token', newAccessToken, {
        httpOnly: true,
        path: '/',
      });

      response.cookies.set('refresh_token', newRefreshToken, {
        httpOnly: true,
        path: '/',
      });

      return response;
    } catch {
      console.log('Refresh token invalid');
      return redirectToLogin();
    }
  }

  return redirectToLogin(); // No valid token found
}

// Match protected routes
export const config = {
  matcher: ['/todo','/todos'], // protect home, todo page
};
