// models/Todo.ts
import mongoose, { Schema, Document } from 'mongoose';
import { TodoStatus } from '@/types/todo';

export interface ITodo extends Document {
  title: string;
  status: TodoStatus;
  userId: mongoose.Types.ObjectId;
}

const TodoSchema = new Schema<ITodo>({
  title: String,
  status: { type: String, enum: ['todo','inprogress','done'], default: 'todo' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.models.Todo ||
       mongoose.model<ITodo>('Todo', TodoSchema);
