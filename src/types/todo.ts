// types/todo.ts
export type TodoStatus = 'todo' | 'inprogress' | 'done';
export type Todo ={
  _id: string;
  title: string;
  status: TodoStatus;
  createdAt: string;
}

export type TodoUpsert={
  _id?: string;
  title: string;
  status: TodoStatus;
  createdAt?: string;
}
