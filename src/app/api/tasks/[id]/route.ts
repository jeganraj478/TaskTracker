// src/app/api/todos/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withProtectedApi } from '@/lib/withProtectedApi';
import  Todo  from '@/models/todo';

export const PATCH = withProtectedApi(async (userId, req, { params }) => {
  const resolvedParams = await params;
  const { title, status } = await req.json();

  const todo = await Todo.findOneAndUpdate(
    { _id: resolvedParams.id, userId },
    { title, status },
    { new: true }
  );

  if (!todo) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
  }

  return NextResponse.json(todo);
});

// If you have other methods in the same file, apply the same fix:
export const GET = withProtectedApi(async (userId, req, { params }) => {
  const resolvedParams = await params;
  
  const todo = await Todo.findOne({ _id: resolvedParams.id, userId });
  
  if (!todo) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
  }
  
  return NextResponse.json(todo);
});

export const DELETE = withProtectedApi(async (userId, req, { params }) => {
  const resolvedParams = await params;
  
  const todo = await Todo.findOneAndDelete({ _id: resolvedParams.id, userId });
  
  if (!todo) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
  }
  
  return NextResponse.json({ message: 'Todo deleted successfully' });
});