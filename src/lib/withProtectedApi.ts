// lib/withProtectedApi.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from './db';
import {
  verifyAccessToken,
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
} from './auth';

// Use Next.js App Router's expected context type
interface RouteContext {
  params: Promise<Record<string, string | string[]>>;
}

type HandlerFn = (
  userId: string, 
  req: NextRequest, 
  ctx: RouteContext
) => Promise<NextResponse>;

export function withProtectedApi(handler: HandlerFn) {
  return async function (req: NextRequest, ctx: RouteContext) {
    try {
      await connectDB();

      const accessToken = req.cookies.get('access_token')?.value;
      const refreshToken = req.cookies.get('refresh_token')?.value;

      let userId: string;
      let newAccess: string | null = null;
      let newRefresh: string | null = null;

      try {
        userId = (await verifyAccessToken(accessToken!)).userId;
      } catch {
        console.log('Access token invalid or expired');
        if (!refreshToken) throw new Error('No valid token');
        const payload = await verifyRefreshToken(refreshToken);
        userId = payload.userId;
        newAccess = await signAccessToken(payload);
        newRefresh = await signRefreshToken(payload);
      }

      const res = await handler(userId, req, ctx);

      if (newAccess && newRefresh) {
        res.headers.append(
          'Set-Cookie',
          `access_token=${newAccess}; Path=/; HttpOnly; SameSite=Strict`
        );
        res.headers.append(
          'Set-Cookie',
          `refresh_token=${newRefresh}; Path=/; HttpOnly; SameSite=Strict`
        );
      }

      return res;
    } catch (e) {
      console.error('Auth failed:', e);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  };
}