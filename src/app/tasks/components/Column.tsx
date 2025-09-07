'use client';

import type { DroppableProvided } from '@hello-pangea/dnd';
import { Draggable } from '@hello-pangea/dnd';
import { Todo } from '@/types/todo';

interface ColumnProps {
  todoStatus: string;
  todos: Todo[];
  provided: DroppableProvided;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export default function Column({ todoStatus, todos, provided, onEdit, onDelete }: ColumnProps) {
  return (
    <div className="kanban-column">
      {/* Column title is now outside the droppable area */}
      <h2 className="kanban-column-title">{todoStatus}</h2>
      
      {/* Droppable area for cards only */}
      <div 
        ref={provided.innerRef} 
        
        {...provided.droppableProps} 
        className="kanban-column-droppable"
      >
        {todos.map((todo, index) => (
          <Draggable key={todo._id} draggableId={todo._id} index={index}>
            {(r) => (
              <div
                ref={r.innerRef}
                {...r.draggableProps}
                {...r.dragHandleProps}
                className="kanban-card"
                style={r.draggableProps.style}
              >
                <span className="kanban-card-title">{todo.title}</span>
                <div className="kanban-card-actions">
                  <button onClick={() => onEdit(todo)} title="Edit">✏️</button>
                  <button onClick={() => onDelete(todo._id)} title="Delete">🗑️</button>
                </div>
              </div>
            )}
          </Draggable>
        ))}
        
        {provided.placeholder}
      </div>
    </div>
  );
}