'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Todo, TodoUpsert } from '@/types/todo';
import AddTodo from '@/app/tasks/components/AddTodo';
import KanbanBoard from '@/app/tasks/components/KanbanBoard';
import Spinner from '@/components/Spinner';
import Toast from '@/components/Toast';
import Navbar from '@/app/tasks/components/Navbar';

import './page.css';

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

export default function Page() {
  const { data: todos = [], isLoading, mutate } = useSWR<Todo[]>('/api/tasks', (url: string) =>
    fetch(url, { credentials: 'include', }).then((res) => res.json())
  );

  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        showToast('Logged out successfully!', 'success');
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Failed to logout', 'error');
    }
  };

  const upsertTodo = async (todo: TodoUpsert) => {
    const isNew = !todo._id;
    const path = isNew ? '/api/tasks' : `/api/tasks/${todo._id}`;

    if (isNew) {
      // For new todos, just make the API call and refetch
      try {
        const response = await fetch(path, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(todo),
        });

        if (!response.ok) throw new Error('Failed to create todo');

        mutate();
        showToast('Todo created successfully!', 'success');
      } catch (error) {
        console.error('Failed to create todo:', error);
        showToast('Failed to create todo', 'error');
      }
    } else {
      // For updates (drag & drop, edits) - use optimistic updates
      try {
        // Optimistically update UI immediately
        mutate((currentTodos: Todo[] = []) => {
          return currentTodos.map(t =>
            t._id === todo._id
              ? { ...t, ...todo }
              : t
          );
        }, false); // false = don't revalidate immediately

        // Make API call in background
        const response = await fetch(path, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(todo),
        });

        if (!response.ok) throw new Error('Failed to update todo');

        // Revalidate to ensure server consistency
        mutate();

        // Only show success toast for manual edits (not drag & drop)
        if (todo.title) {
          showToast('Todo updated successfully!', 'success');
        }
      } catch (error) {
        console.error('Failed to update todo:', error);

        // Revert optimistic update by revalidating
        mutate();
        showToast('Failed to update todo', 'error');
      }
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      // Optimistically remove from UI immediately
      mutate((currentTodos: Todo[] = []) => {
        return currentTodos.filter(t => t._id !== id);
      }, false);

      // Make API call in background
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete todo');

      // Revalidate to ensure server consistency
      mutate();
      showToast('Todo deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete todo:', error);

      // Revert optimistic update
      mutate();
      showToast('Failed to delete todo', 'error');
    }
  };
  if (isLoading && todos.length === 0) {
    return <Spinner />;
  }

  return (
    <>
      {/* Navbar */}
      <Navbar
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="kanban-container">
        <AddTodo onAdd={upsertTodo} />
        <KanbanBoard todos={todos} onSave={upsertTodo} onDelete={deleteTodo} />
      </div>


      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </>
  );
}