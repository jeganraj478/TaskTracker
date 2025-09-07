// lib/auth.ts
import { jwtVerify, SignJWT } from 'jose';

const accessSecret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);

export const signAccessToken = async (payload: Record<string, unknown>) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .sign(accessSecret);
};

export const signRefreshToken = async (payload: Record<string, unknown>) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(refreshSecret);
};

export const verifyAccessToken = async (token: string) => {
  const { payload } = await jwtVerify(token, accessSecret);
  return payload as { userId: string };
};

export const verifyRefreshToken = async (token: string) => {
  const { payload } = await jwtVerify(token, refreshSecret);
  return payload as { userId: string };
};
