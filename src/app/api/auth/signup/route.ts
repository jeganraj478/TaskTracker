import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signAccessToken, signRefreshToken } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/user';

export async function POST(req: Request) {
  const {name, email, password } = await req.json();
  await connectDB();

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({name, email, password: hash });

  const accessToken = await signAccessToken({ userId: (user._id).toString() });
  const refreshToken =await signRefreshToken({ userId: (user._id).toString() });

  const response = NextResponse.json({ success: true });

  response.cookies.set('access_token', accessToken, { httpOnly: true, path: '/' });
  response.cookies.set('refresh_token', refreshToken, { httpOnly: true, path: '/' });

  return response;
}
