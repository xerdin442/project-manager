import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITask extends Document {
  user: Types.ObjectId
  project: Types.ObjectId
  description: string
  status: string
  priority: string
}

// Define the valid 'priority' and 'status' values
const STATUS: string[] = ['To-do', 'Completed', 'Awaiting Feedback', 'Deferred']
const PRIORITY: string[] = ['Normal', 'High', 'Very Urgent']

const taskSchema = new Schema<ITask>({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  project: { type: Schema.Types.ObjectId, required: true, ref: 'Project' },
  description: { type: String, required: true },
  status: { type: String, enum: STATUS, required: true, default: 'To-do' },
  priority: { type: String, enum: PRIORITY, required: true, default: 'Normal' }
})

export const Task = mongoose.model<ITask>('Task', taskSchema);