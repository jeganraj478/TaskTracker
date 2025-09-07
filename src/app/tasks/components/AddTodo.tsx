'use client';

import { useState } from 'react';
import { TodoStatus, TodoUpsert } from '@/types/todo';

interface AddTodoProps {
  onAdd: (todo: TodoUpsert) => void;
}

export default function AddTodo({ onAdd }: AddTodoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<TodoStatus>('todo');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), status });
    setTitle('');
    setStatus('todo');
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setTitle('');
    setStatus('todo');
    setIsModalOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <>
      {/* Add Todo Button */}
      <div className="add-todo-trigger">
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="add-todo-btn"
          title="Add new task"
        >
          <span className="add-todo-btn-icon">➕</span>
          <span className="add-todo-btn-text">Add New Task</span>
        </button>
      </div>

      {/* Add Todo Modal */}
      {isModalOpen && (
        <div className="kanban-modal-backdrop">
          <div className="kanban-modal-content">
            <h3>Add New Task</h3>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter task title..."
              autoFocus
            />

            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value as TodoStatus)}
              onKeyDown={handleKeyPress}
            >
              <option value="todo">TODO</option>
              <option value="inprogress">IN PROGRESS</option>
              <option value="done">DONE</option>
            </select>

            <div className="kanban-modal-actions">
              <button onClick={handleSubmit} className="kanban-modal-update-btn">
                Add Task
              </button>
              <button onClick={handleCancel} className="kanban-modal-cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}