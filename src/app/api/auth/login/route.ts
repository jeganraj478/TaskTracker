import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import { connectDB } from '@/lib/db';
import { signAccessToken, signRefreshToken } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  await connectDB();

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const accessToken = await signAccessToken({ userId: (user._id).toString() });
  const refreshToken =await signRefreshToken({ userId: (user._id).toString() });

  const response = NextResponse.json({ success: true ,user});

  response.cookies.set('access_token', accessToken, { httpOnly: true, path: '/' });
  response.cookies.set('refresh_token', refreshToken, { httpOnly: true, path: '/' });

  return response;
}
