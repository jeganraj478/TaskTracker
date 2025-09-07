// app/api/todos/route.ts
import { NextResponse } from 'next/server';
import Todo from '@/models/todo';
import { withProtectedApi } from '@/lib/withProtectedApi';

export const GET = withProtectedApi(async (userId) => {
  const todos = await Todo.find({ userId });
  return NextResponse.json(todos);
});

export const POST = withProtectedApi(async (userId, req) => {
  const { title, status } = await req.json();
  const todo = await Todo.create({ title, status, userId });
  return NextResponse.json(todo);
});
