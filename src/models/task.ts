import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITask extends Document {
  member: Types.ObjectId
  project: Types.ObjectId
  assignedBy: Types.ObjectId
  description: string
  status: string
  urgent: boolean
}

// Define the valid 'priority' and 'status' values
const STATUS: string[] = ['To-do', 'Completed', 'Delayed']

const taskSchema = new Schema<ITask>({
  member: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  project: { type: Schema.Types.ObjectId, required: true, ref: 'Project' },
  assignedBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  description: { type: String, required: true },
  status: { type: String, enum: STATUS, required: true, default: 'To-do' },
  urgent: { type: Boolean, required: true }
})

export const Task = mongoose.model<ITask>('Task', taskSchema);