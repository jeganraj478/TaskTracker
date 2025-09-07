'use client';

import { useState, useMemo } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import type { DropResult, DroppableProvided } from '@hello-pangea/dnd';
import Column from './Column';
import EditTodo from './EditTodo';
import { Todo, TodoStatus, TodoUpsert } from '@/types/todo';

const todoStatuses: TodoStatus[] = ['todo', 'inprogress', 'done'];

interface KanbanBoardProps {
  todos: Todo[] | null | undefined;
  onSave: (todo: TodoUpsert) => void;
  onDelete: (id: string) => void;
}

export default function KanbanBoard({ todos, onSave, onDelete }: KanbanBoardProps) {
  const [editTodo, setEditTodo] = useState<Todo | null>(null);

  const grouped = useMemo(() => {
    const initial: Record<TodoStatus, Todo[]> = {
      todo: [],
      inprogress: [],
      done: [],
    };

    if (Array.isArray(todos)) {
      for (const t of todos) {
        if (initial[t.status]) {
          initial[t.status].push(t);
        }
      }
    }

    return initial;
  }, [todos]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as TodoStatus;

    const draggedTodo = Array.isArray(todos)
      ? todos.find((t) => t._id === draggableId)
      : null;

    if (draggedTodo && draggedTodo.status !== newStatus) {
      onSave({ _id: draggedTodo._id, title: draggedTodo.title, status: newStatus });
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {todoStatuses.map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided: DroppableProvided) => (
                <Column
                  todoStatus={status}
                  todos={grouped[status]}
                  provided={provided}
                  onEdit={setEditTodo}
                  onDelete={onDelete}
                />
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>


      {editTodo && (
        <EditTodo
          open={!!editTodo}
          editTodo={editTodo}
          onClose={() => setEditTodo(null)}
          onSave={onSave}
        />
      )}
    </>
  );
}
