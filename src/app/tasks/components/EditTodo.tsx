'use client';

import { useState, useEffect } from 'react';
import { Todo, TodoUpsert, TodoStatus } from '@/types/todo';

interface TodoModalProps {
  open: boolean;
  editTodo: Todo;
  onClose: () => void;
  onSave: (todo: TodoUpsert) => void;
}

export default function TodoModal({ open, editTodo, onClose, onSave }: TodoModalProps) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<TodoStatus>('todo');

  useEffect(() => {
    if (editTodo) {
      setTitle(editTodo.title);
      setStatus(editTodo.status);
    }
  }, [editTodo]);

  const handleUpdate = () => {
    if (!title.trim()) return;
    onSave({ _id: editTodo._id, title: title.trim(), status });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="kanban-modal-backdrop">
      <div className="kanban-modal-content">
        <h3>Edit Todo</h3>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />

        <select value={status} onChange={(e) => setStatus(e.target.value as TodoStatus)}>
          <option value="todo">TODO</option>
          <option value="inprogress">IN PROGRESS</option>
          <option value="done">DONE</option>
        </select>

        <div className="kanban-modal-actions">
          <button onClick={handleUpdate} className="kanban-modal-update-btn">Update</button>
          <button onClick={onClose} className="kanban-modal-cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );



}
