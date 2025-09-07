// app/api/test-db/route.ts
import { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ status: 'connected' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'connection failed' }, { status: 500 });
  }
}
